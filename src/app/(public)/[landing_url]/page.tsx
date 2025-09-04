import {
  fetchCountryCodeHandler,
  fetchCourseForLanding,
} from '@services/course-service';
import { TIMEZONE, USER_ROLE } from '@utils/constants';
import { cookies } from 'next/headers';
import MainLanding from './MainLanding';
import { api } from '@/api';
import momentTimezone from 'moment-timezone';
import moment from 'moment';
import { decodeToken, isEmptyObject, isTokenActive } from '@/utils/helper';
import { fetchIP, getDomain } from '@/utils/domain';
import NoData from '../redirecting-page/NoData';

interface User {
  id?: string;
  role?: any;
  is_verified?: boolean;
  is_subscribed?: boolean;
  subscription_end_date?: string;
  is_lifetime?: boolean;
}

const Landing = async ({ params, searchParams }: any) => {
  const cookieStore = await cookies();
  const domain_value = await getDomain();
  const token = cookieStore.get('token')?.value || null;
  const country_value = cookieStore.get('country_code')?.value || '';

  let user: User = {};
  let isLoggedIn;

  if (token) {
    user = decodeToken(token) as User;
    isLoggedIn = isTokenActive(token) && user?.is_verified;
  }

  const slug = params;
  const discountCode = searchParams;

  // Run API calls in parallel for better performance
  const [domainResponse, courseResponse] = await Promise.all([
    api.home.fetchDomainDetails({
      params: { name: domain_value },
    }),
    fetchCourseForLanding({
      params: {
        final_url: slug.landing_url,
        ...(discountCode?.discount_code
          ? { discount_code: discountCode?.discount_code }
          : {}),
        domain: domain_value,
      },
      headers: {
        'req-from': country_value,
      },
    }),
  ]);

  const currentTime = momentTimezone().tz(TIMEZONE);

  const isBecomeAMemberWithVerified = () => {
    if (!user || isEmptyObject(user)) return false;

    if (
      ![USER_ROLE.CUSTOMER, USER_ROLE.AUTHOR].includes(user?.role) ||
      !user?.is_verified
    ) {
      return false;
    }

    let subscriptionEndDate: moment.Moment | null = null;

    if (user?.subscription_end_date) {
      subscriptionEndDate = momentTimezone(user.subscription_end_date).tz(
        TIMEZONE
      );
    }

    return (
      !user.is_subscribed ||
      (subscriptionEndDate &&
        moment.isMoment(subscriptionEndDate) &&
        !subscriptionEndDate?.isAfter(currentTime))
    );
  };

  const isBecomeVerifiedAndSubscribed = () => {
    if (!user) return false;

    if (
      ![USER_ROLE.CUSTOMER, USER_ROLE.AUTHOR].includes(user?.role) ||
      !user?.is_verified
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
    domainDetails: domainResponse.data?.data || {},
    user,
    country: {
      country_code: country_value || '',
    },
    isLoggedIn,
    isBecomeAMemberWithVerified: isBecomeAMemberWithVerified(),
    isBecomeVerifiedAndSubscribed: isBecomeVerifiedAndSubscribed(),
  };

  if (!courseResponse?.defaultCoursePrice || !courseResponse?.data?.id) {
    return <NoData />;
  }

  const activeLandingPage = courseResponse?.data?.landing_name;

  return <MainLanding {...{ landingData, activeLandingPage }} />;
};

export default Landing;
