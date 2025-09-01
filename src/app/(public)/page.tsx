import React from 'react';
import ClientSection from './ClientSection';
import {
  fetchAllCourseCategories,
  fetchCountryCodeHandler,
  fetchDomainDetails,
  fetchHomeCoursesData,
  fetchPopularCourses,
  fetchUser,
} from '@services/course-service';
import { LanguageService } from '@/services/language-service';
import { DOMAIN, TIMEZONE, USER_ROLE } from '@utils/constants';
import { cookies, headers } from 'next/headers';
import { decodeToken, isEmptyObject, isTokenActive } from '@/utils/helper';
import momentTimezone from 'moment-timezone';
import moment from 'moment';


const Home = async () => {

  const headersList = headers();
  const forwardedFor = (await headersList).get("x-forwarded-for");
  const ip = forwardedFor?.split(',')[0] || (await headersList).get("x-real-ip");

  console.log('Client IP:', ip);
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value; // read cookie "token"

  let user = {};
  let isLoggedIn;
  if (token) {
    user = decodeToken(token);
    isLoggedIn = isTokenActive(token);
  }

  const language_id = await LanguageService.getEffectiveLanguageId();

  const country_code = await fetchCountryCodeHandler();

  const domainDetails = await fetchDomainDetails();

  const userResponse = await fetchUser({
    params: {
      user_id: user?.id,
      language: language_id,
      domain: DOMAIN,
    },
    headers: {
      'req-from': country_code,
    },
  });

  const popularCourses = await fetchPopularCourses({
    params: {
      language_id,
      domain: DOMAIN,
      ...(user && { user_id: user?.id }),
    },
    headers: {
      'req-from': country_code,
    },
  });

  const homeCourses = await fetchHomeCoursesData({
    params: {
      language_id,
      domain: DOMAIN,
      ...(user && { user_id: user?.id }),
    },
    headers: {
      'req-from': country_code,
    },
  });

  const courseCategories = await fetchAllCourseCategories(
    {
      params: {
        language_id,
      },
      headers: {
        'req-from': country_code,
      },
    },
    language_id
  );

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
    (subscriptionEndDate && moment?.isMoment(subscriptionEndDate) && !subscriptionEndDate?.isAfter(currentTime))
  );
};

  const homeData = {
    isPopularBrandCoursesDataLoading: false,
    isBecomeAMemberWithVerified: isBecomeAMemberWithVerified(),
    POPULAR_BRAND_COURSES_DATA: popularCourses,
    COURSES_DATA: homeCourses,
    CATEGORIES_BADGE: courseCategories,
    isLoggedIn,
    user,
    userResponse,
  };

  return (
    <React.Fragment>
      <ClientSection
        domainDetails={domainDetails}
        homeData={homeData}
        serverLanguageId={language_id}
        serverCountryCode={country_code}
      />
    </React.Fragment>
  );
};

export default Home;

