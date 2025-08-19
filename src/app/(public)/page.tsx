import React, { lazy } from 'react';
import ClientSection from './ClientSection';
import {
  fetchAllCourseCategories,
  fetchHomeCoursesData,
  fetchPopularCourses,
} from '@services/course-service';
import { DOMAIN } from '@utils/constants';

const Home = async () => {
  const popularCourses = await fetchPopularCourses({
    params: {
      language_id: 1,
      domain: DOMAIN,
    },
    headers: {
      'req-from': 'in',
    },
  });

  const homeCourses = await fetchHomeCoursesData({
    params: {
      language_id: 1,
      domain: DOMAIN,
    },
    headers: {
      'req-from': 'in',
    },
  });

  const courseCategories = await fetchAllCourseCategories(
    {
      params: { language_id: 1 },
      headers: {
        'req-from': 'in',
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
