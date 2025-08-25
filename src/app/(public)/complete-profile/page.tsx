import { api } from '@/api';
import { DOMAIN } from '@/utils/constants';
import CompleteProfileComponent from './CompleteProfile';

const CompleteProfile = async () => {
  const response = await api.home.fetchDomainDetails({
    params: { name: DOMAIN },
  });

  return <CompleteProfileComponent domainDetails={response.data} />;
};

export default CompleteProfile;
