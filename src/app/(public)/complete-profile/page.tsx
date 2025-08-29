import { api } from '@/api';
import { DOMAIN } from '@/utils/constants';
import CompleteProfileComponent from './CompleteProfile';
import { cookies } from 'next/headers';
import { fetchUser } from '../../../services/course-service';
import { decodeToken } from '../../../utils/helper';


const CompleteProfile = async () => {

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
    params: { name: DOMAIN },
  });

  return <CompleteProfileComponent userData={userData} domainDetails={response.data} />;
};

export default CompleteProfile;
