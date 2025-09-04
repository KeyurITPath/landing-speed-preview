import React from 'react';
import { cookies } from 'next/headers';
import { decodeToken, isEmptyObject, isTokenActive } from '@/utils/helper';
import { LanguageService } from '@/services/language-service';
import {
  fetchCountryCodeHandler,
  fetchHomeCoursesData,
  fetchUser,
} from '@/services/course-service';
import { TIMEZONE, USER_ROLE } from '@/utils/constants';
import momentTimezone from 'moment-timezone';
import SearchContainer from './SearchContainer';
import moment from 'moment';
import { fetchIP, getDomain } from '@/utils/domain';

const Search = async ({ searchParams }: any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value; // read cookie "token"
  const domain_value = await getDomain();
  const IP = await fetchIP();
  let user = {};
  let isLoggedIn;
  if (token) {
    user = decodeToken(token);
    isLoggedIn = isTokenActive(token) && user?.is_verified;
  }

  const language_id = await LanguageService.getEffectiveLanguageId();

  const country_code = await fetchCountryCodeHandler(IP);

  const search_params = await searchParams;

  const courseResponse = await fetchHomeCoursesData({
    params: {
      language_id,
      domain: domain_value,
      search: search_params?.query || '  ',
      page: 1,
      limit: 8
    },
    headers: {
      'req-from': country_code,
    },
  });

  const userResponse = await fetchUser({
    params: {
      user_id: user?.id,
      language: language_id,
      domain: domain_value,
    },
    headers: {
      'req-from': country_code,
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
      subscriptionEndDate = momentTimezone(user.subscription_end_date).tz(
        TIMEZONE
      );
    }

    return (
      !user.is_subscribed ||
      (subscriptionEndDate &&
        moment?.isMoment(subscriptionEndDate) &&
        !subscriptionEndDate?.isAfter(currentTime))
    );
  };

  return (
    <SearchContainer
      {...{
        isBecomeAMemberWithVerified: isBecomeAMemberWithVerified(),
        isLoggedIn,
        user,
        userResponse,
        language_id,
        country_code,
        courseResponse
      }}
    />
  );
};

export default Search;
