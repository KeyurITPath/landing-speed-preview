import { api } from '@/api';
import { DOMAIN } from '@/utils/constants';
import Header from '@/components/header';
import { Box } from '@mui/material';
import Footer from '@/components/footer';
import { fetchAllCountries, fetchAllLanguages, fetchCountryCodeHandler } from '@/services/course-service';

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

  // domain details
  const response = await api.home.fetchDomainDetails({
    params: { name: DOMAIN },
  });
  const domain = (await response?.data) || {};

  // IP address with country code
  const country_code = await fetchCountryCodeHandler();

  // languages
  const langResponse = await fetchAllLanguages();
  const languages = langResponse?.data?.result || [];

  // countries
  const countriesResponse = await fetchAllCountries();
  const countries = countriesResponse?.data?.result || [];

  return <Box sx={{ width: '100%' }}>
    <Header domainDetails={domain} />
    {children}
    <Footer domainDetails={domain} {...{ country_code, languages, countries }} />
  </Box>;
};
export default PublicLayout;
