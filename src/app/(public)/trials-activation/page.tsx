import { api } from '@/api';
import TrialsActivationComponent from './TrialsActivationComponent';
import { fetchIP, getDomain } from '@/utils/domain';
import { fetchCountryCodeHandler } from '@/services/course-service';

const TrialsActivation = async () => {
  const domain_value = await getDomain();
  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });

  const IP = await fetchIP();
  // IP address with country code
  const country_code = await fetchCountryCodeHandler(IP);

  return (
    <TrialsActivationComponent
      domainDetails={response.data}
      country_code={country_code}
    />
  );
};

export default TrialsActivation;
