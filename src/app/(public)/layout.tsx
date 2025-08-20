import { api } from '@/api';
import { DOMAIN } from '@/utils/constants';

export async function generateMetadata() {
  const response = await api.home.fetchDomainDetails({
    params: { name: DOMAIN },
  });

  const domain = (await response?.data?.data) || {};

  return {
    title: domain?.domain_detail?.brand_name || 'Next.js',
    authors: [{ name: domain?.domain_detail?.legal_name, url: domain?.name }],
    keywords: [
      'Next.js',
      'Project Architecture',
      'Template',
      'TypeScript',
      'React',
    ],
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

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {

  return <div>{children}</div>;
};
export default PublicLayout;
