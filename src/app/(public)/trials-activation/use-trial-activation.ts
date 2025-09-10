'use client';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import useToggleState from '@/hooks/use-toggle-state';
import { AuthContext } from '@/context/auth-provider';
import { routes } from '@/utils/constants/routes';
import { api } from '@/api';
import useAsyncOperation from '@/hooks/use-async-operation';
import {
  SALES_POPUPS_SUB_CATEGORIES,
  SERVER_URL,
  TRIAL_ACTIVATION_METHODS,
} from '@/utils/constants';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchFreeTrialPopups } from '@/store/features/popup.slice';
import { fetchTrialActivation } from '@/store/features/trials-activation.slice';
import {
  decodeToken,
  getSubscriptionPayload,
  isEmptyObject,
} from '@/utils/helper';
import { updateUser } from '@/store/features/auth.slice';
import useSocket from '@/hooks/use-socket';
import { pixel } from '@/utils/pixel';
import cookies from 'js-cookie';
import { gtm } from '@/utils/gtm';

const useTrialActivation = ({ domainDetails, country_code }: any) => {
  const { user, setToken } = useContext(AuthContext);
  const router = useRouter();
  const queryParams = useSearchParams();

  const { updateSocketOnLogin } = useSocket();
  const dispatch = useDispatch();
  const [popupsState, popupsOpen, popupsClose] = useToggleState();

  const [isFreeTrial, setIsFreeTrial] = useState(false);

  const [isAllCanceled, setIsAllCancelled] = useState(false);
  const [isButtonHidden, setIsButtonHidden] = useState(false);
  const [fetchFreeTrialPopupsData] = useDispatchWithAbort(fetchFreeTrialPopups);

  const continueToCourseButtonRef = useRef(null);
  const [fetchTrialActivationData] = useDispatchWithAbort(fetchTrialActivation);

  const { language, currency } = useSelector(
    ({ defaults }: any) => defaults
  );

  const course = JSON.parse(cookies.get('course_data') || '{}' );

  const { logo, email, legal_name, brand_name } =
    domainDetails?.data?.domain_detail || {};

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  // free trial subscription
  const { data: monthlySubscriptionData } = useSelector(
    ({ popup }: any) => popup?.monthlySubscription
  );
  const { data: trialActivationData, loading: trialActivationLoading } =
    useSelector(
      ({ trialsActivation }: any) => trialsActivation.trialsActivation
    );

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

  const COURSE_TITLE = useMemo(() => {
    return course?.course_title || '';
  }, [course?.course_title]);

  const purchasePayload = useMemo(
    () => ({
      userId: user?.id,
      course_id: course?.id,
      language_id: language?.id,
    }),
    [course?.id, language?.id, user?.id]
  );

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

  const [onSubmit, loading] = useAsyncOperation(async () => {
    if (isFreeTrial) {
      const response = await api.plan.purchasePlan({
        data: {
          stripe_price_id:
            monthlySubscriptionData?.subscription_plan_prices?.[0]
              ?.stripe_price_id,
          name: user?.is_user_purchased_trial
            ? 'Subscription with discount'
            : 'monthly subscription',
          trial_activation_method:
            TRIAL_ACTIVATION_METHODS.TRIAL_ACTIVATION_OFFER,
          ...purchasePayload,
          ...getSubscriptionPayload(),
          ...(!user?.is_user_purchased_trial && {
            trial_days: 7,
          }),
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
            })
          );
        }

        gtm.ecommerce.trial_activated();
        pixel.start_trial({
          content_type: 'course',
          content_ids: [monthlySubscriptionData?.id],
          currency:
            monthlySubscriptionData?.subscription_plan_prices?.[0]?.currency
              ?.name || 'USD',
          value:
            monthlySubscriptionData?.subscription_plan_prices?.[0]?.amount || 0,
          total_amount:
            monthlySubscriptionData?.subscription_plan_prices?.[0]?.amount || 0,
          ...(user?.id ? { userId: user?.id } : {}),
          ...(!isEmptyObject(utmData) ? { utmData } : {}),
          contents: [
            {
              id: monthlySubscriptionData?.id,
              quantity: 1,
              item_price:
                monthlySubscriptionData?.subscription_plan_prices?.[0]?.amount,
            },
          ],
        });
        router.push(routes.public.complete_profile);
      }
    } else {
      const response = await api.plan.purchasePlan({
        data: {
          is_trial: false,
          trial_activation_method:
            TRIAL_ACTIVATION_METHODS.TRIAL_ACTIVATION_OFFER,
          ...purchasePayload,
          ...getSubscriptionPayload(),
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
            })
          );
        }
        gtm.ecommerce.no_trial();
        router.push(routes.public.complete_profile);
      }
    }
  });

  const onPopupCancel = () => {
    popupsClose();
    setIsAllCancelled(true);
  };

  useEffect(() => {
    if (fetchFreeTrialPopupsData) {
      fetchFreeTrialPopupsData({
        headers: {
          'req-from': country_code,
        },
      });
    }
  }, [fetchFreeTrialPopupsData, country_code]);

  const [handleWarningSuccess] = useAsyncOperation(async () => {
    const { trial_days, ...other }: any = purchasePayload;

    const response = await api.plan.purchasePlan({
      data: {
        is_trial: true,
        name: user?.is_user_purchased_trial
          ? 'Subscription with discount'
          : 'Free access',
        trial_activation_method: TRIAL_ACTIVATION_METHODS.SALES_WARNING_POPUP,
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
          })
        );
      }

      // gtm.ecommerce.trial_activated();
      gtm.trial_activation.warning_popup();
      router.push(routes.public.complete_profile);
    }
  });

  const onPopupSuccess = (slug: string) => {
    if (slug) {
      switch (slug) {
        case SALES_POPUPS_SUB_CATEGORIES.extendTrial:
          gtm.trial_activation.extended_trial_popup();
          break;
        case SALES_POPUPS_SUB_CATEGORIES.discount:
          gtm.trial_activation.discount_popup();
          break;
        case SALES_POPUPS_SUB_CATEGORIES.lifetimeAccess:
          gtm.ecommerce.trial_activated();
          break;
        default:
          break;
      }
    }

    pixel.start_trial({
      content_type: 'course',
      content_ids: [monthlySubscriptionData?.id],
      currency:
        monthlySubscriptionData?.subscription_plan_prices?.[0]?.currency
          ?.name || 'USD',
      value:
        monthlySubscriptionData?.subscription_plan_prices?.[0]?.amount || 0,
      total_amount:
        monthlySubscriptionData?.subscription_plan_prices?.[0]?.amount || 0,
      ...(user?.id ? { userId: user?.id } : {}),
      ...(!isEmptyObject(utmData) ? { utmData } : {}),
      contents: [
        {
          id: monthlySubscriptionData?.id,
          quantity: 1,
          item_price:
            monthlySubscriptionData?.subscription_plan_prices?.[0]?.amount,
        },
      ],
    });
    popupsClose();
    router.push(routes.public.complete_profile);
  };

  useEffect(() => {
    const footer = document.getElementById('footer');
    if (!footer) return;

    const marginBottom = isMobile ? '80px' : '0px';
    if (marginBottom) {
      footer.style.marginBottom = marginBottom;
    }
  }, [isMobile]);

  useEffect(() => {
    if (queryParams?.get('utm_source')) setIsFreeTrial(true);
  }, [queryParams]);

  useEffect(() => {
    if (!isMobile || !continueToCourseButtonRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsButtonHidden(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(continueToCourseButtonRef.current);

    return () => observer.disconnect();
  }, [isMobile]);

  useEffect(() => {
    if (fetchTrialActivationData) {
      fetchTrialActivationData({});
    }
  }, [fetchTrialActivationData]);

  return {
    popupsState,
    popupsOpen,
    popupsClose,
    isFreeTrial,
    setIsFreeTrial,
    loading,
    onSubmit,
    onPopupCancel,
    onPopupSuccess,
    handleWarningSuccess,
    setIsAllCancelled,
    currency,
    LOGO_URL,
    BRAND_NAME,
    SUPPORT_MAIL,
    LEGAL_NAME,
    COURSE_TITLE,
    isMobile,
    continueToCourseButtonRef,
    isButtonHidden,
    monthlySubscriptionData,
    trialActivationData,
    trialActivationLoading,
  };
};

export default useTrialActivation;
