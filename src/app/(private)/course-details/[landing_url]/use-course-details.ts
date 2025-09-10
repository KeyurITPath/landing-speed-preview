import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import moment from 'moment';
import {
  DOMAIN,
  POPUPS_CATEGORIES,
  SERVER_URL,
  TIMEZONE,
  TRIAL_ACTIVATION_METHODS,
} from '@/utils/constants';
import {
  decodeToken,
  formatCurrency,
  getSubscriptionPayload,
  isEmptyArray,
  isEmptyObject,
  shouldOfferTrial,
  videoURL,
} from '@/utils/helper';
import { setLanguage } from '@/store/features/defaults.slice';
import { routes } from '@/utils/constants/routes';
// import i18n from '../../i18n';
import useToggleState from '@/hooks/use-toggle-state';
import { fetchUser } from '@/store/features/user.slice';
import { getAllCourseCategories } from '@/store/features/course-categories.slice';
import {
  fetchCategories,
  fetchTrialBannerPopups,
  fetchTrialPopups,
} from '@/store/features/popup.slice';
import useAsyncOperation from '@/hooks/use-async-operation';
import { api } from '@/api';
import { updateUser } from '@/store/features/auth.slice';
import {
        getAllPopularCoursesDataByCategories,
    getAllRecommendedCourses,
    getUserCourseProgress,
    handlePagination,
    resetPagination,
    updateCourseModuleLessonWatchTime,
    updateWatchCourseModuleLesson
} from '@/store/features/course-details.slice';
import { getWidgetScriptData } from '@/store/features/widget-script.slice';
import useSocket from '@/hooks/use-socket';
import { AuthContext } from '@/context/auth-provider';
import { gtm } from '@/utils/gtm';

let globalPipValue = false;
interface GlobalLastReportedTimeItem {
    lesson_id: number;
    lessonLastWatchTime: number;
    lastUpdated?: number;
}

let globalLastReportedTime: GlobalLastReportedTimeItem[] = [];

const getFilteredParams = (params: any) => {
    return Object.fromEntries(
        Object.entries(params)
            .filter(
                ([, value]) =>
                    value != null &&
                    value !== '' &&
                    value !== 'all' &&
                    (!Array.isArray(value) || value.length > 0)
            )
            .map(([key, value]) => [key, Array.isArray(value) ? JSON.stringify(value) : value])
    );
};

