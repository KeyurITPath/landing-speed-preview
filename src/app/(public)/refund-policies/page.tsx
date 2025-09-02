import { api } from '@/api';
import RefundPoliciesContainer from './RefundPoliciesContainer';
import { getDomain } from '@/utils/domain';

const RefundPolicy = async () => {
  const domain_value = await getDomain()
  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });

  return <RefundPoliciesContainer {...{
    domainDetails: response.data?.data || {},
  }} />;
};

export default RefundPolicy;
