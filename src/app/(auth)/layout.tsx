import { api } from '@/api';
import DomainProvider from '@/context/domain-provider';
import { getDomain } from '@/utils/domain';

export async function generateMetadata() {
  const domain_value = await getDomain()
  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });

  const domain = (await response?.data?.data) || {};

  return {
    title: domain?.domain_detail?.brand_name || 'Next.js',
    authors: [{ name: domain?.domain_detail?.legal_name, url: domain?.name }],
    openGraph: {
      title: domain?.domain_detail?.brand_name,
      description: 'A custom Next.js project architecture template.',
      url: domain?.name,
      siteName: domain?.domain_detail?.brand_name,
      locale: 'en_US',
      type: 'website',
    },
  };
}

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const domain_value = await getDomain()
  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });

  return <DomainProvider value={response?.data}>{children}</DomainProvider>;
};
export default AuthLayout;
