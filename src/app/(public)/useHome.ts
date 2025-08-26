import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import momentTimezone from 'moment-timezone';
import {
  DOMAIN,
  POPUPS_CATEGORIES,
  SERVER_URL,
  TIMEZONE,
  USER_ROLE,
} from '@utils/constants';
import useDispatchWithAbort from '@hooks/use-dispatch-with-abort';
import {
  fetchHomeCourses,
  getAllPopularCoursesOnBrand,
  handlePagination,
  resetPagination,
} from '@store/features/home.slice';
import {
  formatCurrency,
  isEmptyArray,
  isEmptyObject,
  shouldOfferTrial,
  videoURL,
} from '@utils/helper';
import { getAllCourseCategories } from '@store/features/course-categories.slice';
import useToggleState from '@hooks/use-toggle-state';
import { fetchCategories, fetchTrialPopups } from '@store/features/popup.slice';
import { useRouter, useSearchParams } from 'next/navigation';

const useHome = () => {

  const router = useRouter();

  const [fetchHomeCoursesData] = useDispatchWithAbort(fetchHomeCourses);
  const [fetchAllCourseCategories] = useDispatchWithAbort(
    getAllCourseCategories
  );
  const [fetchAllPopularCoursesOnBrand] = useDispatchWithAbort(
    getAllPopularCoursesOnBrand
  );
  const [fetchCategoriesData] = useDispatchWithAbort(fetchCategories);
  const [fetchTrialPopupsData] = useDispatchWithAbort(fetchTrialPopups);

  const [trialPopupState, trialPopupOpen, trialPopupClose] = useToggleState();
  const { isLoggedIn, user } = useSelector(({ auth }: any) => auth);

  const {
    trialPopups: { data: trialPopupsData },
    categories,
  } = useSelector((state: any) => state.popup);

  const {
    language: { id: language_id },
    country,
  } = useSelector((state: any) => state.defaults);

  const { country_code } = country || {};

  const {
    courses: {
      data: courseData,
      loading: courseDataLoading,
      pagination: params,
    },
    popularCoursesOnBrand: {
      data: popularCoursesOnBrand,
      loading: popularCoursesOnBrandLoading,
      pagination: popularCoursesOnBrandParams,
    },
  } = useSelector(({ home }: any) => home);

  const {
    courseCategories: { data: courseCategoriesData },
  } = useSelector(({ courseCategories }: any) => courseCategories);

  const filterCategory = useMemo(() => {
    return !isEmptyArray(params?.course_categories)
      ? params?.course_categories
      : [];
  }, [params]);

  const shouldOfferTrials = useMemo(() => {
    return shouldOfferTrial(user);
  }, [user]);

  const dispatch = useDispatch();
  const queryParams = useSearchParams();

  const isPaymentSuccess = useMemo(() => {
    return queryParams?.get('payment') === 'success';
  }, [queryParams]);

  const isPaymentFailed = useMemo(() => {
    return queryParams?.get('payment') === 'failed';
  }, [queryParams]);

  const isBecomeAMemberWithVerified = useMemo(() => {
    if (!user) return false;

    if (
      ![USER_ROLE.CUSTOMER, USER_ROLE.AUTHOR].includes(user.role) ||
      !user.is_verified
    ) {
      return false;
    }

    const currentTime = momentTimezone().tz(TIMEZONE);
    const subscriptionEndDate = user?.subscription_end_date
      ? momentTimezone(user.subscription_end_date).tz(TIMEZONE)
      : null;

    return (
      !user.is_subscribed ||
      (subscriptionEndDate && !subscriptionEndDate.isAfter(currentTime))
    );
  }, [user]);

  const CATEGORIES_BADGE = useMemo(() => {
    if (courseCategoriesData && isEmptyArray(courseCategoriesData)) return [];

    return courseCategoriesData
      ?.filter((category: any) => category?.language?.id === language_id)
      ?.map((category: any) => {
        return {
          id: category?.id,
          name: category?.name,
        };
      });
  }, [courseCategoriesData, language_id]);

  const homePageCoursesData = useMemo(() => {
    if (courseData && isEmptyArray(courseData)) return [];

    return courseData?.map((course: any) => {
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
      let prices,
        actualPrice = {};

      const clone = { ...course };
      const currentDefaultPrice = clone?.course_prices?.[0] || {};
      const calculatedDiscount = 100 - clone?.discount;

      prices = clone?.course_prices?.length
        ? {
            price: currentDefaultPrice?.price || 0,
            currency: currentDefaultPrice?.currency?.name || 'USD',
          }
        : {
            price: 0,
            currency: 'USD',
          };

      actualPrice = formatCurrency(
        (prices.price / calculatedDiscount) * 100 || 0,
        prices.currency
      );

      return {
        id,
        title,
        category: course_categories
          ?.filter((category: any) => category?.language_id === course_language_id)
          ?.map((item: any) => item?.category?.name)
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
  }, [courseData]);

  const popularCoursesOnBrandData = useMemo(() => {
    if (!popularCoursesOnBrand?.length) return [];

    return popularCoursesOnBrand.map((course: any) => {
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
  }, [popularCoursesOnBrand]);

  const updatePagination = useCallback(
    (newParams: any) => {
      dispatch(handlePagination({ ...params, ...newParams }));
    },
    [dispatch, params]
  );

  const filterCategoryHandler = useCallback(
    (category_id: any) => {
      updatePagination({
        ...params,
        course_categories: params?.course_categories?.includes(category_id)
          ? []
          : [category_id],
      });
    },
    [params, updatePagination]
  );

  useEffect(() => {
    if (language_id && country_code)
      fetchAllCourseCategories({
        params: { language_id },
        headers: {
          'req-from': country_code,
        },
      });
  }, [fetchAllCourseCategories, language_id, country_code]);

  useEffect(() => {
    if (language_id && country_code) {
      const filteredParams = Object.fromEntries(
        Object.entries(params)
          .filter(
            ([, value]) =>
              value != null &&
              value !== '' &&
              value !== 'all' &&
              (!Array.isArray(value) || value.length > 0)
          )
          .map(([key, value]) => [
            key,
            Array.isArray(value) ? JSON.stringify(value) : value,
          ])
      );

      if (filteredParams?.course_categories) {
        delete filteredParams['limit'];
        delete filteredParams['page'];
      }

      fetchHomeCoursesData({
        params: {
          ...filteredParams,
          language_id,
          domain: DOMAIN,
          ...(user?.id && { user_id: user?.id }),
        },
        headers: {
          'req-from': country_code,
        },
      });
    }
  }, [fetchHomeCoursesData, language_id, params, country_code, user?.id]);

  useEffect(() => {
    if (language_id && country_code) {
      const filteredPopularCoursesOnBrandParams = Object.fromEntries(
        Object.entries(popularCoursesOnBrandParams)
          .filter(
            ([, value]) =>
              value != null &&
              value !== '' &&
              value !== 'all' &&
              (!Array.isArray(value) || value.length > 0)
          )
          .map(([key, value]) => [
            key,
            Array.isArray(value) ? JSON.stringify(value) : value,
          ])
      );

      fetchAllPopularCoursesOnBrand({
        params: {
          ...filteredPopularCoursesOnBrandParams,
          language_id,
          domain: DOMAIN,
          ...(user?.id && { user_id: user?.id }),
        },
        headers: {
          'req-from': country_code,
        },
      });
    }
  }, [
    fetchAllPopularCoursesOnBrand,
    language_id,
    popularCoursesOnBrandParams,
    country_code,
    user?.id,
  ]);

  useEffect(() => {
    if (isBecomeAMemberWithVerified) fetchCategoriesData();
  }, [fetchCategoriesData, isBecomeAMemberWithVerified]);

  useEffect(() => {
    if (isBecomeAMemberWithVerified && categories?.data?.length) {
      // Find category IDs once
      const trialPopupsCategoryId = categories.data.find(
        ({ slug }: any) => slug === POPUPS_CATEGORIES.trial_popups
      )?.id;

      if (trialPopupsCategoryId && isEmptyObject(trialPopupsData)) {
        fetchTrialPopupsData({
          params: { popUps_category_id: trialPopupsCategoryId },
        });
      }
    }
  }, [
    categories?.data,
    fetchTrialPopupsData,
    isBecomeAMemberWithVerified,
    trialPopupsData,
  ]);

  useEffect(() => {
    return () => {
      dispatch(resetPagination());
    };
  }, [dispatch]);

  const handleRedirect = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const handleStartFree = useCallback(
    (id: string, title: string) => {
      trialPopupOpen({
        open: true,
        course_id: id,
        course_title: title,
      });
    },
    [trialPopupOpen]
  );
  return {
    COURSES_DATA: homePageCoursesData,
    courseDataLoading,
    POPULAR_BRAND_COURSES_DATA: popularCoursesOnBrandData,
    isPopularBrandCoursesDataLoading: popularCoursesOnBrandLoading,
    dispatch,
    isBecomeAMemberWithVerified,
    CATEGORIES_BADGE,
    filterCategory,
    filterCategoryHandler,
    isPaymentFailed,
    isPaymentSuccess,
    isLoggedIn,
    handleRedirect,
    trialPopupState,
    trialPopupClose,
    handleStartFree,
    language_id,
    shouldOfferTrials,
  };
};

export default useHome;
