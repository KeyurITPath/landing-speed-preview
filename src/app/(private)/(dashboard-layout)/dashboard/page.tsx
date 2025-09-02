import { cookies } from 'next/headers';
import DashboardContainer from './DashboardContainer';
import { decodeToken, isEmptyObject } from '@/utils/helper';
import { LanguageService } from '@/services/language-service';
import {
  fetchAllCourseCategories,
  fetchAllCourseOfTheWeek,
  fetchAllPopularCoursesOnBrand,
  fetchCountryCodeHandler,
} from '@/services/course-service';
import { api } from '@/api';
import momentTimezone from 'moment-timezone';
import { TIMEZONE, USER_ROLE } from '@/utils/constants';
import moment from 'moment';
import { fetchIP, getDomain } from '@/utils/domain';

const Dashboard = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value; // read cookie "token"
  const user = decodeToken(token);
  const domain_value = await getDomain()
  const IP = await fetchIP()

  const language_id = await LanguageService.getEffectiveLanguageId();

  // IP address with country code
  const country_code = await fetchCountryCodeHandler(IP);

  // domain details
  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });
  const domain = (await response?.data) || {};

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
        moment.isMoment(subscriptionEndDate) &&
        !subscriptionEndDate?.isAfter(currentTime))
    );
  };

  const courseOfTheWeek = await fetchAllCourseOfTheWeek({
    params: { language_id, domain: domain_value },
    headers: {
      'req-from': country_code,
    },
  });

  const popularCoursesOnBrand = await fetchAllPopularCoursesOnBrand({
    params: {
      page: 1,
      limit: 8,
      language_id,
      domain: domain_value,
      user_id: user?.id,
    },
    headers: {
      'req-from': country_code,
    },
  });

  const courseCategoriesData = await fetchAllCourseCategories({
      params: { language_id }
  }, language_id)

  return (
    <DashboardContainer
      {...{
        language_id,
        user,
        domainDetails: domain,
        country_code,
        courseOfTheWeek,
        popularCoursesOnBrand,
        isBecomeAMemberWithVerified: isBecomeAMemberWithVerified(),
        courseCategoriesData
      }}
    />
  );
};

export default Dashboard;
