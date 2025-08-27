import { useFormik } from 'formik';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { fetchUser } from '@/store/features/user.slice';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { api } from '@/api';
import {
  decodeToken,
  formatCurrency,
  getSubscriptionPayload,
  isEmptyArray,
  isEmptyObject,
  videoURL,
} from '@/utils/helper';
import {
  CANCEL_POPUPS_SUB_CATEGORIES,
  DOMAIN,
  POPUPS_CATEGORIES,
  SERVER_URL,
  TIMEZONE,
  TRIAL_ACTIVATION_METHODS,
  USER_ROLE,
} from '@/utils/constants';
import useAsyncOperation from '@/hooks/use-async-operation';
// import { gtm } from '../../assets/utils/gtm';
import { updateUser } from '@/store/features/auth.slice';
import useToggleState from '@/hooks/use-toggle-state';
import {
  fetchCancelDelayPopups,
  fetchManageBilling,
  fetchSubscriptionWithDiscount,
  fetchTrialBannerPopups,
} from '@/store/features/popup.slice';
import { useMediaQuery } from '@mui/material';
import { routes } from '@/utils/constants/routes';
import { AuthContext } from '@/context/auth-provider';
// import { pixel } from '../../assets/utils/pixel';
import useSocket from '@/hooks/use-socket';

