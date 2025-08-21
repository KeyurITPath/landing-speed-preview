import { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ICONS } from '@/assets/icons';
import useAsyncOperation from '@/hooks/use-async-operation';
import { api } from '@/api';
import {
  decodeToken,
  formatCurrency,
  getSubscriptionPayload,
} from '@/utils/helper';
import { updateUser } from '@/store/features/auth.slice';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TRIAL_ACTIVATION_METHODS } from '@/utils/constants';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchSubscriptionWithDiscount } from '@/store/features/popup.slice';
// useSocket

const useTrialPopup = ({ trialPopupClose, trialPopupState }: any) => {
  // const { updateSocketOnLogin } = useSocket();

  const [fetchSubscriptionWithDiscountData] = useDispatchWithAbort(
    fetchSubscriptionWithDiscount
  );
  const router = useRouter();
  const pathname = usePathname();
  const queryParams = useSearchParams();

  const { user } = useSelector(({ auth }: any) => auth);

  const {
    trialPopups: { data: trialPopupsData, loading: trialPopupsDataLoading },
    subscriptionWithDiscount: {
      data: subscriptionWithDiscountData,
      loading: subscriptionWithDiscountLoading,
    },
  } = useSelector(({ popup }: any) => popup);

  const {
    language: { id: language_id },
  } = useSelector(({ defaults }: any) => defaults);
  const { course_title } = trialPopupState || {};

  const dispatch = useDispatch();
  const t = useTranslations();

  useEffect(() => {
    if (
      user?.is_user_purchased_trial &&
      !user?.is_subscribed &&
      fetchSubscriptionWithDiscountData
    ) {
      fetchSubscriptionWithDiscountData({});
    }
  }, [
    fetchSubscriptionWithDiscountData,
    user?.is_subscribed,
    user?.is_user_purchased_trial,
  ]);

  const details = useMemo(() => {
    return [
      {
        id: 4,
        icon: ICONS.LockOpen,
        label: t('trial_popup.course_unlocked', { course_title }),
      },
      {
        id: 1,
        icon: ICONS.GraduationCap,
        label: t('trial_popup.top_programs_label'),
        description: t('trial_popup.top_programs_desc'),
      },
      {
        id: 2,
        icon: ICONS.CALENDAR,
        label: t('trial_popup.new_courses_label'),
        description: t('trial_popup.new_courses_desc'),
      },
      {
        id: 3,
        icon: ICONS.OutlineGroups,
        label: t('trial_popup.community_label'),
        description: t('trial_popup.community_desc'),
      },
    ];
  }, [course_title, t]);

  const findDefaultTrialPopupData = useMemo(() => {
    if (trialPopupsData?.slug !== 'trial_popups') return {};

    const findDefaultTrialPopup = trialPopupsData?.popUps_sub_categories?.find(
      ({ slug }: any) => slug === 'trial_default_popup'
    );

    return findDefaultTrialPopup;
  }, [trialPopupsData?.popUps_sub_categories, trialPopupsData?.slug]);

  const activeLanguageSubscriptionPlan = useMemo(() => {
    if (!findDefaultTrialPopupData) return {};

    const findActiveLanguageSubscriptionPlan =
      findDefaultTrialPopupData?.subscription_plan_popups?.find(
        ({ language_id: languageId }: any) => languageId === language_id
      );

    return findActiveLanguageSubscriptionPlan;
  }, [findDefaultTrialPopupData, language_id]);

  const transformData = useMemo(() => {
    if (!findDefaultTrialPopupData) return [];

    const findPopUpsTranslationsData =
      findDefaultTrialPopupData?.popUps_translations?.find(
        ({ language_id: languageId }: any) => languageId === language_id
      );

    const { popup_data } = findPopUpsTranslationsData || {};
    const { title, description, trial_days } = popup_data || {};
    const { subscription_plan } = activeLanguageSubscriptionPlan || {};
    const { subscription_plan_prices } = subscription_plan || {};
    const {
      amount: price,
      currency,
      stripe_price_id,
    } = subscription_plan_prices?.[0] || {};

    const currencyCode = currency?.name || 'USD';

    return {
      title,
      description,
      trial_days,
      stripe_price_id,
      price: formatCurrency(price, currencyCode),
    };
  }, [activeLanguageSubscriptionPlan, findDefaultTrialPopupData, language_id]);

  const timeline = useMemo(() => {
    const { trial_days } = activeLanguageSubscriptionPlan || {};

    const { price }: any = transformData || {};
    return [
      {
        icon: ICONS.Stopwatch,
        title: t('trial_popup.trial_starts_today'),
        description: t('trial_popup.explore_courses'),
      },
      {
        icon: ICONS.Email,
        title: t('trial_popup.day_reminder', { trial_days: trial_days - 2 }),
        description: t('trial_popup.reminder_desc'),
      },
      {
        icon: ICONS.CALENDAR,
        title: t('trial_popup.subscription_begins', { trial_days: trial_days }),
        description: t('trial_popup.subscription_desc', { price }),
      },
    ];
  }, [activeLanguageSubscriptionPlan, transformData, t]);

  const onPopupSuccess = useCallback(() => {
    trialPopupClose();
    const queryString = new URLSearchParams(queryParams).toString();
    router.push(
      `${pathname}?subscription=activated${queryString ? `&${queryString}` : ''}`
    );
    // gtm.trial_activation.trial_activation_popup();
  }, [trialPopupClose, queryParams, router, pathname]);

  const [startFreeTrialSubmit, loading] = useAsyncOperation(async () => {
    const { subscription_plan, trial_days } =
      activeLanguageSubscriptionPlan || {};
    const { subscription_plan_prices } = subscription_plan || {};
    const { stripe_price_id } = subscription_plan_prices?.[0] || {};

    const purchasePayload = {
      trial_activation_method: TRIAL_ACTIVATION_METHODS.TRIAL_POPUP,
      userId: user?.id,
      language_id,
      ...(!user?.is_user_purchased_trial ? { trial_days } : {}),
      stripe_price_id,
      course_id: trialPopupState?.course_id,
      name: user?.is_user_purchased_trial
        ? 'Subscription with discount'
        : 'monthly subscription',
      ...getSubscriptionPayload(),
    };

    const response = await api.plan.purchasePlan({
      data: { ...purchasePayload },
    });

    if (response?.data?.data?.checkoutUrl) {
      window.open(response?.data?.data?.checkoutUrl, '_self');
      return;
    }

    const { token } = response?.data?.data || {};

    let registerUserData = {};

    if (token) {
      registerUserData = decodeToken(token);
      // updateSocketOnLogin(token);
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

  const [handleSubmitSubscriptionPlan] = useAsyncOperation(async () => {
    const payload = {
      userId: user?.id,
      course_id: trialPopupState?.course_id,
      language_id,
      name: 'Subscription with discount',
      stripe_price_id:
        subscriptionWithDiscountData?.subscription_plan_prices?.[0]
          ?.stripe_price_id,
      trial_activation_method:
        TRIAL_ACTIVATION_METHODS.MONTHLY_SUBSCRIPTION_WITH_DISCOUNT,
      ...getSubscriptionPayload(),
    };

    const response = await api.plan.purchasePlan({
      data: { ...payload },
    });

    if (response?.data?.data?.checkoutUrl) {
      window.open(response?.data?.data?.checkoutUrl, '_self');
      return;
    }

    const { token, hasActiveSubscription } = response?.data?.data || {};

    let registerUserData = {};
    if (hasActiveSubscription) return;
    if (token) {
      registerUserData = decodeToken(token);
      // updateSocketOnLogin(token);
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

  return {
    details,
    timeline,
    loading: trialPopupsDataLoading || loading,
    transformData,
    startFreeTrialSubmit,
    discountPlan: subscriptionWithDiscountData,
    discountPlanLoading: subscriptionWithDiscountLoading,
    is_user_purchased_trial: user?.is_user_purchased_trial,
    handleSubmitSubscriptionPlan,
  };
};

export default useTrialPopup;
