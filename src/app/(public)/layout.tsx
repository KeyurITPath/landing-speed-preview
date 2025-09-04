import { api } from '@/api';
import Header from '@/components/header';
import { Box } from '@mui/material';
import Footer from '@/components/footer';
import { fetchAllCountries, fetchCountryCodeHandler } from '@/services/course-service';
import { LanguageService } from '@/services/language-service';
import { cookies } from 'next/headers';
import { decodeToken, isTokenActive } from '@/utils/helper';
import { fetchIP, getDomain } from '@/utils/domain';

export async function generateMetadata() {
  const domain_value = await getDomain()
  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
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
  const cookieStore = await cookies();
  const domain_value = await getDomain()
  const IP = await fetchIP()
  const token = cookieStore.get('token')?.value; // read cookie "token"
  // domain details
  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });
  const domain = (await response?.data) || {};

  // IP address with country code
  const country_code = await fetchCountryCodeHandler(IP);

  let user = {}
  let isLoggedIn;
  if (token) {
    user = decodeToken(token);
    isLoggedIn = isTokenActive(token) && user?.is_verified;
  }

  // Get language_id and languages using the simple service
  const language_id = await LanguageService.getEffectiveLanguageId();
  const languages = await LanguageService.getLanguages();

  // countries
  const countriesResponse = await fetchAllCountries();
  const countries = countriesResponse?.data?.result || [];

  return <Box sx={{ width: '100%' }}>
    <Header domainDetails={domain} user={user} isLoggedIn={isLoggedIn} />
    {children}
    <Footer
      domainDetails={domain}
      {...{ country_code, languages, countries, language_id, isLoggedIn }}
    />
  </Box>;
};
export default PublicLayout;