const useSettingAndSubscription = ({
  language_id,
  country_code,
  user,
  domainDetails,
}: any) => {
  const { updateSocketOnLogin } = useSocket();
  const [fetchData] = useDispatchWithAbort(fetchUser);
  const { setToken } = useContext(AuthContext);
  const [fetchCancelDelayPopupsData] = useDispatchWithAbort(
    fetchCancelDelayPopups
  );
  const [fetchManageBillingData] = useDispatchWithAbort(fetchManageBilling);
  const [fetchSubscriptionWithDiscountData] = useDispatchWithAbort(
    fetchSubscriptionWithDiscount
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    cancelDelayPopups: {
      data: cancelDelayPopupsData,
      loading: cancelDelayPopupsDataLoading,
    },
    manageBilling: { data: manageBillingData },
    subscriptionWithDiscount: { data: subscriptionWithDiscountData },
  } = useSelector((state: any) => state.popup);

  const [image, setImage] = useState('');
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isImageUploadedLoading, setIsImageUploadedLoading] = useState(false);
  const [saveFeedBackFormData, setSaveFeedBackFormData] = useState({});
  const [resetCancelPopup, setResetCancelPopup] = useState(false);
  const [isFormUpdated, setIsFormUpdated] = useState(false);
  const { data: userData } = useSelector(({ user }: any) => user);

  const t = useTranslations();
  const dispatch = useDispatch();

  const [isSubscriptionLoader, setIsSubscriptionLoader] = useState(false);

  const { brand_name, email } = domainDetails?.data?.domain_detail || {};

  const [cancelDelayPopupState, cancelDelayPopupOpen, cancelDelayPopupClose] =
    useToggleState();
  const [cancelPopupsState, cancelPopupsOpen, cancelPopupsClose] =
    useToggleState();

  const {
    trialBannerPopups: { data: trialBannerPopupsData },
    categories,
  } = useSelector((state: any) => state.popup);
  const [fetchTrialBannerPopupsData] = useDispatchWithAbort(
    fetchTrialBannerPopups
  );

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const pathname = usePathname();

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


  const {
    errors,
    handleSubmit,
    values,
    touched,
    setValues,
    handleBlur,
    isSubmitting,
  } = useFormik({
    initialValues: {
      userImage: userData?.userImage || '',
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      email: userData?.email || '',
    },
    enableReinitialize: true,
    onSubmit: async formValues => updateUserProfile(formValues),
  });

  const updateUserProfile = useCallback(
    async (formValues: any) => {
      setIsImageUploadedLoading(true);
      let anyUpdateSuccessful = false;

      const { userImage, first_name, last_name } = formValues;

      // Task 1: Update Profile Image if a new one is uploaded
      if (isImageUploaded && userImage instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append('userImage', userImage);
        try {
          const imageResponse = await api.user.updateProfileImage({
            data: imageFormData,
            id: user?.id,
          });
          if (imageResponse.status === 200) {
            enqueueSnackbar(
              imageResponse?.data?.message || 'Image uploaded successfully.',
              { variant: 'success' }
            );
            setIsImageUploaded(false);
            anyUpdateSuccessful = true;
          } else {
            enqueueSnackbar(
              imageResponse?.data?.message || 'Image upload failed.',
              {
                variant: 'error',
              }
            );
          }
        } catch (error) {
          enqueueSnackbar(
            error instanceof Error ? error.message : 'Error uploading image.',
            { variant: 'error' }
          );
        }
      }

      // Task 2: Update First Name and Last Name if they have changed
      const originalFirstName = userData?.first_name || '';
      const originalLastName = userData?.last_name || '';
      const profileDetailsActuallyChanged =
        first_name !== originalFirstName || last_name !== originalLastName;

      if (profileDetailsActuallyChanged) {
        const profileData = { first_name, last_name };
        try {
          const profileResponse = await api.user.update({
            data: profileData,
            params: { user_id: user?.id },
          });
          if (profileResponse.status === 200) {
            enqueueSnackbar(
              profileResponse?.data?.message || 'Profile details updated.',
              { variant: 'success' }
            );
            anyUpdateSuccessful = true;
          } else {
            enqueueSnackbar(
              profileResponse?.data?.message || 'Profile update failed.',
              { variant: 'error' }
            );
          }
        } catch (error) {
          enqueueSnackbar(
            error instanceof Error ? error.message : 'Error updating profile.',
            { variant: 'error' }
          );
        }
      }

      if (anyUpdateSuccessful && fetchData) {
        fetchData({
          params: { user_id: user?.id },
          headers: {
            'req-from': country_code,
          },
        });
        setIsFormUpdated(false);
      }

      setIsImageUploadedLoading(false);
    },
    [
      user?.id,
      fetchData,
      isImageUploaded,
      setIsImageUploaded,
      setIsFormUpdated,
      userData,
      country_code,
    ]
  );

  console.log('user', user)

  useEffect(() => {
    if (user?.is_user_purchased_trial && fetchSubscriptionWithDiscountData) {
      fetchSubscriptionWithDiscountData({});
    }
  }, [fetchSubscriptionWithDiscountData, user?.is_user_purchased_trial]);

  const handleImageUpload = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl); // For display
      setValues({ ...values, userImage: file }); // Update Formik value with the File object
      setIsImageUploaded(true); // Indicate a new image is staged
      setIsFormUpdated(true); // Indicate form has been touched
    }
  };

  const actualProfileDetailsChanged =
    values.first_name !== (userData?.first_name || '') ||
    values.last_name !== (userData?.last_name || '');

  const canSaveChanges = isImageUploaded || actualProfileDetailsChanged;
  const handleChange = useCallback(
    (e: any) => {
      setValues({ ...values, [e.target.name]: e.target.value });
      setIsFormUpdated(true);
    },
    [setValues, values] // Keep 'values' here if setValues is used like this
  );

  const BRAND_NAME = useMemo(() => {
    return brand_name || '';
  }, [brand_name]);

  const SUPPORT_MAIL = useMemo(() => {
    return email || '';
  }, [email]);

  const purchasePayload = useMemo(
    () => ({
      userId: user?.id,
      language_id,
    }),
    [language_id, user?.id]
  );

  const transFormData = useMemo(() => {
    if (!userData && isEmptyObject(userData)) return null;

    const findActiveSubscription =
      userData?.subscription_purchase_histories?.find(
        (item: any, index: number, arr: any) => {
          const sortedList = [...arr].sort((a, b) =>
            moment(b.subscription_start_date).diff(
              moment(a.subscription_start_date)
            )
          );

          const latest = sortedList[0];

          // ✅ If latest is lifetime, return true immediately
          if (latest?.is_lifetime === true) {
            return item.id === latest.id; // Only match the latest one
          }

          // 🔁 Otherwise, use existing logic
          if (
            !item?.subscription_end_date &&
            !item?.next_payment_date &&
            item?.status === 'active'
          ) {
            return true;
          }

          if (!item?.subscription_end_date || item?.status !== 'active') {
            return false;
          }

          const now = moment().tz(TIMEZONE);
          const subEndDate = moment(item.subscription_end_date).tz(TIMEZONE);

          if (subEndDate.isAfter(now)) return true;

          if (subEndDate.isSame(now, 'day')) {
            return subEndDate.isAfter(now);
          }

          return false;
        }
      ) || {};

    const isSubscribed =
      !isEmptyArray(userData?.subscription_purchase_histories) &&
      !isEmptyObject(findActiveSubscription);
    const subscriptionPlanPrice =
      findActiveSubscription?.subscription_plan?.subscription_plan_prices?.[0];
    const amount = subscriptionPlanPrice?.amount || 0;
    const subscriptionPrice = formatCurrency(
      amount,
      subscriptionPlanPrice?.currency?.name || 'USD'
    );
    const findActiveSubscriptionPlanName = findActiveSubscription?.is_lifetime
      ? 'Lifetime subscription'
      : findActiveSubscription?.subscription_plan?.name;
    const next_payment_date = findActiveSubscription?.next_payment_date
      ? moment(findActiveSubscription?.next_payment_date).format(
          'MMMM D, YYYY, HH:mm'
        )
      : null;

    const subscription_start_date_after_24_hours =
      findActiveSubscription?.subscription_start_date
        ? momentTimezone(findActiveSubscription?.subscription_start_date)
            .tz(TIMEZONE)
            .add(1, 'days')
            .format('MMMM D, YYYY, HH:mm')
        : null;

    const subscription_start_date =
      findActiveSubscription?.subscription_start_date
        ? findActiveSubscription?.subscription_start_date
        : null;

    const utm_source =
      userData?.user_orders?.[0]?.payment_histories?.[0]?.utm_source || null;

    return {
      isSubscribed,
      subscriptionPrice,
      next_payment_date,
      subscription_start_date,
      subscription_start_date_after_24_hours,
      utm_source,
      findActiveSubscriptionPlanName,
      is_lifetime: findActiveSubscription?.is_lifetime,
    };
  }, [userData]);

  // is not there any subscription purchase history
  const isNotThereAnySubscription = isEmptyArray(
    userData?.subscription_purchase_histories
  );

  useEffect(() => {
    if (
      isBecomeAMemberWithVerified &&
      categories?.data?.length &&
      isNotThereAnySubscription
    ) {
      const trialBannerCategoryId = categories.data.find(
        ({ slug }: any) => slug === POPUPS_CATEGORIES.trial_banner
      )?.id;

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
    categories.data,
    trialBannerPopupsData,
    isBecomeAMemberWithVerified,
    fetchTrialBannerPopupsData,
    isNotThereAnySubscription,
  ]);

  const fetchLatestTokenAPI = useCallback(async () => {
    try {
      setIsSubscriptionLoader(true);
      const response = await api.token.getToken({
        params: {
          userId: user?.id || '',
        },
      });

      if (response?.data) {
        const token = response?.data?.data;
        const registerUserData = decodeToken(token);
        setToken(token);
        updateSocketOnLogin(token);
        dispatch(
          updateUser({
            activeUI: '',
            ...user,
            ...registerUserData,
          })
        );
      }
    } catch (error) {
      console.error('Error fetching token:', error);
    } finally {
      setIsSubscriptionLoader(false);
    }
  }, [user, setToken, updateSocketOnLogin, dispatch]);

  useEffect(() => {
    if (!userData?.subscription_purchase_histories?.length) {
      fetchLatestTokenAPI();
    }
  }, []);


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
        ({ language_id: languageId }: any) => languageId === language_id
      );

    return findActiveLanguageSubscriptionPlan;
  }, [findTrialBannerTopOfThePageData, language_id]);


  const transformTrialSubscriptionData = useMemo(() => {
    if (user?.is_user_purchased_trial) {
      if (isEmptyObject(subscriptionWithDiscountData)) return {};
    } else {
      if (isEmptyObject(findTrialBannerTopOfThePageData)) return {};
    }

    let object = {};

    if (user?.is_user_purchased_trial) {
      const { subscription_plan_prices, trial_days } =
        subscriptionWithDiscountData;
      const {
        amount: price,
        currency,
        stripe_price_id,
      } = subscription_plan_prices?.[0] || {};

      const currencyCode = currency?.name || 'USD';

      object = {
        trial_days,
        stripe_price_id,
        price: formatCurrency(price, currencyCode),
      };
    } else {
      const { subscription_plan, trial_days } = user?.is_user_purchased_trial
        ? subscriptionWithDiscountData
        : activeLanguageTrialBannerTopOfThePageSubscriptionPlan;
      const { subscription_plan_prices } = subscription_plan || {};
      const {
        amount: price,
        currency,
        stripe_price_id,
      } = subscription_plan_prices?.[0] || {};

      const currencyCode = currency?.name || 'USD';
      object = {
        trial_days,
        stripe_price_id,
        price: formatCurrency(price, currencyCode),
      };
    }
    return object;
  }, [
    activeLanguageTrialBannerTopOfThePageSubscriptionPlan,
    findTrialBannerTopOfThePageData,
    subscriptionWithDiscountData,
    user?.is_user_purchased_trial,
  ]);

  const onPopupSuccess = useCallback(() => {
    if (fetchData) {
      fetchData({
        params: { user_id: user?.id },
        headers: {
          'req-from': country_code,
        },
      });
    }

    const queryString = new URLSearchParams(searchParams).toString();

    router.replace(
      `${pathname}?subscription=activated${queryString ? `&${queryString}` : ''}`
    );

    // gtm.trial_activation.trial_account_settings();
  }, [fetchData, searchParams, router, pathname, user?.id, country_code]);

  const onPopupSuccessForCancelSubscription = useCallback(() => {
    if (fetchData) {
      fetchData({
        params: { user_id: user?.id },
        headers: { 'req-from': country_code },
      });
    }
    // gtm.cancel_subscription.cancel_subscription();
  }, [fetchData, user?.id, country_code]);

  const [handleSubscription, handleSubscriptionLoading] = useAsyncOperation(
    async () => {
      const { ...other } = purchasePayload;

      const payload = {
        // ...(!user?.is_user_purchased_trial && { is_trial: true }),
        name: user?.is_user_purchased_trial
          ? 'Subscription with discount'
          : 'monthly subscription',
        trial_activation_method: isNotThereAnySubscription
          ? TRIAL_ACTIVATION_METHODS.TOP_OF_THE_PAGE_BANNER
          : TRIAL_ACTIVATION_METHODS.SETTINGS_SUBSCRIPTION_PAGE,
        ...getSubscriptionPayload(),
        ...(!user?.is_user_purchased_trial && {
          trial_days:
            (transformTrialSubscriptionData as { trial_days?: any })
              ?.trial_days ?? 0,
        }),
        ...(!user?.is_user_purchased_trial && {
          stripe_price_id:
            (transformTrialSubscriptionData as { stripe_price_id?: string })
              ?.stripe_price_id ?? '',
        }),
        ...other,
      };

      const response = await api.plan.purchasePlan({
        data: { ...payload },
      });

      if (!response?.data?.data?.checkoutUrl) {
        if (fetchData) {
          fetchData({
            params: { user_id: user?.id },
            headers: {
              'req-from': country_code,
            },
          });
        }
      }

      if (response?.data?.data?.checkoutUrl) {
        window.open(response?.data?.data?.checkoutUrl, '_self');
        return;
      }

      const { token } = response?.data?.data || {};

      let registerUserData = {};

      if (token) {
        registerUserData = decodeToken(token);
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

      onPopupSuccess();
    }
  );

  const transformCancelDelayPopupData = useMemo(() => {
    if (!cancelDelayPopupsData && isEmptyArray(cancelDelayPopupsData))
      return {};

    const { subscription_start_date_after_24_hours }: any = transFormData;

    const findDomainCancelDelayPopupData =
      cancelDelayPopupsData?.find(
        (item: any) =>
          item?.domain?.name === DOMAIN && item?.language_id === language_id
      ) || {};

    const cancelDelayCourseData =
      findDomainCancelDelayPopupData?.cancel_delay_courses?.map(
        ({ course }: any) => {
          const { id, course_categories } = course || {};
          const {
            title,
            course_image,
            language_id: course_language_id,
          } = course?.course_translations?.[0] || {};
          const { author_image, rating, final_url } =
            course?.landing_pages?.[0]?.landing_page_translations?.[0] || {};
          const { name: domainRedirection } =
            findDomainCancelDelayPopupData?.domain || {};

          let prices: any,
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
        }
      ) || [];

    const status = findDomainCancelDelayPopupData?.status || null;

    let course_activation_message =
      findDomainCancelDelayPopupData?.course_activation_message || null;

    const topCourses =
      cancelDelayCourseData?.map?.((course: any) => course?.title) || [];

    const formattedCourses =
      topCourses.length > 1
        ? topCourses.slice(0, -1).join(', ') +
          ' and ' +
          topCourses[topCourses.length - 1]
        : topCourses[0] || '';

    if (course_activation_message) {
      course_activation_message = course_activation_message.replaceAll(
        '{COURSES}',
        `<b>${formattedCourses}</b>`
      );

      course_activation_message = course_activation_message.replaceAll(
        '{NEXT_SUBSCRIPTION_DATE}',
        subscription_start_date_after_24_hours
      );
    }

    let contact_support_message =
      findDomainCancelDelayPopupData?.contact_support_message || null;

    if (contact_support_message) {
      contact_support_message = contact_support_message.replaceAll(
        '{SUPPORT_MAIL}',
        `<a href="mailto:${SUPPORT_MAIL}" style="color: #782fef; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">${SUPPORT_MAIL}</a>`
      );
    }

    return {
      status,
      course_activation_message,
      contact_support_message,
      cancelDelayCourseData,
    };
  }, [SUPPORT_MAIL, cancelDelayPopupsData, language_id, transFormData]);

  const isCancelDelayPopupVisible = useMemo(() => {
    if (!transFormData || isEmptyObject(transFormData)) return false;
    if (
      !transformCancelDelayPopupData ||
      isEmptyObject(transformCancelDelayPopupData) ||
      !cancelDelayPopupsData ||
      isEmptyArray(cancelDelayPopupsData)
    )
      return false;

    const { subscription_start_date, utm_source } = transFormData || {};
    if (!subscription_start_date) return false;

    const currentTime = momentTimezone().tz(TIMEZONE);
    const subscriptionStartTime = momentTimezone(subscription_start_date).tz(
      TIMEZONE
    );

    // Calculate the difference in hours and minutes
    const hoursSinceSubscription = currentTime.diff(
      subscriptionStartTime,
      'hours'
    );
    const minutesSinceSubscription =
      currentTime.diff(subscriptionStartTime, 'minutes') % 60;

    // Check if within 24 hours (24 hours = 1440 minutes)
    const totalMinutes = hoursSinceSubscription * 60 + minutesSinceSubscription;
    const isWithin24Hours = totalMinutes >= 0 && totalMinutes <= 1440;

    return (
      isWithin24Hours &&
      transformCancelDelayPopupData?.status === 'on' &&
      utm_source
    );
  }, [transformCancelDelayPopupData, cancelDelayPopupsData, transFormData]);

  const [handleManageBilling, manageBillingBtnLoading] = useAsyncOperation(
    async () => {
      if (!manageBillingData || isEmptyObject(manageBillingData)) return;
      const { portalUrl } = manageBillingData || {};
      if (portalUrl) {
        window.open(portalUrl, '_blank', 'noopener,noreferrer');
      }
    }
  );

  const cancelDelayBtnDisabled = useMemo(() => {
    if (!user && !isEmptyObject(user)) return true;
    return user?.is_cancellation_request;
  }, [user]);

  const isSubscriptionActivated = useMemo(() => {
    return (
      searchParams?.get('subscription') === 'activated' ||
      searchParams?.get('payment') === 'success'
    );
  }, [searchParams]);

  const [onCancelPopupCancel, onCancelPopupCancelLoading] = useAsyncOperation(
    async () => {
      const { feedback, description }: any = saveFeedBackFormData || {};
      await api.plan.cancelSubscription({
        data: {
          userId: user?.id,
          ...((feedback || description) && {
            reason: feedback || '',
            description: description || '',
          }),
        },
      });

      dispatch(
        updateUser({
          activeUI: '',
          ...user,
          is_cancellation_request: true,
        })
      );

      cancelPopupsClose();
      onPopupSuccessForCancelSubscription();
      setResetCancelPopup(true);
      // gtm.ecommerce.no_trial();
    }
  );

  const onCancelPopupSuccess = useCallback(
    (slug: any) => {
      cancelPopupsClose();
      if (slug) {
        switch (slug) {
          case CANCEL_POPUPS_SUB_CATEGORIES.extendTrial:
            // gtm.trial_activation.extended_trial_popup();
            break;
          case CANCEL_POPUPS_SUB_CATEGORIES.discountMain:
          case CANCEL_POPUPS_SUB_CATEGORIES.discountSecondary:
            // gtm.trial_activation.discount_popup();
            break;
          case CANCEL_POPUPS_SUB_CATEGORIES.lifetimeAccess:
            // gtm.ecommerce.trial_activated();
            break;
          default:
            break;
        }
      }

      onPopupSuccessForCancelSubscription();
      // pixel.start_trial({
      //     ...(user?.id ? { userId: user?.id } : {}),
      // });
    },
    [cancelPopupsClose, onPopupSuccessForCancelSubscription]
  );

  const [handleCancelPopupWarningSuccess] = useAsyncOperation(async () => {
    await api.plan.cancelSubscription({
      data: {
        userId: user?.id,
        is_cancel_immediately: true,
      },
    });

    const { trial_days, ...other }: any = purchasePayload || {};

    const response = await api.plan.purchasePlan({
      data: {
        ...(!user?.is_user_purchased_trial && { is_trial: true }),
        name: user?.is_user_purchased_trial
          ? 'Subscription with discount'
          : 'Free access',
        trial_activation_method: TRIAL_ACTIVATION_METHODS.CANCEL_WARNING_POPUP,
        ...other,
        ...getSubscriptionPayload(),
        ...(!user?.is_user_purchased_trial && { trial_days }),
      },
    });

    if (response?.data?.data?.checkoutUrl) {
      window.open(response?.data?.data?.checkoutUrl, '_self');
      return;
    } else {
      const { token } = response?.data?.data || {};

      let registerUserData = {};

      if (token) {
        registerUserData = decodeToken(token);
        updateSocketOnLogin(token);
        setToken(token);
        dispatch(
          updateUser({
            activeUI: '',
            ...user,
            ...registerUserData,
            is_cancellation_request: false,
          })
        );
      }

      cancelPopupsClose();
      onPopupSuccessForCancelSubscription();
      // gtm.trial_activation.warning_popup();
    }
  });

  const handleSaveFeedbackFormData = useCallback((values: any) => {
    if (!isEmptyObject(values)) {
      setSaveFeedBackFormData(values);
    }
  }, []);

  const [onSubmit, cancelDelayBtnLoading] = useAsyncOperation(async () => {
    if (isCancelDelayPopupVisible) {
      cancelDelayPopupOpen(true);
    } else {
      cancelPopupsOpen();
    }
  });

  useEffect(() => {
    const { origin } = window.location;
    if (fetchData) {
      fetchData({
        params: { user_id: user?.id },
        headers: { 'req-from': country_code },
      });
    }
    if (fetchManageBillingData) {
      fetchManageBillingData({
        id: user?.id,
        data: {
          return_url: `${origin}${routes.private.settings_and_subscription}`,
        },
      });
    }
  }, [fetchData, user?.id, fetchManageBillingData, country_code]);

  useEffect(() => {
    if (userData?.id) {
      const { first_name, last_name, email, profile_image } = userData;
      const initialFormValues = {
        first_name: first_name || '',
        last_name: last_name || '',
        email,
        userImage: profile_image ? videoURL(profile_image) : '',
      };
      setValues(initialFormValues);
      if (profile_image) {
        setImage(videoURL(profile_image));
      }
      setIsFormUpdated(false);
      dispatch(
        updateUser({
          activeUI: '',
          ...user,
          ...userData,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValues, dispatch, userData]);

  useEffect(() => {
    if (fetchCancelDelayPopupsData) {
      fetchCancelDelayPopupsData({
        params: { language_id, domain: DOMAIN },
      });
    }
  }, [fetchCancelDelayPopupsData, language_id]);

  const userSettingsFormData = useMemo(
    () => [
      {
        id: 'first_name',
        name: 'first_name',
        label: t('first_name'),
        value: values.first_name,
        placeholder: t('enter_first_name'),
        handleChange,
        onBlur: handleBlur,
        error: touched.first_name && errors.first_name,
        type: 'text',
        helperText: t('visible_when_you_post_comments_on_courses'),
        sx: { xs: 12, sm: 6 },
        disabled: false,
      },
      {
        id: 'last_name',
        name: 'last_name',
        label: t('last_name'),
        value: values.last_name,
        placeholder: t('enter_last_name'),
        handleChange,
        onBlur: handleBlur,
        error: touched.last_name && errors.last_name,
        type: 'text',
        sx: { xs: 12, sm: 6 },
        disabled: false,
      },
      {
        id: 'email',
        name: 'email',
        value: values.email,
        placeholder: t('enter_your_email'),
        handleChange,
        onBlur: handleBlur,
        error: touched.email && errors.email,
        label: t('email'),
        type: 'email',
        helperText: t('used_to_manage_your_stripe_account'),
        sx: { xs: 12 },
        disabled: true,
      },
    ],
    [t, values, handleChange, handleBlur, touched, errors]
  );

  return {
    userSettingsFormData,
    handleSubmit,
    errors,
    values,
    touched,
    setValues,
    image,
    handleImageUpload,
    isImageUploaded,
    userData,
    BRAND_NAME,
    transFormData,
    handleSubscription,
    handleSubscriptionLoading,
    isImageUploadedLoading,
    cancelDelayPopupState,
    cancelDelayPopupOpen,
    cancelDelayPopupClose,
    transformCancelDelayPopupData,
    isMobile,
    isBecomeAMemberWithVerified,
    cancelDelayPopupsDataLoading,
    cancelDelayBtnLoading,
    isCancelDelayPopupVisible,
    handleManageBilling,
    manageBillingBtnLoading,
    cancelDelayBtnDisabled,
    isSubscriptionActivated,
    cancelPopupsState,
    cancelPopupsOpen,
    cancelPopupsClose,
    onCancelPopupCancel,
    onCancelPopupSuccess,
    handleCancelPopupWarningSuccess,
    handleSaveFeedbackFormData,
    saveFeedBackFormData,
    onSubmit,
    resetCancelPopup,
    setResetCancelPopup,
    onCancelPopupCancelLoading,
    isFormUpdated,
    setIsFormUpdated,
    canSaveChanges,
    isSubmitting,
    transformTrialSubscriptionData,
    isSubscriptionLoader,
  };
};

export default useSettingAndSubscription;
