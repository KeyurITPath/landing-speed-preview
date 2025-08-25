import { api } from '@/api';
import { DOMAIN } from '@/utils/constants';
import TrialsActivationComponent from './TrialsActivationComponent';

const TrialsActivation = async () => {
  const response = await api.home.fetchDomainDetails({
    params: { name: DOMAIN },
  });

    // IP address with country code
  const countryResponse = await api.home.countryCode({});
  const { country_code } = await countryResponse.data;

  return <TrialsActivationComponent domainDetails={response.data} country_code={country_code} />;
};

export default TrialsActivation;
