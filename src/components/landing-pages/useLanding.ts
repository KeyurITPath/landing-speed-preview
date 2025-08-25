'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import momentTimezone from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
  DOMAIN,
  LANDING_PAGE,
  POPUPS_CATEGORIES,
  SERVER_URL,
  TIMEZONE,
  USER_ROLE,
} from '@utils/constants';
import {
  decodeToken,
  getVideoType,
  isEmptyArray,
  isEmptyObject,
  isHLS,
  videoURL,
} from '@utils/helper';
import {
  fetchAllFbAnalyticsCredentials,
  fetchAllAnalyticsCredentials,
  setCourse,
  setCurrency,
  setLanguage,
  resetCourse,
} from '@/store/features/defaults.slice';
import { routes } from '@/utils/constants/routes';
import useToggleState from '@/hooks/use-toggle-state';
import { fetchUser } from '@/store/features/user.slice';
import {
  fetchCategories,
  fetchTrialPopups,
} from '@/store/features/popup.slice';
import { api } from '@/api';
import { updateUser } from '@/store/features/auth.slice';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchAllUpSales } from '@/store/features/course.slice';
// useSocket

let globalPipValue = false;

const useLanding = ({ activeLandingPage, ...otherData }: any) => {

  const [fetchAllUpSalesData] = useDispatchWithAbort(fetchAllUpSales);
  const [fetchAllAnalyticsCredentialsData] = useDispatchWithAbort(
    fetchAllAnalyticsCredentials
  );
  const [fetchAllFbAnalyticsCredentialsData] = useDispatchWithAbort(
    fetchAllFbAnalyticsCredentials
  );
  const [fetchUserData] = useDispatchWithAbort(fetchUser);
  const [fetchCategoriesData] = useDispatchWithAbort(fetchCategories);
  const [fetchTrialPopupsData] = useDispatchWithAbort(fetchTrialPopups);

  // Add this ref to track if pixel view has been triggered
  const pixelViewTriggered = useRef(false);
  const params = useParams();
  const queryParams = useSearchParams();

  const landingUrl = Array.isArray(params.landing_url) ? params.landing_url[0] : params.landing_url;

  const dispatch = useDispatch();
  const router = useRouter();

  const [trialPopupState, trialPopupOpen, trialPopupClose] = useToggleState();

  const { user } = useSelector(({ auth }: any) => auth);
  const videoContainerRef = useRef(null);

  const domainDetails = otherData?.domainDetails || {};
  const country = otherData?.country || {};
  const languagesData = otherData?.languages || [];

  const {
    course: {
      analyticsMetaCredentials,
      isAnalyticsCredentialsExists,
      isFbAnalyticsCredentialsAPICalled,
      isTiktokAnalyticsCredentialsAPICalled,
    },
  } = useSelector(({ defaults }: any) => defaults);

  const {
    trialPopups: { data: trialPopupsData },
    categories,
  } = useSelector(({ popup }: any) => popup);

  const hasFetchedToken = useRef(false);

  const { logo, email, legal_name, brand_name } =
    domainDetails?.domain_detail || {};
  const { name: domainName } = domainDetails || {};

  const { data: userData } = useSelector(({ user }: any) => user);

  const { getAccessState } = useSelector(({ course }: any) => course);

  const pixelIds = useMemo(() => {
    return analyticsMetaCredentials && analyticsMetaCredentials?.length
      ? analyticsMetaCredentials?.map((item: any) => item.meta_pixel_id)
      : [];
  }, [analyticsMetaCredentials]);

  const [pipMode, setPipMode] = useState(false);
  const [pipModeClosed, setPipModeClosed] = useState(false);
  const [activeForm, setActiveForm] = useState('access-form');

  useEffect(() => {
    dispatch(resetCourse());
    return () => {
      setPipMode(false);
      setPipModeClosed(false);
      setActiveForm('access-form');
      globalPipValue = false;
    };
  }, [dispatch]);

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

  const currentTime = momentTimezone().tz(TIMEZONE);

  const fetchSubscribedToken = useCallback(async () => {
    const response = await api.token.getToken({
      params: {
        userId: user?.id,
      },
    });
    if (response?.data) {
      const token = response?.data?.data;
      const registerUserData = decodeToken(token);
      // updateSocketOnLogin(token);
      dispatch(
        updateUser({
          activeUI: '',
          ...user,
          ...registerUserData,
        })
      );
    }
  }, [dispatch, user]);

  const subscriptionEndDate = user?.subscription_end_date
    ? momentTimezone(user?.subscription_end_date).tz(TIMEZONE)
    : null;

  const isBecomeAMemberWithVerified = useMemo(() => {
    if (!user) return false;

    if (
      ![USER_ROLE.CUSTOMER, USER_ROLE.AUTHOR].includes(user.role) ||
      !user.is_verified
    ) {
      return false;
    }

    const isNotSubscribed = !user?.is_subscribed;
    const isSubscriptionExpired =
      subscriptionEndDate && !subscriptionEndDate.isAfter(currentTime);

    return isNotSubscribed || isSubscriptionExpired;
  }, [currentTime, subscriptionEndDate, user]);

  const isBecomeVerifiedAndSubscribed = useMemo(() => {
    if (!user) return false;

    if (
      ![USER_ROLE.CUSTOMER, USER_ROLE.AUTHOR].includes(user.role) ||
      !user.is_verified
    ) {
      return false;
    }

    const isSubscribed = !!user?.is_subscribed;
    const isSubscriptionActive = subscriptionEndDate?.isAfter(currentTime);

    return (isSubscribed && isSubscriptionActive) || user.is_lifetime === true;
  }, [currentTime, subscriptionEndDate, user]);

  const isUserPurchasedCourse = useMemo(() => {
    if (!otherData?.course?.id || !userData?.user_orders) return false;
    const landingCourseId = otherData?.course?.id;

    return userData?.user_orders?.some((order: any) =>
      order?.user_order_details?.some(
        (detail: any) => detail?.course_id === landingCourseId
      )
    );
  }, [otherData, userData]);

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));
  const isVisibleBuyBtn = useMediaQuery(theme => theme.breakpoints.down('sm'));

  globalPipValue = pipMode;

  useEffect(() => {
    if (
      !hasFetchedToken.current &&
      user?.token &&
      user?.role &&
      (!user?.is_subscribed || user?.is_verified)
    ) {
      hasFetchedToken.current = true; // prevent further calls
      fetchSubscribedToken();
    }
  }, [user, fetchSubscribedToken]);

  const togglePipMode = useCallback(
    (mode: any) => {
      if (pipModeClosed) return;
      if (pipMode !== mode) {
        setPipMode(mode);
      }
    },
    [pipMode, pipModeClosed]
  );

  useEffect(() => {
    if (user?.id && country?.country_code && fetchUserData) {
      fetchUserData({
        params: {
          user_id: user?.id,
          language: otherData?.data?.language_id,
          domain: DOMAIN,
          payment_status: 'paid',
        },
        headers: {
          'req-from': country?.country_code,
        },
      });
    }
  }, [
    country?.country_code,
    fetchUserData,
    otherData?.data?.language_id,
    user?.id,
  ]);

  useEffect(() => {
    if (otherData?.data) {
      const course = otherData?.course || {};
      const { id, course_prices } = course || {};
      const landing_page_translation_id = otherData?.data?.id;

      const currency =
        course_prices?.find(({ isDefault }: any) => isDefault)?.currency ||
        course_prices?.[0]?.currency ||
        {};

      if (fetchAllAnalyticsCredentialsData) {
        fetchAllAnalyticsCredentialsData({
          params: {
            landing_page_translation_id: landing_page_translation_id,
            currency: currency,
          },
        });
      }

      if (fetchAllFbAnalyticsCredentialsData) {
        fetchAllFbAnalyticsCredentialsData({
          params: {
            landing_page_translation_id: landing_page_translation_id,
          },
        });
      }

      if (fetchAllUpSalesData) {
        fetchAllUpSalesData({
          params: {
            course_id: course?.id,
            currency_id: currency?.id,
            language_id: otherData?.data?.language_id,
          },
        });
      }

      dispatch(
        setCourse({
          id,
          slug: landingUrl || '',
          course_title: otherData?.data?.header,
          landing_page:
            LANDING_PAGE[activeLandingPage as keyof typeof LANDING_PAGE],
        })
      );
      dispatch(setCurrency({ id: currency?.id, code: currency?.name }));
      dispatch(setLanguage({ id: otherData?.data?.language_id }));
    }

    // if (!isEmptyArray(languagesData)) {
    //             const selectedLanguage = languagesData?.find(
    //                 (lang) => lang.id === landing?.language_id
    //             );
    //             i18n.changeLanguage(selectedLanguage?.code);
    //         }
  }, [activeLandingPage, dispatch, fetchAllAnalyticsCredentialsData, fetchAllFbAnalyticsCredentialsData, fetchAllUpSalesData, landingUrl, otherData?.course, otherData?.data, queryParams]);

  const utmData = useMemo(() => {
    const params = queryParams;
    return {
      ...(params?.get('fbclid') ? { fbclid: params?.get('fbclid') } : {}),
      ...(params?.get('gclid') ? { gclid: params?.get('gclid') } : {}),
      ...(params?.get('ttclid') ? { ttclid: params?.get('ttclid') } : {}),
      ...(params?.get('utm_term') ? { utm_term: params?.get('utm_term') } : {}),
      ...(params?.get('utm_source')
        ? { utm_source: params?.get('utm_source') }
        : {}),
      ...(params?.get('utm_medium')
        ? { utm_medium: params?.get('utm_medium') }
        : {}),
      ...(params?.get('utm_campaign')
        ? { utm_campaign: params?.get('utm_campaign') }
        : {}),
      ...(params?.get('utm_content')
        ? { utm_content: params?.get('utm_content') }
        : {}),
    };
  }, [queryParams]);

  // Replace the problematic useEffect with this updated version
  // useEffect(() => {
  //     if (
  //         !pixelViewTriggered.current &&
  //         isFbAnalyticsCredentialsAPICalled &&
  //         isTiktokAnalyticsCredentialsAPICalled &&
  //         (pixelIds?.length || isAnalyticsCredentialsExists) &&
  //         data?.id
  //     ) {
  //         pixel.view_content({
  //             landingMetaPixelId: pixelIds,
  //             isAnalyticsCredentialsExists: isAnalyticsCredentialsExists,
  //             ...(!isEmptyObject(utmData) && { utmData }),
  //             ...(user?.id ? { userId: user.id } : {})
  //         });
  //         pixelViewTriggered.current = true;
  //     } else {
  //         clearMetaPixelHandler();
  //     }
  // }, [
  //     pixelIds,
  //     isAnalyticsCredentialsExists,
  //     isFbAnalyticsCredentialsAPICalled,
  //     isTiktokAnalyticsCredentialsAPICalled,
  //     data?.id,
  //     utmData,
  //     user.id
  // ]);

  const translation = otherData?.data || {};

  useEffect(() => {
    if (translation?.id) {
      setTimeout(() => {
        if (!videoContainerRef.current) return;
        const observerCallback = (entries: any) => {
          const entry = entries[0];
          if (!entry.isIntersecting) {
            if (!globalPipValue && activeLandingPage === 'landing2') {
              togglePipMode(true);
            }
          } else {
            if (globalPipValue) {
              togglePipMode(false);
            }
          }
        };

        const observer = new IntersectionObserver(observerCallback, {
          threshold: 0.5,
        });
        observer.observe(videoContainerRef.current);

        return () => observer.disconnect();
      }, 0);
    }
  }, [activeLandingPage, togglePipMode, translation?.id]);

  const videoPlayerOptions = useMemo(() => {
    if (!isEmptyObject(translation)) {
      const data = translation || {};
      const mainOptions = {
        controls: true,
        responsive: true,
        fluid: true,
        autoSetup: true,
        bigPlayButton: false,
        enableDocumentPictureInPicture: false,
        preload: 'auto',
        disablePictureInPicture: false,
        loop: true,
        muted: true,
        sources: [
          {
            src: videoURL(data?.intro) || '',
            type: getVideoType(data?.intro ? SERVER_URL + data?.intro : ''),
          },
        ],
        ...(isHLS(data?.intro) && {
          html5: {
            vhs: {
              enableLowInitialPlaylist: true, // prioritize fast start
              overrideNative: true, // ensure VHS is used even on Safari
            },
          },
        }),
        controlBar: {
          pictureInPictureToggle: false,
          skipButtons: {
            forward: 5,
            backward: 5,
          },
        },
        poster: data?.intro_thumbnail ? videoURL(data?.intro_thumbnail) : '',
      };

      const pipModeOptions = {
        controls: false,
        responsive: true,
        fluid: true,
        preload: 'auto',
        autoSetup: true,
        bigPlayButton: false,
        disablePictureInPicture: false,
        enableDocumentPictureInPicture: false,
        loop: true,
        muted: true,
        controlBar: {
          pictureInPictureToggle: false,
        },
        ...(isHLS(data?.intro) && {
          html5: {
            vhs: {
              enableLowInitialPlaylist: true, // prioritize fast start
              overrideNative: true, // ensure VHS is used even on Safari
            },
          },
        }),
        sources: [
          {
            src: data?.intro ? videoURL(data?.intro) : '',
            type: 'video/mp4',
          },
        ],
        poster: data?.intro_thumbnail ? videoURL(data?.intro_thumbnail) : '',
      };

      const options = pipMode ? pipModeOptions : mainOptions;
      return options;
    }

    return null;
  }, [pipMode, translation]);

  const closePipMode = useCallback(() => {
    setPipMode(false);
    setPipModeClosed(true);
  }, []);

  //   const metaTagDetails = useMemo(() => {
  //     if (translation) {
  //         const data = translation || {};
  //         return {
  //             title: data?.header,
  //             description: data?.description
  //         };
  //     }
  //     return {};
  // }, [translation]);

  // useEffect(() => {
  //     if (loading) {
  //         document.title = BRAND_NAME ? BRAND_NAME : 'Loading...';
  //         let metaDescription = document.querySelector('meta[name="description"]');
  //         if (!metaDescription) {
  //             metaDescription = document.createElement('meta');
  //             metaDescription.name = 'description';
  //             document.head.appendChild(metaDescription);
  //         }
  //         metaDescription.content = 'Please wait while we load the content.';
  //     } else {
  //         if (metaTagDetails.title) {
  //             document.title = metaTagDetails.title;
  //         }

  //         if (metaTagDetails.description) {
  //             let metaDescription = document.querySelector('meta[name="description"]');
  //             if (!metaDescription) {
  //                 metaDescription = document.createElement('meta');
  //                 metaDescription.name = 'description';
  //                 document.head.appendChild(metaDescription);
  //             }
  //             metaDescription.content = metaTagDetails.description;
  //         }
  //     }
  // }, [loading, metaTagDetails, BRAND_NAME]);

  useEffect(() => {
    const footer = document.getElementById('footer');
    if (!footer || !activeLandingPage) return;

    let marginBottom = '';

    if (['landing1', 'landing2'].includes(activeLandingPage)) {
      marginBottom = isVisibleBuyBtn ? '80px' : '64px';
    } else if (activeLandingPage === 'landing3') {
      marginBottom = isVisibleBuyBtn ? '80px' : '0px';
    }

    if (marginBottom) {
      footer.style.marginBottom = marginBottom;
    }
  }, [isVisibleBuyBtn, activeLandingPage]);

  useEffect(() => {
    if (
      isBecomeAMemberWithVerified &&
      activeLandingPage === 'landing3' &&
      fetchCategoriesData
    ) {
      fetchCategoriesData({});
    }
  }, [fetchCategoriesData, activeLandingPage, isBecomeAMemberWithVerified]);

  useEffect(() => {
    if (
      isBecomeAMemberWithVerified &&
      categories?.data?.length &&
      activeLandingPage === 'landing3'
    ) {
      const trialPopupsCategoryId = categories.data.find(
        ({ slug }: any) => slug === POPUPS_CATEGORIES.trial_popups
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
    }
  }, [
    activeLandingPage,
    categories.data,
    fetchTrialPopupsData,
    isBecomeAMemberWithVerified,
    trialPopupsData,
  ]);

  const isPaymentSuccess = useMemo(() => {
    return queryParams?.get('payment') === 'success';
  }, [queryParams]);

  const isPaymentFailed = useMemo(() => {
    return queryParams?.get('payment') === 'failed';
  }, [queryParams]);

  const isSubscriptionActivated = useMemo(() => {
    return (
      queryParams?.get('subscription') === 'activated' ||
      queryParams?.get('payment') === 'success'
    );
  }, [queryParams]);

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

  const handleProceedToWatch = useCallback(() => {
    const landingUrl = Array.isArray(params.landing_url) ? params.landing_url[0] : params.landing_url;
    const URL = routes.private.course_details.replace(':slug', landingUrl || '');
    router.push(URL);
  }, [params.landing_url, router]);

  return {
    videoContainerRef,
        videoPlayerOptions,
        pipMode,
        closePipMode,
        queryParams,
        activeForm,
        setActiveForm,
        getAccessState,
        dispatch,
        isMobile,
        activeLandingPage,
        isVisibleBuyBtn,
        isPaymentSuccess,
        isPaymentFailed,
        LOGO_URL,
        BRAND_NAME,
        SUPPORT_MAIL,
        LEGAL_NAME,
        domainName,
        isBecomeAMemberWithVerified,
        trialPopupState,
        trialPopupOpen,
        trialPopupClose,
        handleStartFree,
        language_id: otherData?.data?.language_id,
        isSubscriptionActivated,
        isBecomeVerifiedAndSubscribed,
        isUserPurchasedCourse,
        handleProceedToWatch,
        utmData
  };
};

export default useLanding;
