import { api } from '@/api';
import TermsOfServiceContainer from './TermsOfServiceContainer';
import { getDomain } from '@/utils/domain';

const TermsOfService = async () => {
  const domain_value = await getDomain()
  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });

  return (
    <TermsOfServiceContainer
      {...{
        domainDetails: response.data?.data || {},
      }}
    />
  );
};

export default TermsOfService;