const useCourseDetails = ({
    slug,
    user,
    country_code,
    domainDetails,
    language_id,
    languages,
    isBecomeVerifiedAndSubscribed,
    isBecomeAMemberWithVerified,
    isUserPurchasedCourse
}: any) => {
    const { socket, updateSocketOnLogin } = useSocket();
    const { setToken } = useContext(AuthContext);
    const [fetchUserData] = useDispatchWithAbort(fetchUser);
    const [fetchAllCourseCategories] = useDispatchWithAbort(getAllCourseCategories);
    const [fetchTrialPopupsData] = useDispatchWithAbort(fetchTrialPopups);
    const [fetchTrialBannerPopupsData] = useDispatchWithAbort(fetchTrialBannerPopups);
    const [fetchAllPopularCoursesDataByCategories] = useDispatchWithAbort(
        getAllPopularCoursesDataByCategories
    );
    const [fetchUserCourseProgress] = useDispatchWithAbort(getUserCourseProgress);
    const [fetchRecommendedCourses] = useDispatchWithAbort(getAllRecommendedCourses);
    const [fetchWidgetScriptData] = useDispatchWithAbort(getWidgetScriptData);

    const queryParams = useSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();

    const [trialPopupState, trialPopupOpen, trialPopupClose] = useToggleState({});

        const {
        courseCategories: { data: courseCategoriesData }
    } = useSelector(({ courseCategories }: any) => courseCategories);

    const {
        popularCoursesDataByCategories: {
            data: popularCoursesDataByCategoriesData,
            loading: popularCoursesDataByCategoriesDataLoading,
            pagination: params
        },
        recommendedCourses: {
            data: recommendedCoursesAPIData,
            loading: recommendedCoursesAPIDataLoading
        },
        getUserCourseProgress: {
            data: getUserCourseProgressData,
            loading: getUserCourseProgressDataLoading
        },
        getUserCourseProgressApiDataForCopy: { data: getUserCourseProgressApiDataForCopy }
    } = useSelector(({ courseDetails }: any) => courseDetails);

    const {
        trialPopups: { data: trialPopupsData },
        trialBannerPopups: { data: trialBannerPopupsData },
        categories
    } = useSelector((state: any) => state.popup);

    const { data: widgetScriptData } = useSelector(({ widgetScript }: any) => widgetScript);

    const [selectedLesson, setSelectedLesson] = useState(null);
    const [selectedModuleId, setSelectedModuleId] = useState(null);

    const [pipMode, setPipMode] = useState(false);
    const [pipModeClosed, setPipModeClosed] = useState(false);
    const [videoAutoplay, setVideoAutoplay] = useState(true);
    const videoContainerRef = useRef(null);

    const languagesData = languages || [];

    globalPipValue = pipMode;

        const { logo, email, legal_name, brand_name } = domainDetails?.data?.domain_detail || {};
    const { name: domainName } = domainDetails?.data || {};

    const LOGO_URL = useMemo(() => {
        return logo ? SERVER_URL + logo : null;
    }, [logo]);

    const BRAND_NAME = useMemo(() => {
        return brand_name || '';
    }, [brand_name]);

    const SUPPORT_MAIL = useMemo(() => {
        return email || '';
    }, [email]);

    const LEGAL_NAME = useMemo(() => {
        return legal_name || '';
    }, [legal_name]);

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const findTrialSideBannerData = useMemo(() => {
        if (trialBannerPopupsData?.slug !== 'trial_banner') return {};

        const findTrialSideBanner = trialBannerPopupsData?.popUps_sub_categories?.find(
            ({ slug }: any) => slug === 'trial_banner_side_banner'
        );

        return findTrialSideBanner;
    }, [trialBannerPopupsData?.popUps_sub_categories, trialBannerPopupsData?.slug]);

    const activeLanguageTrialSideBannerSubscriptionPlan = useMemo(() => {
        if (!findTrialSideBannerData) return {};

        const findActiveLanguageSubscriptionPlan =
            findTrialSideBannerData?.subscription_plan_popups?.find(
                ({ language_id: languageId }: any) => languageId === language_id
            );

        return findActiveLanguageSubscriptionPlan;
    }, [findTrialSideBannerData, language_id]);

        const transformDataForTrialSideBanner = useMemo(() => {
        if (!findTrialSideBannerData) return {};
        const findPopUpsTranslationsData = findTrialSideBannerData?.popUps_translations?.find(
            ({ language_id: languageId }: any) => languageId === language_id
        );

        const { popup_data } = findPopUpsTranslationsData || {};
        const { title, trial_days, status, description } = popup_data || {};

        const { subscription_plan } = activeLanguageTrialSideBannerSubscriptionPlan || {};
        const { subscription_plan_prices } = subscription_plan || {};
        const { amount: price, currency, stripe_price_id } = subscription_plan_prices?.[0] || {};

        const currencyCode = currency?.name || 'USD';

        let updateTitle = title;
        let updatedDescription = description;

        if (updateTitle?.length) {
            updateTitle = updateTitle.replaceAll('{BRAND_NAME}', BRAND_NAME);
        }

        if (updatedDescription?.length) {
            updatedDescription = updatedDescription.replaceAll(
                '{TRIAL_SIDE_BANNER_TRIAL_DAYS}',
                trial_days
            );
            updatedDescription = updatedDescription.replaceAll(
                '{TRIAL_SIDE_BANNER_TRIAL_PRICE}',
                formatCurrency(price, currencyCode)
            );
        }

        return {
            title: updateTitle,
            description: updatedDescription,
            trial_days,
            stripe_price_id,
            price: formatCurrency(price, currencyCode),
            status
        };
    }, [
        activeLanguageTrialSideBannerSubscriptionPlan,
        findTrialSideBannerData,
        language_id,
        BRAND_NAME
    ]);

    const getUserCourseProgressApiDataForCopyCourseLanguageId = useMemo(() => {
        return getUserCourseProgressApiDataForCopy?.course_translations?.[0]?.language_id || null;
    }, [getUserCourseProgressApiDataForCopy]);

    useEffect(() => {
        if (country_code && user?.id && fetchUserData) {
            fetchUserData({
                params: {
                    user_id: user?.id,
                    language: language_id,
                    domain: DOMAIN,
                    payment_status: 'paid'
                },
                headers: {
                    'req-from': country_code
                }
            });
        }
    }, [fetchUserData, language_id, user?.id, country_code]);

    useEffect(() => {
        if (country_code && user?.id && language_id) {
            const filteredParams = getFilteredParams(params);

            if (filteredParams?.course_categories) {
                delete filteredParams['page'];
                delete filteredParams['limit'];
            }

            if(fetchAllPopularCoursesDataByCategories){
                fetchAllPopularCoursesDataByCategories({
                    params: { ...filteredParams, language_id, domain: DOMAIN },
                    headers: {
                        'req-from': country_code
                    }
                });
            }

        }
    }, [fetchAllPopularCoursesDataByCategories, language_id, params, user?.id, country_code]);

    useEffect(() => {
        if (country_code && user?.id && slug) {
            const commonHeaders = { 'req-from': country_code };
            const commonParams = { domain: DOMAIN };

            Promise.all([
                fetchUserCourseProgress({
                    params: {
                        ...commonParams,
                        final_url: slug,
                        user_id: user?.id
                    },
                    headers: commonHeaders
                }),
                fetchRecommendedCourses({
                    params: {
                        ...commonParams,
                        final_url: slug
                    },
                    headers: commonHeaders
                })
            ]);
        }
    }, [fetchRecommendedCourses, fetchUserCourseProgress, slug, country_code, user?.id]);

    useEffect(() => {
        if (language_id && country_code && !courseCategoriesData?.length) {
            fetchAllCourseCategories({
                params: { language_id }
            });
        }
    }, [fetchAllCourseCategories, language_id, country_code, courseCategoriesData]);

    useEffect(() => {
        if (getUserCourseProgressApiDataForCopy?.id && languagesData?.length) {
            const [landing] = getUserCourseProgressApiDataForCopy?.landing_page_translations || [];
            const newLanguageId = landing?.language_id;

            if (newLanguageId && newLanguageId !== language_id) {
                dispatch(setLanguage({ id: newLanguageId }));
                const selectedLanguage = languagesData.find((lang: any) => lang.id === newLanguageId);
                if (selectedLanguage?.code) {
                    // i18n.changeLanguage(selectedLanguage.code);
                }
            }
        }
    }, [
        getUserCourseProgressApiDataForCopy?.id,
        languagesData,
        dispatch,
        language_id,
        getUserCourseProgressApiDataForCopy?.landing_page_translations
    ]);

    useEffect(() => {
        if (isBecomeAMemberWithVerified && categories?.data?.length) {
            const trialPopupsCategoryId = categories.data.find(
                ({ slug }: any) => slug === POPUPS_CATEGORIES.trial_popups
            )?.id;

            if (trialPopupsCategoryId && isEmptyObject(trialPopupsData) && fetchTrialPopupsData) {
                fetchTrialPopupsData({
                    params: { popUps_category_id: trialPopupsCategoryId },
                    headers: {
                        'req-from': country_code
                    }
                });
            }
        }
    }, [categories.data, country_code, fetchTrialPopupsData, isBecomeAMemberWithVerified, trialPopupsData]);

    useEffect(() => {
        if(fetchWidgetScriptData){
            fetchWidgetScriptData({
                headers: {
                    'req-from': country_code
                }
            });
        }
    }, [country_code, fetchWidgetScriptData]);

    const translation = useMemo(() => {
        if (
            getUserCourseProgressDataLoading ||
            !getUserCourseProgressApiDataForCopy?.landing_pages?.[0]?.landing_page_translations
                ?.length
        )
            return {};
        return (
            getUserCourseProgressApiDataForCopy?.landing_pages?.[0]
                ?.landing_page_translations?.[0] || {}
        );
    }, [getUserCourseProgressApiDataForCopy, getUserCourseProgressDataLoading]);

    const metaTagDetails = useMemo(() => {
        if (translation) {
            const data = translation || {};
            return {
                title: data?.header,
                description: data?.description
            };
        }
        return {};
    }, [translation]);

    useEffect(() => {
        if (getUserCourseProgressDataLoading) {
            document.title = BRAND_NAME ? BRAND_NAME : 'Loading...';
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.name = 'description';
                document.head.appendChild(metaDescription);
            }
            metaDescription.content = 'Please wait while we load the content.';
        } else {
            if (metaTagDetails.title) {
                document.title = metaTagDetails.title;
            }

            if (metaTagDetails.description) {
                let metaDescription = document.querySelector('meta[name="description"]');
                if (!metaDescription) {
                    metaDescription = document.createElement('meta');
                    metaDescription.name = 'description';
                    document.head.appendChild(metaDescription);
                }
                metaDescription.content = metaTagDetails.description;
            }
        }
    }, [getUserCourseProgressDataLoading, metaTagDetails, BRAND_NAME]);

    const navigateHomePage = useCallback(() => {
        router.push(routes.public.home);
    }, [router]);

    const isSubscriptionActivated = useMemo(() => {
        return queryParams?.get('subscription') === 'activated' || queryParams?.get('payment') === 'success';
    }, [queryParams]);

    const handleStartFree = useCallback(
        (id: any, title: string) => {
            trialPopupOpen({
                open: true,
                course_id: id,
                course_title: title
            });
        },
        [trialPopupOpen]
    );

    const recommendedCoursesData = useMemo(() => {
        if (!recommendedCoursesAPIData?.course || isEmptyObject(recommendedCoursesAPIData?.course))
            return [];

        const { recommended_courses } = recommendedCoursesAPIData?.course || [];

        if (!recommended_courses || isEmptyArray(recommended_courses)) return [];

        return recommended_courses?.map((recommendedCourses: any) => {
            const {
                title,
                course_image,
                language_id: course_language_id,
                course
            } = recommendedCourses?.course_translation || {};

            const { id, course_categories, landing_pages } = course || {};

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
                      currency: currentDefaultPrice?.currency?.name || 'USD'
                  }
                : {
                      price: 0,
                      currency: 'USD'
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
                    avatar: SERVER_URL + author_image
                },
                rating,
                originalPrice: actualPrice,
                price: formatCurrency(prices.price, prices.currency),
                redirectionUrl: `${domainRedirection}/${final_url}`
            };
        });
    }, [recommendedCoursesAPIData?.course]);

        const CATEGORIES_BADGE = useMemo(() => {
        if (courseCategoriesData && isEmptyArray(courseCategoriesData)) return [];

        return courseCategoriesData
            ?.filter((category: any) => category?.language?.id === language_id)
            ?.map((category: any) => {
                return {
                    id: category?.id,
                    name: category?.name
                };
            });
    }, [courseCategoriesData, language_id]);

    const filterCategory = useMemo(() => {
        return !isEmptyArray(params?.course_categories) ? params?.course_categories : [];
    }, [params]);

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
                    : [category_id]
            });
        },
        [params, updatePagination]
    );

    const dashboardCoursesData = useMemo(() => {
        if (popularCoursesDataByCategoriesData && isEmptyArray(popularCoursesDataByCategoriesData))
            return [];

        return popularCoursesDataByCategoriesData?.map((course: any) => {
            const { id, course_categories, landing_pages } = course || {};
            const {
                title,
                course_image,
                language_id: course_language_id
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
                      currency: currentDefaultPrice?.currency?.name || 'USD'
                  }
                : {
                      price: 0,
                      currency: 'USD'
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
                    avatar: SERVER_URL + author_image
                },
                rating,
                originalPrice: actualPrice,
                price: formatCurrency(prices.price, prices.currency),
                redirectionUrl: `${domainRedirection}/${final_url}`
            };
        });
    }, [popularCoursesDataByCategoriesData]);

    const onPopupSuccess = useCallback(() => {
        const { pathname } = window.location;

        const queryString = new URLSearchParams(queryParams).toString();

        router.replace(`${pathname}?subscription=activated${queryString ? `&${queryString}` : ''}`);
        gtm.trial_activation.trial_side_banner();
    }, [router, queryParams]);

    const [startTrialSubmitForSideBanner, isStartTrialSubmitForSideBannerLoading] =
        useAsyncOperation(async () => {
            const { trial_days, stripe_price_id } = transformDataForTrialSideBanner;

            const purchasePayload = {
                userId: user?.id,
                language_id,
                trial_days,
                stripe_price_id,
                name: 'monthly subscription'
            };

            const response = await api.plan.purchasePlan({
                data: {
                    trial_activation_method: TRIAL_ACTIVATION_METHODS.SIDE_BANNER,
                    ...purchasePayload,
                    ...getSubscriptionPayload()
                }
            });

            if (response?.data?.data?.checkoutUrl) {
                window.open(response?.data?.data?.checkoutUrl, '_self');
                return;
            }

            const { token } = response?.data?.data || {};

            let registerUserData = {};

            if (token) {
                registerUserData = decodeToken(token);
                updateSocketOnLogin(token);
                setToken(token)
                dispatch(
                    updateUser({
                        activeUI: '',
                        ...user,
                        ...registerUserData
                    })
                );
            }

            if (country_code && user?.id && fetchUserData) {
                fetchUserData({
                    params: {
                        user_id: user?.id,
                        language: language_id,
                        domain: DOMAIN,
                        payment_status: 'paid'
                    },
                    headers: {
                        'req-from': country_code
                    }
                });
            }

            onPopupSuccess();
        });

    const courseModuleData = useMemo(() => {
        if (isEmptyArray(getUserCourseProgressData?.course_translations)) return [];
        return getUserCourseProgressData?.course_translations?.[0]?.course_modules;
    }, [getUserCourseProgressData]);

    const courseModuleAPICopyData = useMemo(() => {
        if (isEmptyArray(getUserCourseProgressApiDataForCopy?.course_translations)) return [];
        return getUserCourseProgressApiDataForCopy?.course_translations?.[0]?.course_modules;
    }, [getUserCourseProgressApiDataForCopy]);

    useEffect(() => {
        dispatch(fetchCategories({})).then(({ payload }: any) => {
            const { data } = payload || {};
            const trialBannerCategoryId = data?.result?.find(
                ({ slug }: any) => slug === POPUPS_CATEGORIES.trial_banner
            )?.id;

            if (trialBannerCategoryId && isEmptyObject(trialBannerPopupsData) && fetchTrialBannerPopupsData) {
                fetchTrialBannerPopupsData({
                    params: { popUps_category_id: trialBannerCategoryId }
                });
            }
        });
    }, [dispatch, fetchTrialBannerPopupsData, trialBannerPopupsData]);

    const handleModuleChange = useCallback(
        (moduleId: any) => (_: any, isExpanded: any) => {
            if (isExpanded) {
                setSelectedModuleId(moduleId);
            }
        },
        []
    );

        const handleVideoSelect = useCallback(
        (lessonObject: any) => {
            let updateCourseData = getUserCourseProgressData || {};
            let findFormattedTimeForSelectedLesson;
            const findFormattedTimeForSelectedLessonWatchTime =
                lessonObject?.user_watch_time_histories?.find(
                    (item: any) => item?.lesson_id === lessonObject?.id && item?.customer_id === user?.id
                )?.watch_time;

            const lessonLastReported = globalLastReportedTime.find(
                (item: any) => item.lesson_id === lessonObject?.id
            );

            if (lessonLastReported?.lessonLastWatchTime) {
                findFormattedTimeForSelectedLesson = moment
                    .utc(lessonLastReported.lessonLastWatchTime * 1000)
                    .format('HH:mm:ss');
            } else if (findFormattedTimeForSelectedLessonWatchTime) {
                findFormattedTimeForSelectedLesson = findFormattedTimeForSelectedLessonWatchTime;
            }

            updateCourseData = {
                ...getUserCourseProgressData,
                course_translations: [
                    {
                        ...getUserCourseProgressData?.course_translations?.[0],
                        course_modules:
                            getUserCourseProgressData?.course_translations?.[0]?.course_modules?.map(
                                (module: any) => {
                                    if (module.id === selectedModuleId) {
                                        return {
                                            ...module,
                                            lessions: module?.lessions?.map((lesson: any) => {
                                                if (lesson.id === lessonObject?.id) {
                                                    const findUserWatchLesson =
                                                        lesson?.user_watch_time_histories?.find(
                                                            (watchTimeHistory: any) =>
                                                                watchTimeHistory.customer_id ===
                                                                user?.id
                                                        );

                                                    let updatedWatchHistories = [
                                                        ...(lesson?.user_watch_time_histories || [])
                                                    ];
                                                    if (findUserWatchLesson) {
                                                        updatedWatchHistories =
                                                            updatedWatchHistories.map((history: any) =>
                                                                history.customer_id === user?.id
                                                                    ? {
                                                                          ...history,
                                                                          watch_time:
                                                                              findFormattedTimeForSelectedLesson
                                                                      }
                                                                    : history
                                                            );
                                                    } else {
                                                        updatedWatchHistories.push({
                                                            customer_id: user?.id,
                                                            watch_time:
                                                                findFormattedTimeForSelectedLesson,
                                                            created_at:
                                                                moment().format(
                                                                    'YYYY-MM-DD HH:mm:ss'
                                                                ),
                                                            course_id:
                                                                getUserCourseProgressData?.id,
                                                            lesson_id: lesson?.id,
                                                            is_started_to_watch: true,
                                                            is_completed:
                                                                lessonObject?.type === 'text'
                                                        });
                                                    }

                                                    return {
                                                        ...lesson,
                                                        user_watch_time_histories:
                                                            updatedWatchHistories
                                                    };
                                                }
                                                return lesson;
                                            })
                                        };
                                    }
                                    return module;
                                }
                            )
                    }
                ]
            };
            dispatch(updateCourseModuleLessonWatchTime(updateCourseData));

            const findSelectedLessonWatchTime = lessonObject?.user_watch_time_histories?.find(
                (watchTimeHistory: any) => watchTimeHistory.customer_id === user?.id
            )?.watch_time;

            const findSelectedLessonWatchTimeInSeconds = moment
                .duration(findSelectedLessonWatchTime)
                .asSeconds();

            const existingLessonIndex = globalLastReportedTime.findIndex(
                (item) => item.lesson_id === lessonObject?.id
            );

            if (existingLessonIndex >= 0) {
                globalLastReportedTime[existingLessonIndex].lessonLastWatchTime =
                    findSelectedLessonWatchTimeInSeconds;
            } else {
                globalLastReportedTime.push({
                    lesson_id: lessonObject?.id,
                    lessonLastWatchTime: findSelectedLessonWatchTimeInSeconds
                });
            }

            const isLessonCompleted = lessonObject?.user_watch_time_histories?.[0]?.is_completed;

            if (lessonObject?.type === 'text' && !isLessonCompleted) {
                const payload = {
                    course_id: getUserCourseProgressData?.id,
                    lesson_id: lessonObject?.id,
                    user_id: user?.id,
                    is_completed: true,
                    is_started_to_watch: true,
                    language_id: getUserCourseProgressApiDataForCopyCourseLanguageId
                };

                if (
                    socket &&
                    socket.connected &&
                    payload.course_id &&
                    payload.lesson_id &&
                    payload.user_id &&
                    payload.language_id
                ) {
                    socket.emit('text_progress', payload);
                }
            } else if (lessonObject?.type === 'video' && !isLessonCompleted) {
                const payload = {
                    course_id: getUserCourseProgressData?.id,
                    lesson_id: lessonObject?.id,
                    user_id: user?.id,
                    is_completed: false,
                    is_started_to_watch: true,
                    watch_time: moment.utc(0).format('HH:mm:ss'),
                    language_id: getUserCourseProgressApiDataForCopyCourseLanguageId
                };
                if (socket && socket.connected) {
                    socket.emit('video_progress', payload);
                }
            }

            setSelectedLesson(lessonObject);
        },
        [
            getUserCourseProgressData,
            dispatch,
            user?.id,
            selectedModuleId,
            getUserCourseProgressApiDataForCopyCourseLanguageId,
            socket
        ]
    );

    const isLastLesson = useMemo(() => {
        if (!selectedLesson || !courseModuleData || courseModuleData.length === 0) return true; // Default to true if data is missing

        const currentModuleIndex = courseModuleData.findIndex(
            (module: any) => module.id === selectedModuleId
        );
        if (currentModuleIndex === -1) return true;

        const currentModule = courseModuleData[currentModuleIndex];
        const currentLessonIndex = currentModule.lessions.findIndex(
            (lesson: any) => lesson.id === selectedLesson.id
        );
        if (currentLessonIndex === -1) return true;

        // Check if it's the last lesson in the current module
        const isLastInModule = currentLessonIndex === currentModule.lessions.length - 1;
        // Check if it's the last module
        const isLastModule = currentModuleIndex === courseModuleData.length - 1;

        return isLastInModule && isLastModule;
    }, [selectedLesson, selectedModuleId, courseModuleData]);

    const togglePipMode = useCallback(
        (mode: any) => {
            if (pipModeClosed) return;
            if (pipMode !== mode) {
                setPipMode(mode);
            }
        },
        [pipMode, pipModeClosed]
    );

    const closePipMode = useCallback(() => {
        setPipMode(false);
        setPipModeClosed(true);
    }, []);

    useEffect(() => {
        if (!videoContainerRef.current) return;

        const observerCallback = (entries: any) => {
            const entry = entries[0];

            if (!entry.isIntersecting) {
                if (!globalPipValue && !pipModeClosed) {
                    togglePipMode(true);
                }
            } else {
                if (globalPipValue) {
                    togglePipMode(false);
                }
            }
        };

        const observer = new IntersectionObserver(observerCallback, { threshold: 0.3 });
        observer.observe(videoContainerRef.current);

        return () => observer.disconnect();
    }, [togglePipMode, pipModeClosed]);

    useEffect(() => {
        return () => {
            setPipMode(false);
            setPipModeClosed(false);
            globalPipValue = false;
            globalLastReportedTime = [];
            dispatch(resetPagination());
        };
    }, [dispatch]);

    const setDefaultModuleLessonHandler = useCallback((data: any) => {
        const firstModule = data[0];
        setSelectedLesson(firstModule.lessions?.[0]);
        setSelectedModuleId(firstModule.id);
    }, []);

    useEffect(() => {
        if (courseModuleAPICopyData && courseModuleAPICopyData.length > 0) {
            setDefaultModuleLessonHandler(courseModuleAPICopyData);
        }
    }, [courseModuleAPICopyData, user, setDefaultModuleLessonHandler]);

    useEffect(() => {
        if (courseModuleData && courseModuleData.length > 0 && selectedLesson) {
            const isWatchHistory =
                courseModuleData[0]?.lessions[0]?.user_watch_time_histories?.length > 0;
            if (!isWatchHistory) {
                const updateCourseData = {
                    ...getUserCourseProgressData,
                    course_translations: [
                        {
                            ...getUserCourseProgressData?.course_translations?.[0],
                            course_modules:
                                getUserCourseProgressData?.course_translations?.[0]?.course_modules?.map(
                                    (module: any) => {
                                        if (module.id === selectedModuleId) {
                                            return {
                                                ...module,
                                                lessions: module?.lessions?.map((lesson: any) => {
                                                    if (lesson.id === selectedLesson?.id) {
                                                        const updatedWatchHistories = [
                                                            ...(lesson?.user_watch_time_histories ||
                                                                [])
                                                        ];
                                                        updatedWatchHistories.push({
                                                            customer_id: user?.id,
                                                            watch_time: moment
                                                                .utc(0)
                                                                .format('HH:mm:ss'),
                                                            created_at:
                                                                moment().format(
                                                                    'YYYY-MM-DD HH:mm:ss'
                                                                ),
                                                            course_id:
                                                                getUserCourseProgressData?.id,
                                                            lesson_id: lesson?.id,
                                                            is_started_to_watch: true,
                                                            is_completed: false
                                                        });

                                                        return {
                                                            ...lesson,
                                                            user_watch_time_histories:
                                                                updatedWatchHistories
                                                        };
                                                    }
                                                    return lesson;
                                                })
                                            };
                                        }
                                        return module;
                                    }
                                )
                        }
                    ]
                };

                dispatch(updateCourseModuleLessonWatchTime(updateCourseData));
                if (selectedLesson?.type === 'text') {
                    const payload = {
                        course_id: getUserCourseProgressData?.id,
                        lesson_id: selectedLesson?.id,
                        user_id: user?.id,
                        is_completed: true,
                        is_started_to_watch: true,
                        language_id: getUserCourseProgressApiDataForCopyCourseLanguageId
                    };

                    if (
                        socket &&
                        socket.connected &&
                        payload.course_id &&
                        payload.lesson_id &&
                        payload.user_id &&
                        payload.language_id
                    ) {
                        socket.emit('text_progress', payload);
                    }
                } else if (selectedLesson?.type === 'video') {
                    const payload = {
                        course_id: getUserCourseProgressData?.id,
                        lesson_id: selectedLesson?.id,
                        user_id: user?.id,
                        is_completed: false,
                        is_started_to_watch: true,
                        watch_time: moment.utc(0).format('HH:mm:ss'),
                        watch_time_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                        language_id: getUserCourseProgressApiDataForCopyCourseLanguageId
                    };
                    if (socket && socket.connected) {
                        socket.emit('video_progress', payload);
                    }
                }
            }
        }
    }, [
        courseModuleData,
        dispatch,
        getUserCourseProgressApiDataForCopyCourseLanguageId,
        getUserCourseProgressData,
        getUserCourseProgressData?.id,
        selectedLesson,
        selectedModuleId,
        socket,
        user?.id
    ]);

    const handleTimeUpdate = useCallback(
        (formattedTime: any, lesionId: any) => {
            const allLessons = getUserCourseProgressData.flatMap((module: any) => module.lessions);
            const currentLesson = allLessons?.find((item: any) => item?.id === lesionId);

            if (currentLesson?.user_watch_time_histories?.[0]?.is_completed) return;

            const currentTime = moment.duration(formattedTime).asSeconds();
            const currentLessonIndex = globalLastReportedTime.findIndex(
                (item) => item.lesson_id === lesionId
            );

            // If we have a record for this lesson
            const shouldReport =
                currentLessonIndex >= 0
                    ? currentTime -
                          globalLastReportedTime[currentLessonIndex].lessonLastWatchTime >=
                      5
                    : true; // Always report first time

            if (shouldReport) {
                // Update or add to globalLastReportedTime
                if (currentLessonIndex >= 0) {
                    globalLastReportedTime[currentLessonIndex].lessonLastWatchTime = currentTime;
                    globalLastReportedTime[currentLessonIndex].lastUpdated = Date.now();
                } else {
                    globalLastReportedTime.push({
                        lesson_id: lesionId,
                        lessonLastWatchTime: currentTime,
                        lastUpdated: Date.now()
                    });
                }

                const payload = {
                    course_id: getUserCourseProgressData?.id,
                    lesson_id: lesionId,
                    watch_time: formattedTime,
                    user_id: user?.id,
                    is_completed: false,
                    is_started_to_watch: true,
                    language_id: getUserCourseProgressApiDataForCopyCourseLanguageId
                };
                if (
                    socket &&
                    socket.connected &&
                    payload.course_id &&
                    payload.lesson_id &&
                    payload.user_id &&
                    payload.language_id
                ) {
                    socket.emit('video_progress', payload);
                }
            }
        },
        [
            getUserCourseProgressData,
            user?.id,
            getUserCourseProgressApiDataForCopyCourseLanguageId,
            socket
        ]
    );

    const handleContinueWatchingCourse = useCallback(async () => {
        await api.processToWatch.getProcessToWatch({
            params: {
                user_id: user?.id,
                course_id: getUserCourseProgressData?.id,
                language_id: language_id
            },
            data: {
                watch_time_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        });
    }, [getUserCourseProgressData?.id, language_id, user?.id]);

    useEffect(() => {
        if (
            getUserCourseProgressData?.id &&
            (isBecomeVerifiedAndSubscribed || isUserPurchasedCourse)
        ) {
            handleContinueWatchingCourse();
        }
    }, [
        getUserCourseProgressData?.id,
        handleContinueWatchingCourse,
        isBecomeVerifiedAndSubscribed,
        isUserPurchasedCourse
    ]);

        const playerStarted = useCallback(() => {
        const { description, title: label } =
            getUserCourseProgressApiDataForCopy?.course_translations?.[0] || {};

        gtm.mainflow.course_started({ label, description });
    }, [getUserCourseProgressApiDataForCopy]);

    const playerCompleted = useCallback(() => {
        const { description, title: label } =
            getUserCourseProgressApiDataForCopy?.course_translations?.[0] || {};

        gtm.mainflow.course_completed({ label, description });
    }, [getUserCourseProgressApiDataForCopy?.course_translations]);

    const handleIsCompleted = useCallback(
        (lessonObject: any) => {
            if (courseModuleData && courseModuleData.length > 0 && lessonObject) {
                const updateCourseData = {
                    ...getUserCourseProgressData,
                    course_translations: [
                        {
                            ...getUserCourseProgressData?.course_translations?.[0],
                            course_modules:
                                getUserCourseProgressData?.course_translations?.[0]?.course_modules?.map(
                                    (module: any) => {
                                        if (module.id == lessonObject.course_module_id) {
                                            return {
                                                ...module,
                                                lessions: module?.lessions?.map((lesson: any) => {
                                                    if (lesson.id === lessonObject?.id) {
                                                        const updatedWatchHistories = [
                                                            ...(lesson?.user_watch_time_histories ||
                                                                [])
                                                        ];
                                                        updatedWatchHistories.push({
                                                            customer_id: user?.id,
                                                            watch_time: moment
                                                                .utc(0)
                                                                .format('HH:mm:ss'),
                                                            created_at:
                                                                moment().format(
                                                                    'YYYY-MM-DD HH:mm:ss'
                                                                ),
                                                            course_id:
                                                                getUserCourseProgressData?.id,
                                                            lesson_id: lesson?.id,
                                                            is_started_to_watch: true,
                                                            is_completed: false
                                                        });

                                                        return {
                                                            ...lesson,
                                                            user_watch_time_histories:
                                                                updatedWatchHistories
                                                        };
                                                    }
                                                    return lesson;
                                                })
                                            };
                                        }
                                        return module;
                                    }
                                )
                        }
                    ]
                };

                dispatch(updateCourseModuleLessonWatchTime(updateCourseData));
                if (lessonObject?.type === 'text') {
                    const payload = {
                        course_id: getUserCourseProgressData?.id,
                        lesson_id: lessonObject?.id,
                        user_id: user?.id,
                        is_completed: true,
                        is_started_to_watch: true,
                        language_id: getUserCourseProgressApiDataForCopyCourseLanguageId
                    };

                    if (
                        socket &&
                        socket.connected &&
                        payload.course_id &&
                        payload.lesson_id &&
                        payload.user_id &&
                        payload.language_id
                    ) {
                        socket.emit('text_progress', payload);
                    }
                } else if (lessonObject?.type === 'video') {
                    const payload = {
                        course_id: getUserCourseProgressData?.id,
                        lesson_id: lessonObject?.id,
                        user_id: user?.id,
                        is_completed: false,
                        is_started_to_watch: true,
                        watch_time: moment.utc(0).format('HH:mm:ss'),
                        language_id: getUserCourseProgressApiDataForCopyCourseLanguageId
                    };
                    if (
                        socket &&
                        socket.connected &&
                        payload.course_id &&
                        payload.lesson_id &&
                        payload.user_id &&
                        payload.language_id
                    ) {
                        socket.emit('video_progress', payload);
                    }
                }
            }
        },
        [
            courseModuleData,
            dispatch,
            getUserCourseProgressApiDataForCopyCourseLanguageId,
            getUserCourseProgressData,
            socket,
            user?.id
        ]
    );

    const handleModuleWiseChangeCourse = useCallback(
        (modules = []) => {
            if (!selectedLesson || !selectedModuleId || isEmptyArray(modules)) return;

            // Find current module index using findIndex
            const currentModuleIndex = modules.findIndex(
                (module) => module.id === selectedModuleId
            );

            if (currentModuleIndex === -1) {
                console.error('Could not find current module');
                return; // Exit if current module not found
            }

            const currentModule = modules[currentModuleIndex];

            // Find current lesson index using findIndex
            const currentLessonIndex = currentModule.lessions.findIndex(
                (lesson: any) => lesson.id === selectedLesson.id
            );

            if (currentLessonIndex === -1) {
                console.error('Could not find current lesson within the module');
                return; // Exit if current lesson not found in its module
            }

            // Check for next lesson in the current module
            if (currentLessonIndex < currentModule.lessions.length - 1) {
                const nextLesson = currentModule.lessions[currentLessonIndex + 1];
                setSelectedLesson(nextLesson);
                handleIsCompleted(nextLesson);

                // console.log('Moving to next lesson in same module:', nextLesson.title);
            }
            // Check for next module
            else if (currentModuleIndex < modules.length - 1) {
                // Find the first lesson in the next module that is not empty
                let nextLesson = null;
                let nextModuleIndex = currentModuleIndex + 1;
                while (
                    nextModuleIndex < modules.length &&
                    isEmptyArray(modules[nextModuleIndex].lessions)
                ) {
                    nextModuleIndex++;
                }

                if (nextModuleIndex < modules.length) {
                    nextLesson = modules[nextModuleIndex].lessions[0];
                    setSelectedModuleId(modules[nextModuleIndex].id);
                    setSelectedLesson(nextLesson);
                    handleIsCompleted(nextLesson);
                } else {
                    // If all subsequent modules are empty, loop back to the beginning
                    const firstModule = modules[0];
                    if (!isEmptyArray(firstModule?.lessions)) {
                        const firstLesson = firstModule.lessions[0];
                        setSelectedModuleId(firstModule.id);
                        setSelectedLesson(firstLesson);
                        handleIsCompleted(nextLesson);
                    }
                }
            }
            // Last lesson of the last module - Loop back to the beginning
            else {
                const firstModule = modules[0];
                if (!isEmptyArray(firstModule?.lessions)) {
                    const firstLesson = firstModule.lessions[0];
                    setSelectedModuleId(firstModule.id);
                    setSelectedLesson(firstLesson);
                } else {
                    console.error('Cannot loop back: First module has no lessons.');
                }
            }
        },
        [handleIsCompleted, selectedLesson, selectedModuleId]
    );

    const handleNextLesson = useCallback(() => {
        if (!selectedLesson || !courseModuleData || courseModuleData.length === 0) return;
        const cloneCurrentLession = { ...selectedLesson };

        const isLessonCompleted = cloneCurrentLession?.user_watch_time_histories?.[0]?.is_completed;

        // socket event

        if (cloneCurrentLession?.type === 'text' && !isLessonCompleted) {
            const payload = {
                course_id: getUserCourseProgressData?.id,
                lesson_id: cloneCurrentLession?.id,
                user_id: user?.id,
                is_completed: true,
                is_started_to_watch: true,
                language_id: getUserCourseProgressApiDataForCopyCourseLanguageId
            };

            if (
                socket &&
                socket.connected &&
                payload.course_id &&
                payload.lesson_id &&
                payload.user_id &&
                payload.language_id
            ) {
                socket.emit('text_progress', payload);
            }
        }

        // Check if the current lesson is the last lesson in the module
        let updateCourseData = { ...getUserCourseProgressData };

        updateCourseData = {
            ...getUserCourseProgressData,
            course_translations: [
                {
                    ...getUserCourseProgressData?.course_translations?.[0],
                    course_modules:
                        getUserCourseProgressData?.course_translations?.[0]?.course_modules?.map(
                            (module: any) => {
                                if (module.id === selectedModuleId) {
                                    return {
                                        ...module,
                                        lessions: module?.lessions?.map((lesson: any) => {
                                            if (lesson.id === cloneCurrentLession?.id) {
                                                const findUserWatchLesson =
                                                    lesson?.user_watch_time_histories?.find(
                                                        (watchTimeHistory: any) =>
                                                            watchTimeHistory.customer_id ===
                                                            user?.id
                                                    );

                                                let updatedWatchHistories = [
                                                    ...(lesson?.user_watch_time_histories || [])
                                                ];

                                                if (findUserWatchLesson) {
                                                    updatedWatchHistories =
                                                        updatedWatchHistories.map((history) =>
                                                            history.customer_id === user?.id
                                                                ? {
                                                                      ...history,
                                                                      watch_time:
                                                                          cloneCurrentLession?.total_duration,
                                                                      is_started_to_watch: true,
                                                                      is_completed: true
                                                                  }
                                                                : { ...history }
                                                        );
                                                } else {
                                                    updatedWatchHistories.push({
                                                        customer_id: user?.id,
                                                        watch_time:
                                                            cloneCurrentLession?.total_duration,
                                                        created_at:
                                                            moment().format('YYYY-MM-DD HH:mm:ss'),
                                                        course_id: getUserCourseProgressData?.id,
                                                        lesson_id: lesson?.id,
                                                        is_started_to_watch: true,
                                                        is_completed: true
                                                    });
                                                }

                                                return {
                                                    ...lesson,
                                                    user_watch_time_histories: updatedWatchHistories
                                                };
                                            }
                                            return lesson;
                                        })
                                    };
                                }
                                return module;
                            }
                        )
                }
            ]
        };

        let updateCourseDataCourseModules =
            updateCourseData?.course_translations?.[0]?.course_modules || [];

        const findModuleIndex = updateCourseDataCourseModules.findIndex(
            (module: any) => module.id === selectedModuleId
        );

        const findLessonIndex = updateCourseDataCourseModules[findModuleIndex]?.lessions?.findIndex(
            (lesson: any) => lesson.id === selectedLesson?.id
        );

        updateCourseDataCourseModules = updateCourseDataCourseModules?.slice(
            findModuleIndex,
            updateCourseDataCourseModules?.length
        );

        updateCourseDataCourseModules = updateCourseDataCourseModules?.map((module: any) => {
            if (module?.id === selectedModuleId) {
                const updateSliceLessons = module?.lessions?.slice(
                    findLessonIndex,
                    module?.lessons?.length
                );

                return {
                    ...module,
                    lessions: updateSliceLessons
                };
            } else {
                return module;
            }
        });

        dispatch(updateWatchCourseModuleLesson(updateCourseData));

        handleModuleWiseChangeCourse(
            getUserCourseProgressApiDataForCopy?.course_translations?.[0]?.course_modules
        );
    }, [
        courseModuleData,
        dispatch,
        getUserCourseProgressApiDataForCopy?.course_translations,
        getUserCourseProgressApiDataForCopyCourseLanguageId,
        getUserCourseProgressData,
        handleModuleWiseChangeCourse,
        selectedLesson,
        selectedModuleId,
        socket,
        user?.id
    ]);

    const videoEnded = useCallback(() => {
        const cloneCurrentLession = { ...selectedLesson };

        const isLessonCompleted = cloneCurrentLession?.user_watch_time_histories?.[0]?.is_completed;

        if (cloneCurrentLession?.total_duration) {
            if (cloneCurrentLession?.type === 'video' && !isLessonCompleted) {
                const payload = {
                    course_id: getUserCourseProgressData?.id,
                    lesson_id: cloneCurrentLession?.id,
                    watch_time: cloneCurrentLession?.total_duration,
                    user_id: user?.id,
                    is_completed: true,
                    is_started_to_watch: true,
                    language_id: getUserCourseProgressApiDataForCopyCourseLanguageId
                };

                if (
                    socket &&
                    socket.connected &&
                    payload.course_id &&
                    payload.lesson_id &&
                    payload.user_id &&
                    payload.language_id
                ) {
                    socket.emit('video_progress', payload);
                }
            }

            let updateCourseData = getUserCourseProgressData || {};

            updateCourseData = {
                ...getUserCourseProgressData,
                course_translations: [
                    {
                        ...getUserCourseProgressData?.course_translations?.[0],
                        course_modules:
                            getUserCourseProgressData?.course_translations?.[0]?.course_modules?.map(
                                (module: any) => {
                                    if (module.id === selectedModuleId) {
                                        return {
                                            ...module,
                                            lessions: module?.lessions?.map((lesson: any) => {
                                                if (lesson.id === cloneCurrentLession?.id) {
                                                    const findUserWatchLesson =
                                                        lesson?.user_watch_time_histories?.find(
                                                            (watchTimeHistory: any) =>
                                                                watchTimeHistory.customer_id ===
                                                                user?.id
                                                        );

                                                    let updatedWatchHistories = [
                                                        ...(lesson?.user_watch_time_histories || [])
                                                    ];

                                                    if (findUserWatchLesson) {
                                                        updatedWatchHistories =
                                                            updatedWatchHistories.map((history) =>
                                                                history.customer_id === user?.id
                                                                    ? {
                                                                          ...history,
                                                                          watch_time:
                                                                              cloneCurrentLession?.total_duration,
                                                                          is_started_to_watch: true,
                                                                          is_completed: true
                                                                      }
                                                                    : history
                                                            );
                                                    } else {
                                                        updatedWatchHistories.push({
                                                            customer_id: user?.id,
                                                            watch_time:
                                                                cloneCurrentLession?.total_duration,
                                                            created_at:
                                                                moment().format(
                                                                    'YYYY-MM-DD HH:mm:ss'
                                                                ),
                                                            course_id:
                                                                getUserCourseProgressData?.id,
                                                            lesson_id: lesson?.id,
                                                            is_started_to_watch: true,
                                                            is_completed: true
                                                        });
                                                    }

                                                    return {
                                                        ...lesson,
                                                        user_watch_time_histories:
                                                            updatedWatchHistories
                                                    };
                                                }
                                                return lesson;
                                            })
                                        };
                                    }
                                    return module;
                                }
                            )
                    }
                ]
            };

            let updateCourseDataCourseModules =
                updateCourseData?.course_translations?.[0]?.course_modules || [];

            const findModuleIndex = updateCourseDataCourseModules.findIndex(
                (module: any) => module.id === selectedModuleId
            );

            const findLessonIndex = updateCourseDataCourseModules[
                findModuleIndex
            ]?.lessions?.findIndex((lesson: any) => lesson.id === selectedLesson?.id);

            updateCourseDataCourseModules = updateCourseDataCourseModules?.slice(
                findModuleIndex,
                updateCourseDataCourseModules?.length
            );

            updateCourseDataCourseModules = updateCourseDataCourseModules?.map((module: any) => {
                if (module?.id === selectedModuleId) {
                    const updateSliceLessons = module?.lessions?.slice(
                        findLessonIndex,
                        module?.lessons?.length
                    );

                    return {
                        ...module,
                        lessions: updateSliceLessons
                    };
                } else {
                    return module;
                }
            });

            dispatch(updateWatchCourseModuleLesson(updateCourseData));
            playerCompleted();
            handleModuleWiseChangeCourse(
                getUserCourseProgressApiDataForCopy?.course_translations?.[0]?.course_modules
            );
        }
    }, [
        selectedLesson,
        getUserCourseProgressData,
        user?.id,
        getUserCourseProgressApiDataForCopyCourseLanguageId,
        socket,
        dispatch,
        playerCompleted,
        handleModuleWiseChangeCourse,
        getUserCourseProgressApiDataForCopy?.course_translations,
        selectedModuleId
    ]);

    const handleChangeVideoAutoPlay = useCallback(() => {
        setVideoAutoplay((prev) => !prev);
    }, []);

    return {
        data: translation,
        loading: recommendedCoursesAPIDataLoading || getUserCourseProgressDataLoading,
        course: getUserCourseProgressApiDataForCopy || {},
        queryParams,
        dispatch,
        isMobile,
        LOGO_URL,
        BRAND_NAME,
        SUPPORT_MAIL,
        LEGAL_NAME,
        navigateHomePage,
        domainName,
        isBecomeAMemberWithVerified,
        trialPopupState,
        trialPopupOpen,
        trialPopupClose,
        handleStartFree,
        language_id,
        isSubscriptionActivated,
        isBecomeVerifiedAndSubscribed,
        isUserPurchasedCourse,
        recommendedCoursesData,
        recommendedCoursesDataLoading: recommendedCoursesAPIDataLoading,
        CATEGORIES_BADGE,
        COURSES_DATA: dashboardCoursesData,
        isCoursesDataLoading: popularCoursesDataByCategoriesDataLoading,
        filterCategory,
        filterCategoryHandler,
        transformDataForTrialSideBanner,
        startTrialSubmitForSideBanner,
        isStartTrialSubmitForSideBannerLoading,
        courseModuleData,
        selectedLesson,
        selectedModuleId,
        handleModuleChange,
        handleVideoSelect,
        videoContainerRef,
        pipMode,
        closePipMode,
        handleTimeUpdate,
        videoEnded,
        user,
        playerStarted,
        widgetScriptData,
        handleNextLesson,
        isLastLesson,
        shouldOfferTrials: shouldOfferTrial(user),
        videoAutoplay,
        handleChangeVideoAutoPlay
    };

}

export default useCourseDetails;
