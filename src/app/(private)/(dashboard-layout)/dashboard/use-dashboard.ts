'use client';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import momentTimezone from 'moment-timezone';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import cookies from 'js-cookie'
import {
  DOMAIN,
  POPUPS_CATEGORIES,
  SERVER_URL,
  TIMEZONE,
  TRIAL_ACTIVATION_METHODS,
  USER_ROLE,
} from '@/utils/constants';
import {
  decodeToken,
  formatCurrency,
  getSubscriptionPayload,
  isEmptyArray,
  isEmptyObject,
  videoURL,
} from '@/utils/helper';
import { useMediaQuery } from '@mui/material';
import {
  fetchDashboardCourses,
  fetchUserInteractedDates,
  handlePagination,
  resetPagination,
} from '@/store/features/dashboard.slice';
import useToggleState from '@/hooks/use-toggle-state';
import {
  fetchCategories,
  fetchTrialBannerPopups,
  fetchTrialPopups,
} from '@/store/features/popup.slice';
import useAsyncOperation from '@/hooks/use-async-operation';
import { api } from '@/api';
import { updateUser } from '@/store/features/auth.slice';
// import { gtm } from '../../assets/utils/gtm';
import { fetchUser } from '@/store/features/user.slice';
import moment from 'moment/moment';
import {
  getAllLanguages,
  getIpAddress,
  setLanguage,
} from '@/store/features/defaults.slice';
import { AuthContext } from '@/context/auth-provider';
import useSocket from '@/hooks/use-socket';

