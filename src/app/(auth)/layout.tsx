import { api } from '@/api';
import DomainProvider from '../../context/domain-provider';
import { DOMAIN } from '../../utils/constants';

export const metadata = {
  title: 'Authentication',
  description:
    'Authentication layout for the Project Architecture Next.js Template',
};

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const domainDetails = await api.home.fetchDomainDetails({
    params: { name: DOMAIN },
  });
  return <DomainProvider value={domainDetails}>{children}</DomainProvider>;
};
export default AuthLayout;
