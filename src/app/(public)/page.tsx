import React from 'react';
import ClientSection from './ClientSection';
import {
  fetchAllCourseCategories,
  fetchCountryCodeHandler,
  fetchDomainDetails,
  fetchHomeCoursesData,
  fetchPopularCourses,
} from '@services/course-service';
import { LanguageService } from '@/services/language-service';
import { DOMAIN } from '@utils/constants';
import { cookies } from "next/headers";
import { decodeToken } from '@/utils/helper';

const Home = async () => {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value; // read cookie "token"

  const user = decodeToken(token);

  const language_id = await LanguageService.getEffectiveLanguageId();

  const country_code = await fetchCountryCodeHandler();

  const domainDetails = await fetchDomainDetails();
  console.log('country_code3', country_code)

  const popularCourses = await fetchPopularCourses({
    params: {
      language_id,
      domain: DOMAIN,
      ...(user && { user_id: user?.id })
    },
    headers: {
      'req-from': country_code,
    },
  });

  const homeCourses = await fetchHomeCoursesData({
    params: {
      language_id,
      domain: DOMAIN,
      ...(user && { user_id: user?.id })
    },
    headers: {
      'req-from': country_code,
    },
  });

  const courseCategories = await fetchAllCourseCategories(
    {
      params: {
        language_id,
      },
      headers: {
        'req-from': country_code,
      },
    },
    language_id
  );

  const homeData = {
    isPopularBrandCoursesDataLoading: false,
    isBecomeAMemberWithVerified: false,
    POPULAR_BRAND_COURSES_DATA: popularCourses,
    COURSES_DATA: homeCourses,
    CATEGORIES_BADGE: courseCategories,
  };

  return (
    <React.Fragment>
      <ClientSection
        domainDetails={domainDetails}
        homeData={{ ...homeData }}
        serverLanguageId={language_id}
        serverCountryCode={country_code}
      />
    </React.Fragment>
  );
};

export default Home;
