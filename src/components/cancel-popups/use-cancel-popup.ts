import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import {
  fetchCancelPopups,
  fetchCategories,
  fetchFreeTrialPopups,
} from '@/store/features/popup.slice';
import { CANCEL_POPUPS_SUB_CATEGORIES } from '@/utils/constants';
import Warning from './components/warning';
import Feedback from './components/feedback';
import ExtendTrial from './components/extend-trial';
import Discount from './components/discount';
import Default from './components/default';
import DiscountInitial from './components/discount-initial';
import { formatCurrency, getActualPrice, resolveUrl } from '@/utils/helper';
import cookies from 'js-cookie';

const useCancelPopups = ({
  rootHandleCancel,
  type,
  resetCancelPopup,
  setResetCancelPopup,
}: any) => {
  const [fetchCategoriesData] = useDispatchWithAbort(fetchCategories);
  const [fetchCancelPopupsData] = useDispatchWithAbort(fetchCancelPopups);
  const [fetchFreeTrialPopupsData] = useDispatchWithAbort(fetchFreeTrialPopups);

  const { cancelPopups, categories } = useSelector((state: any) => state.popup);

  const { language } = useSelector((state: any) => state.defaults);

  const user = useSelector(({ auth }: any) => auth.user);
  const { data: userData } = useSelector(({ user }: any) => user);

  const isUserInTrial = useMemo(() => {
    return user?.subscription_type === 'trial';
  }, [user?.subscription_type]);

  // free trial subscription
  const { data: monthlySubscriptionData } = useSelector(
    ({ popup }: any) => popup?.monthlySubscription
  );

  const monthlySubscription = useMemo(() => {
    if (!monthlySubscriptionData) return null;
    const { subscription_plan_prices } = monthlySubscriptionData;
    return {
      actualPrice: formatCurrency(
        subscription_plan_prices?.[0]?.amount,
        subscription_plan_prices?.[0]?.currency?.name
      ),
      ...subscription_plan_prices?.[0],
    };
  }, [monthlySubscriptionData]);

  useEffect(() => {
    if (fetchFreeTrialPopupsData) {
      fetchFreeTrialPopupsData({
        headers: {
          'req-from': cookies.get('country_code'),
        },
      });
    }
  }, [fetchFreeTrialPopupsData]);

  const [activeTab, setActiveTab] = useState(1);

  const subCategoriesComponents = useMemo(
    () => ({
      [CANCEL_POPUPS_SUB_CATEGORIES.extendTrial]: ExtendTrial,
      [CANCEL_POPUPS_SUB_CATEGORIES.discountMain]: DiscountInitial,
      [CANCEL_POPUPS_SUB_CATEGORIES.discountSecondary]: Discount,
      [CANCEL_POPUPS_SUB_CATEGORIES.feedback]: Feedback,
      [CANCEL_POPUPS_SUB_CATEGORIES.warning]: Warning,
      [CANCEL_POPUPS_SUB_CATEGORIES.default]: Default,
    }),
    []
  );

  const transformedData = useMemo(() => {
    // Get all purchased popup_slugs from purchase history
    const purchasedSlugs =
      userData?.subscription_purchase_histories?.map(
        (h: any) => h.popup_slug
      ) || [];

    return (
      cancelPopups?.data?.popUps_sub_categories
        ?.filter(({ slug }: any) => {
          // 1. Hide cancel_lifetime_access permanently
          if (slug === 'cancel_lifetime_access') return false;
          // 2. If user is in trial, hide extendTrial
          if (slug === CANCEL_POPUPS_SUB_CATEGORIES.extendTrial) {
            if (purchasedSlugs.includes(slug)) {
              return false;
            } else if (isUserInTrial) {
              return true;
            } else return false;
          }
          // 3. Hide all purchased plans using purchase history
          if (purchasedSlugs.includes(slug)) return false;
          return true;
        })
        ?.map(
          ({
            id,
            slug,
            popUps_translations,
            subscription_plan_popups,
          }: any) => {
            const Component = subCategoriesComponents[slug];
            const translation = popUps_translations?.find(
              ({ language_id }: any) => language?.id === language_id
            );
            const {
              title,
              title_paid,
              description,
              trial_days,
              discount,
              order,
              options,
              header,
              header_paid,
              description_paid,
            } = translation?.popup_data || {};
            const {
              stripe_price_id,
              amount: price,
              currency,
            } = subscription_plan_popups?.[0]?.subscription_plan
              ?.subscription_plan_prices?.[0] || {};

            const currencyCode = currency?.name || 'USD';

            const image = resolveUrl(translation?.popup_image);

            const actualPriceAmount = getActualPrice(price, discount);
            const actualPrice = formatCurrency(actualPriceAmount, currencyCode);

            const isLast = slug === CANCEL_POPUPS_SUB_CATEGORIES.default;

            let updatedDescription = isUserInTrial
              ? description
              : [
                    CANCEL_POPUPS_SUB_CATEGORIES.discountMain,
                    CANCEL_POPUPS_SUB_CATEGORIES.discountSecondary,
                  ].includes(slug)
                ? description_paid
                : description;

            let updatedHeader = isUserInTrial
              ? header
              : [
                    CANCEL_POPUPS_SUB_CATEGORIES.discountMain,
                    CANCEL_POPUPS_SUB_CATEGORIES.discountSecondary,
                  ].includes(slug)
                ? header_paid
                : header;

            if (updatedDescription?.length) {
              switch (slug) {
                case CANCEL_POPUPS_SUB_CATEGORIES.discountMain:
                case CANCEL_POPUPS_SUB_CATEGORIES.discountSecondary:
                  updatedDescription = updatedDescription.replaceAll(
                    '{DISCOUNTED_PRICE}',
                    formatCurrency(price, currencyCode)
                  );
                  updatedDescription = updatedDescription.replaceAll(
                    '{ACTUAL_PRICE}',
                    monthlySubscription?.actualPrice
                  );
                  updatedDescription = updatedDescription.replaceAll(
                    '{DISCOUNT}',
                    `${discount}%`
                  );
                  break;
                case CANCEL_POPUPS_SUB_CATEGORIES.extendTrial:
                  updatedDescription = updatedDescription.replaceAll(
                    '{EXTENDED_TRIAL_DAYS}',
                    trial_days
                  );
                  updatedDescription = updatedDescription.replaceAll(
                    '{ACTUAL_PRICE}',
                    monthlySubscription?.actualPrice
                  );
                  break;
                default:
                  break;
              }
            }

            if (updatedHeader?.length) {
              switch (slug) {
                case CANCEL_POPUPS_SUB_CATEGORIES.discountMain:
                case CANCEL_POPUPS_SUB_CATEGORIES.discountSecondary:
                  updatedHeader = updatedHeader.replaceAll(
                    '{DISCOUNTED_PRICE}',
                    formatCurrency(price, currencyCode)
                  );
                  updatedHeader = updatedHeader.replaceAll(
                    '{ACTUAL_PRICE}',
                    monthlySubscription?.actualPrice
                  );
                  updatedHeader = updatedHeader.replaceAll(
                    '{DISCOUNT_PERCENTAGE}',
                    `${discount}%`
                  );
                  break;
                default:
                  break;
              }
            }

            return {
              id,
              Component,
              header: updatedHeader,
              title: isUserInTrial
                ? title
                : [
                      CANCEL_POPUPS_SUB_CATEGORIES.discountMain,
                      CANCEL_POPUPS_SUB_CATEGORIES.discountSecondary,
                    ].includes(slug)
                  ? title_paid
                  : title,
              description: updatedDescription,
              image,
              trial_days,
              price: formatCurrency(price, currencyCode),
              discount,
              actualPrice,
              order,
              isLast,
              stripe_price_id,
              slug,
              options,
            };
          }
        )
        ?.filter(({ order, isLast }: any) => order || isLast)
        ?.sort((a: any, b: any) => {
          if (a.isLast) return 1;
          if (b.isLast) return -1;
          return a.order - b.order;
        })
        ?.map((item: any, index: number) => ({
          ...item,
          rank: index + 1,
        })) || []
    );
  }, [
    userData?.subscription_purchase_histories,
    cancelPopups?.data?.popUps_sub_categories,
    isUserInTrial,
    subCategoriesComponents,
    language?.id,
    monthlySubscription?.actualPrice,
  ]);

  const handleCancel = () => {
    const nextTab = activeTab + 1;
    const totalTabs = transformedData.length;

    if (nextTab <= totalTabs) {
      setActiveTab(nextTab);
    } else {
      rootHandleCancel();
    }
  };

  const resetCancelPopupHandler = useCallback(() => {
    const nextTab = activeTab + 1;
    const totalTabs = transformedData.length;

    if (!(nextTab <= totalTabs)) {
      setActiveTab(1);
      setResetCancelPopup(false);
    }
  }, [setResetCancelPopup, activeTab, transformedData]);

  const handleGoBack = () => {
    const prevTab = activeTab - 1;
    setActiveTab(prevTab);
  };

  useEffect(() => {
    if (fetchCategoriesData) {
      fetchCategoriesData({
        headers: {
          'req-from': cookies.get('country_code'),
        },
      });
    }
  }, [fetchCategoriesData]);

  useEffect(() => {
    const popUps_category_id = categories?.data?.find(
      ({ slug }: any) => slug === type
    )?.id;
    if (popUps_category_id && fetchCancelPopupsData) {
      fetchCancelPopupsData({
        params: { popUps_category_id },
        headers: { 'req-from': cookies.get('country_code') },
      });
    }
  }, [categories?.data, fetchCancelPopupsData, type]);

  useEffect(() => {
    if (resetCancelPopup) resetCancelPopupHandler();
  }, [resetCancelPopup, resetCancelPopupHandler]);

  return {
    transformedData,
    activeTab,
    setActiveTab,
    handleCancel,
    cancelPopupsLoading: cancelPopups.loading,
    handleGoBack,
  };
};

export default useCancelPopups;
