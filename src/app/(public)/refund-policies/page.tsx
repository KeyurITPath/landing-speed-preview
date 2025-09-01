import { api } from '@/api';
import { DOMAIN } from '@/utils/constants';
import RefundPoliciesContainer from './RefundPoliciesContainer';

const RefundPolicy = async () => {
  const response = await api.home.fetchDomainDetails({
    params: { name: DOMAIN },
  });

  return <RefundPoliciesContainer {...{
    domainDetails: response.data?.data || {},
  }} />;
};

export default RefundPolicy;
