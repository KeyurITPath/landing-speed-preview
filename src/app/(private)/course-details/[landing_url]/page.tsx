import { cookies } from 'next/headers';
import { decodeToken, isTokenActive } from '@/utils/helper';
import {
  fetchCountryCodeHandler,
  fetchAllCountries
} from '@/services/course-service';
import { LanguageService } from '@/services/language-service';
import { api } from '@/api';
import CourseDetailContainer from './CourseDetailContainer';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { fetchIP, getDomain } from '@/utils/domain';

const CourseDetails = async ({ params }: any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const domain_value = await getDomain()
  const IP = await fetchIP()
  const slug = await params;

  let userData = {};
  let isLoggedIn;
  if (token) {
    userData = decodeToken(token);
    isLoggedIn = isTokenActive(token) && userData?.is_verified;
  }

  // IP address with country code
  const country_code = await fetchCountryCodeHandler(IP);

  // Get language_id and languages using the simple service
  const language_id = await LanguageService.getEffectiveLanguageId();
  const languages = await LanguageService.getLanguages();

  // domain details
  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });
  const domain = (await response?.data) || {};

    // countries
    const countriesResponse = await fetchAllCountries();
    const countries = countriesResponse?.data?.result || [];

  return (
    <>
      <Header domainDetails={domain} user={userData} isLoggedIn={isLoggedIn} />
      <CourseDetailContainer
        {...{
          domainDetails: domain,
          language_id,
          user: userData,
          country_code,
          slug: slug.landing_url,
          languages,
        }}
      />
      <Footer domainDetails={domain}
      {...{ country_code, languages, countries, language_id, isLoggedIn }} />
    </>
  );
};

export default CourseDetails;
