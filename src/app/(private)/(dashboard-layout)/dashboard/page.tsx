export const dynamic = 'force-dynamic';

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

interface DashboardUser {
  id: string;
  role: string;
  is_verified: boolean;
  is_subscribed: boolean;
  subscription_end_date?: string;
}

const Dashboard = async () => {
  try {
    // Initialize all required data with proper error handling
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decodedUser = decodeToken(token) as DashboardUser | false;

    if (!decodedUser) {
      throw new Error('Authentication required');
    }

    const user = decodedUser;

    // Ensure we have a language_id before proceeding with other API calls
    const language_id = await LanguageService.getEffectiveLanguageId();
    if (!language_id) {
      throw new Error('Unable to determine language');
    }

    // Get domain and IP in parallel since they don't depend on each other
    const [domain_value, IP] = await Promise.all([getDomain(), fetchIP()]);

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

    const courseCategoriesData = await fetchAllCourseCategories(
      {
        params: { language_id },
      },
      language_id
    );

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
          courseCategoriesData,
        }}
      />
    );
  } catch (error) {
    console.error('Dashboard error:', error);

    // Return a proper error UI instead of throwing during render
    return (
      <div className='dashboard-error-boundary'>
        <h2>Unable to load dashboard</h2>
        <p>Please refresh the page or try again later.</p>
      </div>
    );
  }
};

export default Dashboard;
