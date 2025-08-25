import { useEffect, useMemo, useState } from 'react';
import { SALES_POPUPS_SUB_CATEGORIES } from '@/utils/constants';
import { useSelector } from 'react-redux';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import {
  fetchCategories,
  fetchFreeTrialPopups,
  fetchSalesPopups,
} from '@/store/features/popup.slice';
import Warning from './components/warning';
import ExtendTrial from './components/extend-trial';
import ExtendTrialInitial from './components/extend-trial-initial';
import Discount from './components/discount';
import Default from './components/default';
import { formatCurrency, getActualPrice, resolveUrl } from '../../utils/helper';

const useSalesPopups = ({
  rootHandleCancel,
  type,
  monthlySubscriptionData,
  country_code,
}: any) => {
  const [activeTab, setActiveTab] = useState(1);

  const { language } = useSelector((state: any) => state.defaults);

  const [fetchCategoriesData] = useDispatchWithAbort(fetchCategories);
  const [fetchSalesPopupsData] = useDispatchWithAbort(fetchSalesPopups);
  const { salesPopups, categories } = useSelector((state: any) => state.popup);

  const [fetchFreeTrialPopupsData] = useDispatchWithAbort(fetchFreeTrialPopups);

  const subCategoriesComponents = useMemo(
    () => ({
      [SALES_POPUPS_SUB_CATEGORIES.warning]: Warning,
      [SALES_POPUPS_SUB_CATEGORIES.extendTrialMain]: ExtendTrialInitial,
      [SALES_POPUPS_SUB_CATEGORIES.extendTrialSecondary]: ExtendTrial,
      [SALES_POPUPS_SUB_CATEGORIES.discount]: Discount,
      [SALES_POPUPS_SUB_CATEGORIES.default]: Default,
    }),
    []
  );

  useEffect(() => {
    if (fetchFreeTrialPopupsData) {
      fetchFreeTrialPopupsData({
        headers: {
            'req-from': country_code
        }
      });
    }
  }, [country_code, fetchFreeTrialPopupsData]);

  const extendTrialPrice = useMemo(() => {
    if (!monthlySubscriptionData) return 0;
    const clone = { ...monthlySubscriptionData };
    return clone?.subscription_plan_prices?.[0]?.amount || 0;
  }, [monthlySubscriptionData]);

  const extendTrialCurrency = useMemo(() => {
    if (!monthlySubscriptionData) return 'USD';
    const clone = { ...monthlySubscriptionData };
    return clone?.subscription_plan_prices?.[0]?.currency?.name || 'USD';
  }, [monthlySubscriptionData]);

  // free trial subscription
  const { data: monthlySubscriptionValues } = useSelector(
    ({ popup }: any) => popup?.monthlySubscription
  );

  const monthlySubscriptionPlan = useMemo(() => {
    if (!monthlySubscriptionValues) return null;
    const { subscription_plan_prices } = monthlySubscriptionValues;
    return {
      actualPrice: formatCurrency(
        subscription_plan_prices?.[0]?.amount,
        subscription_plan_prices?.[0]?.currency?.name
      ),
      ...subscription_plan_prices?.[0],
    };
  }, [monthlySubscriptionValues]);

  const trialDaysForExtendTrialMain = useMemo(() => {
    const clone = [...(salesPopups?.data?.popUps_sub_categories || [])];
    const finfMainPlan = clone.find(
      val => val.slug === SALES_POPUPS_SUB_CATEGORIES.extendTrialMain
    );
    return finfMainPlan?.popUps_translations?.[0]?.popup_data?.trial_days || 0;
  }, [salesPopups?.data?.popUps_sub_categories]);

  const transformedData = useMemo(() => {
    return (
      salesPopups?.data?.popUps_sub_categories
        ?.filter(({ slug }: any) => slug !== 'sales_lifetime_access')
        ?.map(
          ({
            id,
            slug,
            popUps_translations,
            subscription_plan_popups,
          }: any) => {
            const Component = subCategoriesComponents[slug];

            const translation = popUps_translations?.find(
              ({ language_id }: any) => language_id === language?.id
            );
            const { title, description, trial_days, discount, order, header } =
              translation?.popup_data || {};

            const {
              stripe_price_id,
              amount: price,
              currency,
            } = subscription_plan_popups?.[0]?.subscription_plan
              ?.subscription_plan_prices?.[0] || {};

            const currencyCode = currency?.name || 'USD';

            const image = resolveUrl(translation?.popup_image);

            let actualPriceAmount = 0;
            let actualPrice = '';

            if (discount) {
              actualPriceAmount = getActualPrice(price, discount);
              actualPrice = formatCurrency(actualPriceAmount, currencyCode);
            }

            const isLast = slug === SALES_POPUPS_SUB_CATEGORIES.default;

            let updatedDescription = description;
            let headerTitle = header;

            if (headerTitle?.length) {
              switch (slug) {
                case SALES_POPUPS_SUB_CATEGORIES.extendTrialSecondary:
                  headerTitle = headerTitle.replaceAll(
                    '{EXTENDED_TRIAL_DAYS}',
                    trialDaysForExtendTrialMain
                  );
                  break;
                case SALES_POPUPS_SUB_CATEGORIES.discount:
                  headerTitle = headerTitle.replaceAll(
                    '{DISCOUNTED_PRICE}',
                    formatCurrency(price, currencyCode)
                  );
                  headerTitle = headerTitle.replaceAll(
                    '{ACTUAL_PRICE}',
                    monthlySubscriptionPlan?.actualPrice
                  );
                  headerTitle = headerTitle.replaceAll(
                    '{DISCOUNT_PERCENTAGE}',
                    `${discount}%`
                  );
                  break;
                default:
                  break;
              }
            }

            if (updatedDescription?.length) {
              switch (slug) {
                case SALES_POPUPS_SUB_CATEGORIES.extendTrialSecondary:
                  updatedDescription = updatedDescription.replaceAll(
                    '{EXTENDED_TRIAL_DAYS}',
                    trial_days
                  );
                  updatedDescription = updatedDescription.replaceAll(
                    '{ACTUAL_PRICE}',
                    formatCurrency(extendTrialPrice, extendTrialCurrency)
                  );
                  updatedDescription = updatedDescription.replaceAll(
                    '{EXTENDED_TRIAL_PRICE}',
                    formatCurrency(extendTrialPrice, extendTrialCurrency)
                  );
                  break;
                case SALES_POPUPS_SUB_CATEGORIES.extendTrialMain:
                  updatedDescription = updatedDescription.replaceAll(
                    '{EXTENDED_TRIAL_DAYS}',
                    trial_days
                  );
                  updatedDescription = updatedDescription.replaceAll(
                    '{ACTUAL_PRICE}',
                    formatCurrency(extendTrialPrice, extendTrialCurrency)
                  );
                  break;
                case SALES_POPUPS_SUB_CATEGORIES.discount:
                  updatedDescription = updatedDescription.replaceAll(
                    '{DISCOUNTED_PRICE}',
                    formatCurrency(price, currencyCode)
                  );
                  updatedDescription = updatedDescription.replaceAll(
                    '{ACTUAL_PRICE}',
                    monthlySubscriptionPlan?.actualPrice
                  );
                  break;
                default:
                  break;
              }
            }

            return {
              id,
              Component,
              title,
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
              header: headerTitle,
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
    extendTrialCurrency,
    extendTrialPrice,
    language?.id,
    monthlySubscriptionPlan?.actualPrice,
    salesPopups?.data?.popUps_sub_categories,
    subCategoriesComponents,
    trialDaysForExtendTrialMain,
  ]);

  const handleCancel = () => {
    const nextTab = activeTab + 1;
    const totalTabs = transformedData.length;

    if (nextTab <= totalTabs) {
      setActiveTab(nextTab);
    } else {
      rootHandleCancel();
      setActiveTab(1);
    }
  };

  useEffect(() => {
    if (fetchCategoriesData) {
      fetchCategoriesData({
        headers: {
          'req-from': country_code
        }
      });
    }
  }, [country_code, fetchCategoriesData]);

  useEffect(() => {
    const popUps_category_id = categories?.data?.find(
      ({ slug }: any) => slug === type
    )?.id;
    if (popUps_category_id && fetchSalesPopupsData) {
      fetchSalesPopupsData({ params: { popUps_category_id }, headers: { 'req-from': country_code } });
    }
  }, [categories?.data, country_code, fetchSalesPopupsData, type]);

  return {
    transformedData,
    activeTab,
    handleCancel,
    salesPopupsLoading: salesPopups.loading,
  };
};

export default useSalesPopups;
