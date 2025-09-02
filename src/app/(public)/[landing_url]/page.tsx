import { fetchCourseForLanding } from '@services/course-service';
import { TIMEZONE, USER_ROLE } from '@utils/constants';
import { cookies } from 'next/headers';
import MainLanding from './MainLanding';
import { api } from '@/api';
import momentTimezone from 'moment-timezone';
import moment from 'moment';
import { decodeToken, isEmptyObject, isTokenActive } from '@/utils/helper';
import { getDomain } from '@/utils/domain';

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

  const countryResponse = await api.home.countryCode({});
  const { country_code } = await countryResponse.data;

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

  const { data, defaultCoursePrice }: any = courseResponse;

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
    data: data?.landing_page_translations?.[0] || {},
    loading: false,
    course: data?.course || {},
    domainDetails: response.data?.data || {},
    user,
    country: {
      country_code: country_value || country_code,
    },
    isLoggedIn,
    isBecomeAMemberWithVerified: isBecomeAMemberWithVerified(),
    isBecomeVerifiedAndSubscribed: isBecomeVerifiedAndSubscribed(),
  };

  if (!data?.id) return <h1>No Data Found</h1>;
  if (!defaultCoursePrice) return <h1>No Price Found</h1>;

  const activeLandingPage = data?.landing_name;

  return <MainLanding {...{ landingData, activeLandingPage }} />;
};

export default Landing;
