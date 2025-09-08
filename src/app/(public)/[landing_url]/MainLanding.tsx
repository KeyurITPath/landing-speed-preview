'use client';
import React from 'react';
import Landing3 from '@/components/landing-pages/landing-3';
import Landing1 from '@/components/landing-pages/landing-1';
import Landing2 from '@/components/landing-pages/landing-2';
import useLanding from '@/components/landing-pages/useLanding';
import { TIMEZONE, USER_ROLE } from '@/utils/constants';
import { decodeToken, isEmptyObject, isTokenActive } from '@/utils/helper';
import momentTimezone from 'moment-timezone';
import moment from 'moment';
import { useCookieSync } from '@/hooks/use-cookie-sync';

const MainLanding = ({
  courseResponse,
  domainResponse,
  country_code,
  token,
  language_id,
  languages,
}: any) => {
  let user = {};
  let isLoggedIn;

  // Sync cookies with server-side values
  useCookieSync(language_id, country_code, languages);

  if (token) {
    user = decodeToken(token);
    isLoggedIn = isTokenActive(token) && user?.is_verified;
  }

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
    country: { country_code },
    isLoggedIn,
    isBecomeAMemberWithVerified: isBecomeAMemberWithVerified(),
    isBecomeVerifiedAndSubscribed: isBecomeVerifiedAndSubscribed(),
  };

  const activeLandingPage = courseResponse?.data?.landing_name;

  const anotherLandingData = useLanding({ ...landingData, activeLandingPage });

  switch (activeLandingPage.name) {
    case 'landing1':
      return (
        <Landing1 landingData={{ ...landingData, ...anotherLandingData }} />
      );
    case 'landing2':
      return (
        <Landing2 landingData={{ ...landingData, ...anotherLandingData }} />
      );
    case 'landing3':
      return (
        <Landing3 landingData={{ ...landingData, ...anotherLandingData }} />
      );
    default:
      return null;
  }
};

export default MainLanding;
