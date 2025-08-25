import { fetchCourseForLanding } from '@services/course-service';
import { DOMAIN } from '@utils/constants';
import { cookies } from 'next/headers';
import MainLanding from './MainLanding';
import { api } from '@/api';
import { COUNTRY_COOKIE } from '@/utils/cookies';

const Landing = async ({ params, searchParams }: any) => {

  const countryResponse = await api.home.countryCode({});
  const { country_code } = await countryResponse.data;

  const slug = await params;
  const discountCode = await searchParams;

  const response = await api.home.fetchDomainDetails({
    params: { name: DOMAIN },
  });

  const courseResponse = await fetchCourseForLanding({
    params: {
      final_url: slug.landing_url,
      ...(discountCode?.discount_code ? { discount_code: discountCode?.discount_code } : {}),
      domain: DOMAIN,
    },
    headers: {
      'req-from': country_code,
    },
  });

  const { data, defaultCoursePrice }: any = courseResponse;

  const landingData = {
    data: data?.landing_page_translations?.[0] || {},
    loading: false,
    course: data?.course || {},
    domainDetails: response.data?.data || {}
  };

  if (!data?.id) return <h1>No Data Found</h1>;
  if (!defaultCoursePrice) return <h1>No Price Found</h1>;

  const activeLandingPage = data?.landing_name;

  return <MainLanding {...{ landingData, activeLandingPage }} />;
};

export default Landing;
