import { cookies } from 'next/headers';
import DashboardContainer from './DashboardContainer';
import { decodeToken } from '@/utils/helper';
import { LanguageService } from '@/services/language-service';
import { fetchCountryCodeHandler } from '@/services/course-service';
import { api } from '@/api';
import momentTimezone from 'moment-timezone';
import { DOMAIN, TIMEZONE, USER_ROLE } from '@/utils/constants';

const Dashboard = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value; // read cookie "token"
  const user = decodeToken(token);

  const language_id = await LanguageService.getEffectiveLanguageId();

  // IP address with country code
  const country_code = await fetchCountryCodeHandler();

  // domain details
  const response = await api.home.fetchDomainDetails({
    params: { name: DOMAIN },
  });
  const domain = (await response?.data) || {};

  const isBecomeAMemberWithVerified = () => {
    if (!user) return false;

    if (
      ![USER_ROLE.CUSTOMER, USER_ROLE.AUTHOR].includes(user.role) ||
      !user.is_verified
    ) {
      return false;
    }

    const currentTime = momentTimezone().tz(TIMEZONE);
    const subscriptionEndDate = user?.subscription_end_date
      ? momentTimezone(user.subscription_end_date).tz(TIMEZONE)
      : null;

    return (
      !user.is_subscribed ||
      (subscriptionEndDate && !subscriptionEndDate.isAfter(currentTime))
    );
  };

  return (
    <DashboardContainer
      {...{
        language_id,
        user,
        domainDetails: domain,
        country_code,
        isBecomeAMemberWithVerified: isBecomeAMemberWithVerified(),
      }}
    />
  );
};

export default Dashboard;
