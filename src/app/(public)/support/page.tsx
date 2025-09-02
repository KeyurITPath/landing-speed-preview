import { api } from '@/api';
import SupportContainer from './SupportContainer';
import { getDomain } from '../../../utils/domain';

const Support = async () => {
  const domain_value = await getDomain();
  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });

  return (
    <SupportContainer
      {...{
        domainDetails: response.data?.data || {},
      }}
    />
  );
};

export default Support;
