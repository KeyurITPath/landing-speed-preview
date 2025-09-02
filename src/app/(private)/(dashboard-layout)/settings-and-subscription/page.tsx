import { cookies } from 'next/headers';
import SettingAndSubscriptionContainer from './SettingAndSubscription';
import { decodeToken } from '@/utils/helper';
import { LanguageService } from '@/services/language-service';
import { api } from '@/api';
import { fetchCountryCodeHandler } from '@/services/course-service';
import { fetchIP, getDomain } from '@/utils/domain';

const SettingsAndSubscription = async () => {
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

  return (
    <SettingAndSubscriptionContainer
      {...{
        language_id,
        user,
        domainDetails: domain,
        country_code
      }}
    />
  );
};

export default SettingsAndSubscription;
