import React from 'react';
import ClientSection from './ClientSection';
import {
  fetchAllCourseCategories,
  fetchCountryCodeHandler,
  fetchHomeCoursesData,
  fetchPopularCourses,
} from '@services/course-service';
import { DOMAIN } from '@utils/constants';
import { cookies } from "next/headers";
import { decodeToken } from '../../utils/helper';

const Home = async () => {

  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value; // read cookie "token"

  const user = decodeToken(token);

  const country_code = await fetchCountryCodeHandler();

  const popularCourses = await fetchPopularCourses({
    params: {
      language_id: 1,
      domain: DOMAIN,
      ...(user?.id && { user_id: user?.id })
    },
    headers: {
      'req-from': country_code,
    },
  });

  const homeCourses = await fetchHomeCoursesData({
    params: {
      language_id: 1,
      domain: DOMAIN,
      ...(user?.id && { user_id: user?.id })
    },
    headers: {
      'req-from': country_code,
    },
  });

  const courseCategories = await fetchAllCourseCategories(
    {
      params: {
        language_id: 1,
      },
      headers: {
        'req-from': country_code,
      },
    },
    1
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
      <ClientSection homeData={{ ...homeData }} />
    </React.Fragment>
  );
};

export default Home;
