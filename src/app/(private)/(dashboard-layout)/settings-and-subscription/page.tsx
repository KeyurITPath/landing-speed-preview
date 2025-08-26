import { cookies } from 'next/headers';
import SettingAndSubscriptionContainer from './SettingAndSubscription';
import { decodeToken } from '@/utils/helper';
import { LanguageService } from '@/services/language-service';
import { api } from '@/api';
import { DOMAIN } from '@/utils/constants';
import { fetchCountryCodeHandler } from '@/services/course-service';

const SettingsAndSubscription = async () => {
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
