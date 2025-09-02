import { api } from '@/api';
import TrialsActivationComponent from './TrialsActivationComponent';
import { getDomain } from '../../../utils/domain';

const TrialsActivation = async () => {
  const domain_value = await getDomain()
  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });

    // IP address with country code
  const countryResponse = await api.home.countryCode({});
  const { country_code } = await countryResponse.data;

  return <TrialsActivationComponent domainDetails={response.data} country_code={country_code} />;
};

export default TrialsActivation;
