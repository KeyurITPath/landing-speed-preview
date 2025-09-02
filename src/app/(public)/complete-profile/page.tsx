import { api } from '@/api';
import CompleteProfileComponent from './CompleteProfile';
import { cookies } from 'next/headers';
import { fetchUser } from '@/services/course-service';
import { decodeToken } from '@/utils/helper';
import { getDomain } from '@/utils/domain';


const CompleteProfile = async () => {
  const domain_value = await getDomain()
  const cookieStore = await cookies()

  const token = cookieStore.get('token')?.value
  let userData
  if(token){
    const decodeUser = decodeToken(token)
    userData = await fetchUser({
      params: {
        user_id: decodeUser?.id
      },
      cookieToken: token || ''
    })
  }

  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });

  return <CompleteProfileComponent userData={userData} domainDetails={response.data} />;
};

export default CompleteProfile;
