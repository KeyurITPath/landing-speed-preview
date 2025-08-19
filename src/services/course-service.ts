import { api } from '@/api';
import { formatCurrency, isEmptyArray, videoURL } from '@utils/helper';
import {
  DOMAIN,
  POPUPS_CATEGORIES,
  SERVER_URL,
  TIMEZONE,
  USER_ROLE,
} from '@utils/constants';

export async function fetchPopularCourses(data) {
  try {
    const response = await api.home.getAllPopularCoursesOnBrand(data);
    const popularCoursesOnBrand = response?.data?.data?.result.map(course => {
      // Destructure top-level fields
      const {
        id,
        discount = 0,
        course_translations,
        landing_pages,
        course_prices,
        course_categories,
        user,
      } = course;

      // Extract translation, landing, and price info once
      const courseTranslation = course_translations?.[0] || {};
      const {
        title = '',
        course_image,
        language_id: courseLangId,
      } = courseTranslation;

      const landingPage = landing_pages?.[0] || {};
      const landingTranslation =
        landingPage.landing_page_translations?.[0] || {};
      const { author_image, rating, final_url = '' } = landingTranslation;

      const domainRedirection =
        landingPage?.landing_name?.domain_detail?.domain?.name || '';

      const defaultPrice = course_prices?.[0] || {};
      const price = defaultPrice.price || 0;
      const currency = defaultPrice?.currency?.name || 'USD';

      // Only calculate original price if discount is applied
      const calculatedDiscount = discount ? 100 - discount : 100;
      const originalPriceValue =
        discount > 0 ? (price / calculatedDiscount) * 100 : price;

      // Build category string in a single pass (faster than filter → map → join)
      let categoryNames = '';
      if (course_categories?.length) {
        const catList = [];
        for (let i = 0; i < course_categories.length; i++) {
          const cat = course_categories[i];
          if (cat?.language_id === courseLangId && cat?.category?.name) {
            catList.push(cat.category.name);
          }
        }
        categoryNames = catList.join(' , ');
      }

      return {
        id,
        title,
        category: categoryNames,
        image: videoURL(course_image),
        instructor: {
          name: user?.name || '',
          avatar: author_image ? SERVER_URL + author_image : '',
        },
        rating,
        originalPrice: formatCurrency(originalPriceValue, currency),
        price: formatCurrency(price, currency),
        redirectionUrl: `${domainRedirection}/${final_url}`,
      };
    });
    return popularCoursesOnBrand;
  } catch (error) {
    console.error('Error fetching popular courses:', error);
  }
}

export async function fetchHomeCoursesData(data) {
  try {
    const response = await api.home.fetchHomeCourses(data);
    if (
      response?.data?.data?.result &&
      isEmptyArray(response?.data?.data?.result)
    )
      return [];

    const courseData = response?.data?.data?.result?.map(course => {
      const { id, course_categories, landing_pages } = course || {};
      const {
        title,
        course_image,
        language_id: course_language_id,
      } = course?.course_translations?.[0] || {};
      const { author_image, rating, final_url } =
        course?.landing_pages?.[0]?.landing_page_translations?.[0] || {};
      const { name: domainRedirection } =
        landing_pages?.[0]?.landing_name?.domain_detail?.domain || {};

      const clone = { ...course };
      const currentDefaultPrice = clone?.course_prices?.[0] || {};
      const calculatedDiscount = 100 - clone?.discount;

      const prices = clone?.course_prices?.length
        ? {
            price: currentDefaultPrice?.price || 0,
            currency: currentDefaultPrice?.currency?.name || 'USD',
          }
        : {
            price: 0,
            currency: 'USD',
          };

      const actualPrice = formatCurrency(
        (prices.price / calculatedDiscount) * 100 || 0,
        prices.currency
      );

      return {
        id,
        title,
        category: course_categories
          ?.filter(category => category?.language_id === course_language_id)
          ?.map(item => item?.category?.name)
          ?.join(' , '),
        image: videoURL(course_image),
        instructor: {
          name: course?.user?.name,
          avatar: SERVER_URL + author_image,
        },
        rating,
        originalPrice: actualPrice,
        price: formatCurrency(prices.price, prices.currency),
        redirectionUrl: `${domainRedirection}/${final_url}`,
      };
    });
    return courseData;
  } catch (error) {
    console.error('Error fetching home courses data:', error);
  }
}

export async function fetchAllCourseCategories(data, language_id) {
  try {
    const response = await api.courseCategories.getAllCourseCategories(data);
    const courseCategoriesData = response?.data?.data?.result || [];
    if (courseCategoriesData && isEmptyArray(courseCategoriesData)) return [];

    return courseCategoriesData
      ?.filter(category => category?.language?.id === language_id)
      ?.map(category => {
        return {
          id: category?.id,
          name: category?.name,
        };
      });
  } catch (error) {
    console.error('Error fetching course details:', error);
  }
}


export async function fetchCourseForLanding(data) {
    try{
            const response = await api.home.course(data);
            const courseData = response?.data?.data;
            const isDiscountedPrice = courseData?.discountPrices?.length !== 0;

                let APIResponseData = courseData;

                if (isDiscountedPrice) {
                    const course_prices = courseData?.course?.course_prices?.map(({ ...rest }) => {
                        const { amount, stripe_price_id, currency } =
                            courseData?.discountPrices?.[0] || {};

                        return { ...rest, stripe_price_id, price: amount, currency };
                    });

                    APIResponseData = { ...courseData, course: { ...courseData?.course, course_prices } };
                } else {
                    APIResponseData = courseData;
                }

                const APIResponseLanguageId = courseData?.landing_page_translations[0]?.language_id;

                const APIResponseCoursePriceData = APIResponseData?.course?.course_prices?.filter(
                    ({ language_id }) => language_id === APIResponseLanguageId
                );

                APIResponseData = {
                    ...APIResponseData,
                    course: {
                        ...APIResponseData?.course,
                        course_prices: APIResponseCoursePriceData
                    }
                };
                const defaultCoursePrice = APIResponseData?.course?.course_prices?.find(
                    ({ language_id }) => language_id === APIResponseLanguageId
                );
            return {data: APIResponseData, defaultCoursePrice: defaultCoursePrice};
    }catch (error) {
        console.error('Error fetching course for landing:', error);
    }

}
