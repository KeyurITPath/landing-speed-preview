import { cookies } from 'next/headers';
import { decodeToken } from '@/utils/helper';
import {
  fetchCountryCodeHandler,
  fetchAllCountries
} from '@/services/course-service';
import { LanguageService } from '@/services/language-service';
import { api } from '@/api';
import { DOMAIN } from '@/utils/constants';
import CourseDetailContainer from './CourseDetailContainer';
import Header from '@/components/header';
import Footer from '../../../../components/footer';

const CourseDetails = async ({ params }: any) => {
  const cookieStore = await cookies();
  const userData = decodeToken(cookieStore.get('token')?.value);

  const slug = await params;

  // IP address with country code
  const country_code = await fetchCountryCodeHandler();

  // Get language_id and languages using the simple service
  const language_id = await LanguageService.getEffectiveLanguageId();
  const languages = await LanguageService.getLanguages();

  // domain details
  const response = await api.home.fetchDomainDetails({
    params: { name: DOMAIN },
  });
  const domain = (await response?.data) || {};

    // countries
    const countriesResponse = await fetchAllCountries();
    const countries = countriesResponse?.data?.result || [];

  return (
    <>
      <Header domainDetails={domain} />
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
      {...{ country_code, languages, countries, language_id }} />
    </>
  );
};

export default CourseDetails;
