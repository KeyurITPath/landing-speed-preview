import { api } from '@/api';
import Header from '@/components/header';
import { Box } from '@mui/material';
import Footer from '@/components/footer';
import {
  fetchAllCountries,
  fetchCountryCodeHandler,
} from '@/services/course-service';
import { LanguageService } from '@/services/language-service';
import { cookies } from 'next/headers';
import { decodeToken, isTokenActive } from '@/utils/helper';
import { fetchIP, getDomain } from '@/utils/domain';

export async function generateMetadata() {
  const domain_value = await getDomain();
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

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const domain_value = await getDomain();
  const token = cookieStore.get('token')?.value; // read cookie "token"

  const domainPromise = api.home.fetchDomainDetails({
    params: { name: domain_value },
  });
  const ipPromise = fetchIP();
  const countryPromise = fetchAllCountries();
  const languagesPromise = LanguageService.getLanguages();
  const languageIdPromise = LanguageService.getEffectiveLanguageId();

  const [domainResponse, IP, countriesResponse, languages, language_id] =
    await Promise.all([
      domainPromise,
      ipPromise,
      countryPromise,
      languagesPromise,
      languageIdPromise,
    ]);

  // IP address with country code
  const country_code = await fetchCountryCodeHandler(IP);

  let user = {};
  let isLoggedIn;
  if (token) {
    user = decodeToken(token);
    isLoggedIn = isTokenActive(token) && user?.is_verified;
  }

  // countries
  const countries = countriesResponse?.data?.result || [];

  return (
    <Box sx={{ width: '100%' }}>
      <Header
        domainDetails={domainResponse?.data}
        user={user}
        isLoggedIn={isLoggedIn}
      />
      {children}
      <Footer
        domainDetails={domainResponse?.data}
        {...{ country_code, languages, countries, language_id, isLoggedIn }}
      />
    </Box>
  );
};
export default PublicLayout;
