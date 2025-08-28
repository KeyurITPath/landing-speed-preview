import { fetchCourseForLanding } from '@services/course-service';
import { DOMAIN, TIMEZONE, USER_ROLE } from '@utils/constants';
import { cookies } from 'next/headers';
import MainLanding from './MainLanding';
import { api } from '@/api';
import momentTimezone from 'moment-timezone';
import { decodeToken, isEmptyObject, isTokenActive } from '@/utils/helper';

const Landing = async ({ params, searchParams }: any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || null;

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
    params: { name: DOMAIN },
  });

  const courseResponse = await fetchCourseForLanding({
    params: {
      final_url: slug.landing_url,
      ...(discountCode?.discount_code
        ? { discount_code: discountCode?.discount_code }
        : {}),
      domain: DOMAIN,
    },
    headers: {
      'req-from': country_code,
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

    const subscriptionEndDate = user?.subscription_end_date
      ? momentTimezone(user.subscription_end_date).tz(TIMEZONE)
      : null;

    return (
      !user.is_subscribed ||
      (subscriptionEndDate && !subscriptionEndDate.isAfter(currentTime))
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
    let isSubscriptionActive;
    const subscriptionEndDate = user?.subscription_end_date;
    const isSubscribed = !!user?.is_subscribed;
    if (subscriptionEndDate) {
      isSubscriptionActive = subscriptionEndDate?.isAfter(currentTime);
    }
    return (isSubscribed && isSubscriptionActive) || user.is_lifetime === true;
  };

  const landingData = {
    data: data?.landing_page_translations?.[0] || {},
    loading: false,
    course: data?.course || {},
    domainDetails: response.data?.data || {},
    user,
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
