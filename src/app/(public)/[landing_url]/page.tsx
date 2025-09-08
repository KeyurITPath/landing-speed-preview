import {
  fetchCountryCodeHandler,
  fetchCourseForLanding,
} from '@services/course-service';
import { cookies } from 'next/headers';
import MainLanding from './MainLanding';
import { api } from '@/api';
import { fetchIP, getDomain } from '@/utils/domain';
import NoData from '../redirecting-page/NoData';
import { LanguageService } from '../../../services/language-service';

const Landing = async ({ params, searchParams }: any) => {
  const cookieStore = await cookies();
  const domain_value = await getDomain();
  const token = cookieStore.get('token')?.value || null;

  const slug = await params;
  const discountCode = await searchParams;

  const IP = await fetchIP();

  // IP address with country code
  const country_code = await fetchCountryCodeHandler(IP);
  console.log('Client IP:', IP);
  console.log('country_code for course landing :>> ', country_code);

  // Run API calls in parallel for better performance
  const [domainResponse, courseResponse, language_id, languages] = await Promise.all([
    api.home.fetchDomainDetails({
      params: { name: domain_value },
    }),
    fetchCourseForLanding({
      params: {
        final_url: slug.landing_url,
        ...(discountCode?.discount_code
          ? { discount_code: discountCode?.discount_code }
          : {}),
        domain: domain_value,
      },
      headers: {
        'req-from': country_code,
      },
    }),
    LanguageService.getEffectiveLanguageId(),
    LanguageService.getLanguages()
  ]);

  if (!courseResponse?.defaultCoursePrice || !courseResponse?.data?.id) {
    return <NoData />;
  }


  return <MainLanding {...{ courseResponse, domainResponse, country_code, token,  language_id, languages }} />;
};

export default Landing;
