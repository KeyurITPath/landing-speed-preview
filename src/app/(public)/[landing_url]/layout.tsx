import {
  fetchCountryCodeHandler,
  fetchCourseForLanding,
} from '@/services/course-service';
import { fetchIP, getDomain } from '@/utils/domain';

export async function generateMetadata({ params }: any) {
  const slug = await params;
  const domain_value = await getDomain();
  const IP = await fetchIP();
  // IP address with country code
  const country_code = await fetchCountryCodeHandler(IP);

  const response = await fetchCourseForLanding({
    params: {
      final_url: slug.landing_url,
      domain: domain_value,
    },
    headers: {
      'req-from': country_code,
    },
  });

  const course = response?.data?.landing_page_translations?.[0];

  return {
    title: course?.header || 'Eduelle',
    openGraph: {
      title:course?.header,
      type: 'website',
    },
  }
}

const CourseLandingLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default CourseLandingLayout;
