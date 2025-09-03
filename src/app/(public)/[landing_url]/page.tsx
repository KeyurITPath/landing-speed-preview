import { fetchCountryCodeHandler, fetchCourseForLanding } from '@services/course-service';
import { TIMEZONE, USER_ROLE } from '@utils/constants';
import { cookies } from 'next/headers';
import MainLanding from './MainLanding';
import { api } from '@/api';
import momentTimezone from 'moment-timezone';
import moment from 'moment';
import { decodeToken, isEmptyObject, isTokenActive } from '@/utils/helper';
import { fetchIP, getDomain } from '@/utils/domain';
import NoData from '../redirecting-page/NoData';

const Landing = async ({ params, searchParams }: any) => {
  const cookieStore = await cookies();
  const domain_value = await getDomain()
  const token = cookieStore.get('token')?.value || null;
  const country_value = cookieStore.get('country_code')?.value || null;

  let user = {};
  let isLoggedIn;
  if (token) {
    user = decodeToken(token);
    isLoggedIn = isTokenActive(token);
  }

  const IP = await fetchIP();
  // IP address with country code
  const country_code = await fetchCountryCodeHandler(IP);

  const slug = await params;
  const discountCode = await searchParams;

  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });

  const courseResponse = await fetchCourseForLanding({
    params: {
      final_url: slug.landing_url,
      ...(discountCode?.discount_code
        ? { discount_code: discountCode?.discount_code }
        : {}),
      domain: domain_value,
    },
    headers: {
      'req-from': country_value || country_code,
    },
  });

  const currentTime = momentTimezone().tz(TIMEZONE);

const isBecomeAMemberWithVerified = () => {
  if (!user || isEmptyObject(user)) return false;

  if (
    ![USER_ROLE.CUSTOMER, USER_ROLE.AUTHOR].includes(user.role) ||
    !user.is_verified
  ) {
    return false;
  }

  let subscriptionEndDate: moment.Moment | null = null;

  if (user?.subscription_end_date) {
    subscriptionEndDate = momentTimezone(user.subscription_end_date).tz(TIMEZONE);
  }

  return (
    !user.is_subscribed ||
    (subscriptionEndDate && moment.isMoment(subscriptionEndDate) && !subscriptionEndDate?.isAfter(currentTime))
  );
};


 const isBecomeVerifiedAndSubscribed = () => {
  if (!user) return false;

  if (
    ![USER_ROLE.CUSTOMER, USER_ROLE.AUTHOR].includes(user.role) ||
    !user.is_verified
  ) {
    return false;
  }

  const subscriptionEndDate = user?.subscription_end_date
    ? momentTimezone(user.subscription_end_date).tz(TIMEZONE)
    : null;

  const isSubscribed = !!user?.is_subscribed;

  const isSubscriptionActive =
    subscriptionEndDate && momentTimezone.isMoment(subscriptionEndDate)
      ? subscriptionEndDate?.isAfter(currentTime)
      : false;

  return (isSubscribed && isSubscriptionActive) || user.is_lifetime === true;
};

  const landingData = {
    data: courseResponse?.data?.landing_page_translations?.[0] || {},
    loading: false,
    course: courseResponse?.data?.course || {},
    domainDetails: response.data?.data || {},
    user,
    country: {
      country_code: country_value || country_code,
    },
    isLoggedIn,
    isBecomeAMemberWithVerified: isBecomeAMemberWithVerified(),
    isBecomeVerifiedAndSubscribed: isBecomeVerifiedAndSubscribed(),
  };

  if(!courseResponse?.defaultCoursePrice || !courseResponse?.data?.id){
    return <NoData/>
  }

  const activeLandingPage = courseResponse?.data?.landing_name;

  return <MainLanding {...{ landingData, activeLandingPage }} />;
};

export default Landing;