const useDashboard = ({
  language_id,
  user,
  domainDetails,
  country_code,
  courseOfTheWeek,
  popularCoursesOnBrand,
  courseCategoriesData
}: any) => {
  const { setToken } = useContext(AuthContext);
  const { updateSocketOnLogin } = useSocket();
  const [fetchDashboardCoursesData] = useDispatchWithAbort(
    fetchDashboardCourses
  );
  const [fetchCategoriesData] = useDispatchWithAbort(fetchCategories);
  const [fetchTrialPopupsData] = useDispatchWithAbort(fetchTrialPopups);
  const [fetchTrialBannerPopupsData] = useDispatchWithAbort(
    fetchTrialBannerPopups
  );
  const [fetchUserData] = useDispatchWithAbort(fetchUser);
  const [fetchUserInteractedData] = useDispatchWithAbort(
    fetchUserInteractedDates
  );
  const [fetchIpAddressData] = useDispatchWithAbort(getIpAddress);

  const [trialPopupState, trialPopupOpen, trialPopupClose] = useToggleState({});

  const queryParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    trialPopups: { data: trialPopupsData },
    trialBannerPopups: { data: trialBannerPopupsData },
    categories,
  } = useSelector((state: any) => state.popup);

  const {
    courses: { data: courseData, pagination: params, loading },
    userInteractedDates: {
      data: userInteractedDatesData,
      total_login_days: totalLoginDaysCount,
    },
  } = useSelector(({ dashboard }: any) => dashboard);

  const courseOfTheWeekData = courseOfTheWeek

  const { brand_name } = domainDetails?.data?.domain_detail || {};

  const filterCategory = useMemo(() => {
    return !isEmptyArray(params?.course_categories)
      ? params?.course_categories
      : [];
  }, [params]);

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme => theme.breakpoints.down('md'));

  const dispatch = useDispatch();

  const BRAND_NAME = useMemo(() => {
    return brand_name || '';
  }, [brand_name]);

  const fetchCountryCodeHandler = useCallback(() => {
    if (!country_code && fetchIpAddressData) {
      fetchIpAddressData({});
    }
  }, [country_code, fetchIpAddressData]);

  useEffect(() => {
    fetchCountryCodeHandler();
  }, [fetchCountryCodeHandler]);

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

  // if language can't find then execute the function
  useEffect(() => {
    if (!language_id) {
      dispatch(getAllLanguages({})).then((res: any) => {
        const languagesData = res?.payload?.data?.result || [];
        const currentLang = languagesData.find(
          (lang: any) => lang.code === 'en'
        );
        dispatch(setLanguage(currentLang));
      });
    }
  }, [dispatch, language_id]);

  const dashboardCoursesData = useMemo(() => {
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
          ?.filter(
            (category: any) => category?.language_id === course_language_id
          )
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
    if (popularCoursesOnBrand && isEmptyArray(popularCoursesOnBrand)) return [];

    return popularCoursesOnBrand?.map((course: any) => {
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
          ?.filter(
            (category: any) => category?.language_id === course_language_id
          )
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

  const CourseOfTheWeekData = useMemo(() => {
    if (
      courseOfTheWeekData &&
      isEmptyObject(courseOfTheWeekData) &&
      Number(courseOfTheWeekData?.language_id) !== Number(language_id)
    )
      return {};

    const { course, course_id } = courseOfTheWeekData;

    const { landing_pages, course_translations } = course || {};

    const findCourseTranslation = course_translations?.find(
      (item: any) => item?.language_id === language_id
    );

    const { course_image, description, title } = findCourseTranslation || {};

    const findCourseLandingPage = landing_pages?.find((landingPage: any) => {
      return landingPage?.landing_page_translations?.find(
        (landingPageTranslation: any) => {
          return landingPageTranslation?.language_id === language_id;
        }
      );
    });

    const findCourseLandingPageTranslation =
      findCourseLandingPage?.landing_page_translations?.find(
        (landingPageTranslation: any) =>
          landingPageTranslation?.language_id === language_id
      );
    const { name: domainRedirection } =
      landing_pages?.[0]?.landing_name?.domain_detail?.domain || {};
    const { final_url } = findCourseLandingPageTranslation || {};

    return {
      id: course_id,
      image: videoURL(course_image),
      title,
      description,
      instructor: {
        name: course?.user?.name,
      },
      redirectionUrl: `${domainRedirection}/${final_url}`,
    };
  }, [courseOfTheWeekData, language_id]);

  const fetchLatestTokenAPI = useCallback(async () => {
    const response = await api.token.getToken({
      params: {
        userId: user?.id,
      },
      cookieToken: cookies.get('token') || ''
    });

    if (response?.data) {
      const token = response?.data?.data;
      const registerUserData = decodeToken(token);
      updateSocketOnLogin(token);
      setToken(token);
      dispatch(
        updateUser({
          activeUI: '',
          ...user,
          ...registerUserData,
        })
      );
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchLatestTokenAPI();
  }, [fetchLatestTokenAPI]);

  useEffect(() => {
    if (isBecomeAMemberWithVerified && fetchCategoriesData) {
      fetchCategoriesData({});
    }
  }, [fetchCategoriesData, isBecomeAMemberWithVerified]);

  useEffect(() => {
    if (isBecomeAMemberWithVerified && categories?.data?.length) {
      const trialPopupsCategoryId = categories.data.find(
        ({ slug }: any) => slug === POPUPS_CATEGORIES.trial_popups
      )?.id;

      const trialBannerCategoryId = categories.data.find(
        ({ slug }: any) => slug === POPUPS_CATEGORIES.trial_banner
      )?.id;

      if (
        trialPopupsCategoryId &&
        isEmptyObject(trialPopupsData) &&
        fetchTrialPopupsData
      ) {
        fetchTrialPopupsData({
          params: { popUps_category_id: trialPopupsCategoryId },
        });
      }

      if (
        trialBannerCategoryId &&
        isEmptyObject(trialBannerPopupsData) &&
        fetchTrialBannerPopupsData
      ) {
        fetchTrialBannerPopupsData({
          params: { popUps_category_id: trialBannerCategoryId },
        });
      }
    }
  }, [
    categories?.data,
    fetchTrialPopupsData,
    fetchTrialBannerPopupsData,
    isBecomeAMemberWithVerified,
    trialPopupsData,
    trialBannerPopupsData,
  ]);

  useEffect(() => {
    if (country_code && user?.id && fetchUserData) {
      fetchUserData({
        params: {
          user_id: user?.id,
          language: language_id,
          domain: DOMAIN,
          payment_status: 'paid',
        },
        headers: {
          'req-from': country_code,
        },
      });
    }
  }, [fetchUserData, language_id, user?.id, country_code]);

  useEffect(() => {
    if (language_id && country_code && user?.id) {
      const filteredParams = Object?.fromEntries(
        Object?.entries(params)
          ?.filter(
            ([, value]) =>
              value != null &&
              value !== '' &&
              value !== 'all' &&
              (!Array.isArray(value) || value.length > 0)
          )
          ?.map(([key, value]) => [
            key,
            Array.isArray(value) ? JSON.stringify(value) : value,
          ])
      );

      if (filteredParams?.course_categories) {
        delete filteredParams['limit'];
        delete filteredParams['page'];
      }

      if (fetchDashboardCoursesData) {
        fetchDashboardCoursesData({
          params: { ...filteredParams, language_id, domain: DOMAIN },
          headers: {
            'req-from': country_code,
          },
        });
      }
    }
  }, [fetchDashboardCoursesData, language_id, params, user?.id, country_code]);

  const handleStartFree = useCallback(
    (id: any, title: string) => {
      trialPopupOpen({
        open: true,
        course_id: id,
        course_title: title,
      });
    },
    [trialPopupOpen]
  );

  const findTrialBannerTopOfThePageData = useMemo(() => {
    if (trialBannerPopupsData?.slug !== 'trial_banner') return {};

    const findTrialBannerTopOfThePage =
      trialBannerPopupsData?.popUps_sub_categories?.find(
        ({ slug }: any) => slug === 'trial_banner_top_of_the_page'
      );

    return findTrialBannerTopOfThePage;
  }, [
    trialBannerPopupsData?.popUps_sub_categories,
    trialBannerPopupsData?.slug,
  ]);

  const activeLanguageTrialBannerTopOfThePageSubscriptionPlan = useMemo(() => {
    if (!findTrialBannerTopOfThePageData) return {};
    const findActiveLanguageSubscriptionPlan =
      findTrialBannerTopOfThePageData?.subscription_plan_popups?.find(
        ({ language_id: languageId }: { language_id: string }) =>
          languageId === language_id
      );

    return findActiveLanguageSubscriptionPlan;
  }, [findTrialBannerTopOfThePageData, language_id]);

  const transformDataForTrialBannerTopOfThePage = useMemo(() => {
    if (!findTrialBannerTopOfThePageData) return {};

    const findPopUpsTranslationsData =
      findTrialBannerTopOfThePageData?.popUps_translations?.find(
        ({ language_id: languageId }: { language_id: string }) =>
          languageId === language_id
      );

    const { popup_data } = findPopUpsTranslationsData || {};
    const { title, trial_days, status } = popup_data || {};

    const { subscription_plan } =
      activeLanguageTrialBannerTopOfThePageSubscriptionPlan || {};
    const { subscription_plan_prices } = subscription_plan || {};
    const { amount: price, currency } = subscription_plan_prices?.[0] || {};

    const currencyCode = currency?.name || 'USD';

    return {
      title,
      trial_days,
      price: formatCurrency(price, currencyCode),
      status,
    };
  }, [
    activeLanguageTrialBannerTopOfThePageSubscriptionPlan,
    findTrialBannerTopOfThePageData,
    language_id,
  ]);

  const onPopupSuccess = useCallback(() => {
    const queryString = new URLSearchParams(queryParams).toString();

    router.replace(
      `${pathname}?subscription=activated${queryString ? `&${queryString}` : ''}`
    );
    // gtm.trial_activation.trial_top_banner();
  }, [queryParams, router, pathname]);

  const [
    startFreeTrialSubmitForTopOfTheBanner,
    startFreeTrialSubmitForTopOfTheBannerLoading,
  ] = useAsyncOperation(async () => {
    const { subscription_plan, trial_days } =
      activeLanguageTrialBannerTopOfThePageSubscriptionPlan || {};
    const { subscription_plan_prices } = subscription_plan || {};
    const { stripe_price_id } = subscription_plan_prices?.[0] || {};

    const purchasePayload = {
      userId: user?.id,
      language_id,
      stripe_price_id,
      name: user?.is_user_purchased_trial
        ? 'Subscription with discount'
        : 'monthly subscription',
      ...(!user?.is_user_purchased_trial && { trial_days }),
    };

    const response = await api.plan.purchasePlan({
      data: {
        trial_activation_method:
          TRIAL_ACTIVATION_METHODS.TOP_OF_THE_PAGE_BANNER,
        ...purchasePayload,
        ...getSubscriptionPayload(),
      },
    });

    if (response?.data?.data?.checkoutUrl) {
      window.open(response?.data?.data?.checkoutUrl, '_self');
      return;
    }

    const { token } = response?.data?.data || {};

    let registerUserData = {};

    if (token) {
      updateSocketOnLogin(token);
      setToken(token);
      registerUserData = decodeToken(token);
      dispatch(
        updateUser({
          activeUI: '',
          ...user,
          ...registerUserData,
        })
      );
    }

    onPopupSuccess();
  });

  const isSubscriptionActivated = useMemo(() => {
    return (
      queryParams?.get('subscription') === 'activated' ||
      (queryParams?.get('type') !== 'purchase_course' &&
        queryParams?.get('payment') === 'success')
    );
  }, [queryParams]);

  useEffect(() => {
    if (
      queryParams?.get('payment') === 'success' &&
      queryParams?.get('type') === 'purchase_course'
    ) {
      router.replace(pathname);
    }
  }, [pathname, queryParams, router]);

  useEffect(() => {
    const postAndFetchData = async () => {
      if (user?.id) {
        try {
          await api.dashboard.addUserInteraction({
            data: {
              user_id: user?.id,
              login_date: moment().format('YYYY-MM-DD'),
            },
            headers: { 'req-from': country_code || '' },
            cookieToken: cookies.get('token') || ''
          });

          if (fetchUserInteractedData) {
            fetchUserInteractedData({
              params: { user_id: user?.id },
              headers: { 'req-from': country_code || '' },
              cookieToken: cookies.get('token') || ''
            });
          }
        } catch (error) {
          console.error('Error posting user interaction:', error);
        }
      }
    };

    postAndFetchData();
  }, [country_code, fetchUserInteractedData, user?.id]);

  useEffect(() => {
    return () => {
      dispatch(resetPagination());
    };
  }, [dispatch]);



  return {
    isCourseDataLoading: loading,
    COURSES_DATA: dashboardCoursesData,
    POPULAR_BRAND_COURSES_DATA: popularCoursesOnBrandData,
    COURSE_OF_THE_WEEK_DATA: CourseOfTheWeekData,
    isBecomeAMemberWithVerified,
    BRAND_NAME,
    isMobile,
    filterCategory,
    filterCategoryHandler,
    trialPopupState,
    trialPopupClose,
    handleStartFree,
    transformDataForTrialBannerTopOfThePage,
    startFreeTrialSubmitForTopOfTheBanner,
    isStartFreeTrialSubmitForTopOfTheBannerLoading:
      startFreeTrialSubmitForTopOfTheBannerLoading,
    isSubscriptionActivated,
    isTablet,
    CALENDAR_DATA: userInteractedDatesData,
    totalLoginDaysCount
  };
};

export default useDashboard;
