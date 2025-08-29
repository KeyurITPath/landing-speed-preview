import { api } from '@/api';
import { formatCurrency, isEmptyArray, videoURL } from '@utils/helper';
import {
  DOMAIN,
  POPUPS_CATEGORIES,
  RAPID_API_KEY,
  SERVER_URL,
  TIMEZONE,
  USER_ROLE,
} from '@utils/constants';
import { cookies } from 'next/headers';
import { getCountryFromServer } from '@/utils/cookies';

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

export async function fetchCourseForLanding(data: any) {
  try {
    const response = await api.home.course(data);
    const courseData = response?.data?.data || {};
    const isDiscountedPrice = courseData?.discountPrices?.length !== 0;

    let APIResponseData = courseData;

    if (isDiscountedPrice) {
      const course_prices = courseData?.course?.course_prices?.map(
        ({ ...rest }) => {
          const { amount, stripe_price_id, currency } =
            courseData?.discountPrices?.[0] || {};

          return { ...rest, stripe_price_id, price: amount, currency };
        }
      );

      APIResponseData = {
        ...courseData,
        course: { ...courseData?.course, course_prices },
      };
    } else {
      APIResponseData = courseData;
    }

    const APIResponseLanguageId =
      courseData?.landing_page_translations[0]?.language_id;

    const APIResponseCoursePriceData =
      APIResponseData?.course?.course_prices?.filter(
        ({ language_id }: any) => language_id === APIResponseLanguageId
      );

    APIResponseData = {
      ...APIResponseData,
      course: {
        ...APIResponseData?.course,
        course_prices: APIResponseCoursePriceData,
      },
    };
    const defaultCoursePrice = APIResponseData?.course?.course_prices?.find(
      ({ language_id }: any) => language_id === APIResponseLanguageId
    );
    return { data: APIResponseData, defaultCoursePrice: defaultCoursePrice };
  } catch (error) {
    console.error('Error fetching course for landing:', error);
  }
}

export async function fetchCountryCodeHandler() {
  try {
    // First check if country code exists in cookies
    const cookieStore = await cookies();
    const countryFromCookie = getCountryFromServer(cookieStore);
    console.log('countryFromCookie', countryFromCookie);
    if (countryFromCookie) {
      return countryFromCookie;
    }

    // If not in cookie, fetch from IP
    const response = await fetch('https://telize-v1.p.rapidapi.com/location', {
      method: 'GET',
      cache: 'default',
      headers: {
        'x-rapidapi-key':
          RAPID_API_KEY || '8f734bc7b2msh1a0a77977f46f49p106ea9jsnd970dd72aa4b',
        'x-rapidapi-host': 'telize-v1.p.rapidapi.com',
      },
    });

    const data = await response.json();
    console.log('data-01', data);
    const { country_code } = data || {};
    return country_code || 'US';
  } catch (error) {
    console.error('Error fetching ip or country for landing:', error);
    return 'US'; // Return default on error
  }
}

export const fetchDomainDetails = async () => {
  try {
    const response = await api.home.fetchDomainDetails({
      params: { name: DOMAIN },
    });
    return response?.data || {};
  } catch (error) {
    console.error('Error fetching domain details:', error);
  }
};

export const fetchAllLanguages = async () => {
  try {
    const response = await api.common.getAllLanguages({});
    return response?.data;
  } catch (error) {
    console.error('Error fetching all languages:', error);
  }
};

export const fetchAllCountries = async () => {
  try {
    const response = await api.countries.getAllCountries({});
    return response?.data;
  } catch (error) {
    console.error('Error fetching all countries:', error);
  }
};

export const fetchAllUpSales = async (data: any) => {
  try {
    const response = await api.home.getAllUpSales(data);
    return response?.data?.data || [];
  } catch (error) {
    console.error('Error fetching all up sales:', error);
  }
};

export const fetchAllFbAnalyticsCredentials = async (params: any) => {
  try {
    const response = await api.home.getAllFbAnalyticsCredentials(params);
    const data = await response.data;
    return {
      analyticsMetaCredentials: data?.data || [],
    };
  } catch (error) {
    console.error('Error fetching all Facebook analytics credentials:', error);
  }
};

export const fetchTrialPopups = async (data: any) => {
  try {
    const response = await api.popup.get(data);
    return response?.data?.data || {};
  } catch (error) {
    console.error('Error fetching trial popups:', error);
  }
};

export const fetchCategories = async (params: any) => {
  try {
    const response = await api.popup.getCategories(params);
    const data = await response?.data?.data;
    return data?.result || [];
  } catch (error) {
    console.error('Error fetching popup categories:', error);
  }
};

export const fetchUser = async (data: any) => {
  try {
    const response = await api.user.get(data);
    const userData = response?.data?.data || {};

    const clone = { ...userData };
    if (clone?.subscription_purchase_histories?.length) {
      clone.subscription_purchase_histories =
        clone.subscription_purchase_histories.map((item: any) => {
          return {
            ...item,
            subscription_plan: {
              ...item.plan_data,
              trial_days: item.trial_days || item.plan_data?.trial_days || 0,
            },
          };
        });
    }

    return clone;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

export const fetchTrialActivation = async (data: any) => {
  try {
    const response = await api.trialsActivation.fetchTrialActivation(data);
    const responseData = response?.data?.data;
    return responseData?.result || {};
  } catch (error) {
    console.error('Error fetching trial activation:', error);
  }
};
