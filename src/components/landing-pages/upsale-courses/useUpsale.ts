'use client';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchAllUpSales } from '@/store/features/course.slice';
import { AuthContext } from '@/context/auth-provider';
import { formatCurrency, getActualPrice, resolveUrl } from '@/utils/helper';
import { api } from '@/api';
import { DOMAIN } from '../../../utils/constants';
import { routes } from '@/utils/constants/routes';

const useUpsale = (courseData?: any, currency?: any) => {
  const searchParams = useSearchParams();
  const { user } = useContext(AuthContext);

  // Redux state
  const { upSaleCourses } = useSelector(({ course }: any) => course);

  // Use passed currency (no need for Redux fallback since we get it from order history)
  const effectiveCurrency = currency;

  // Extract course ID and currency ID from course data
  const effectiveCourseId = courseData?.course?.id;
  const effectiveCurrencyId = effectiveCurrency?.id;
  const effectiveLanguageId = courseData?.landing_page_translations?.[0]?.language_id || user?.language_id || 1;

  // Local state
  const [selectedUpsales, setSelectedUpsales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Dispatch actions
  const [fetchUpSales] = useDispatchWithAbort(fetchAllUpSales);

  // Payment status detection (same pattern as useLanding)
  const isPaymentSuccess = useMemo(() => {
    return searchParams?.get('payment') === 'success';
  }, [searchParams]);

  const isPaymentFailed = useMemo(() => {
    return searchParams?.get('payment') === 'failed';
  }, [searchParams]);

  // Get currency code
  const mainCurrencyCode = effectiveCurrency?.code || 'USD';

  // Fetch upsale courses (if not already fetched) - using same pattern as useLanding
  const fetchUpsaleCourses = useCallback(async () => {
    if (fetchUpSales && !upSaleCourses?.length && effectiveCourseId && effectiveCurrencyId) {
      await fetchUpSales({
        params: {
          course_id: effectiveCourseId,
          currency_id: effectiveCurrencyId,
          language_id: effectiveLanguageId
        },
        headers: { 'req-from': 'upsale-page' },
      });
    }
  }, [fetchUpSales, upSaleCourses?.length, effectiveCourseId, effectiveCurrencyId, effectiveLanguageId]);

  // Load upsale courses on mount if not already loaded
  useEffect(() => {
    fetchUpsaleCourses();
  }, [fetchUpsaleCourses]);

  // Handle adding course to order
  const handleAddToOrder = useCallback((course: any) => {
    if (!selectedUpsales.find(item => item.id === course.id)) {
      setSelectedUpsales(prev => [...prev, course]);
    }
  }, [selectedUpsales]);

  // Handle removing course from order
  const removeFromOrder = useCallback((idToDelete: any) => {
    setSelectedUpsales(prev => prev.filter(({ id }) => id !== idToDelete));
  }, []);

  // Calculate total price
  const totalPrice = useMemo(() => {
    const mainCoursePrice = courseData?.course_prices?.[0]?.price || 0;
    const mainCurrencyCode = courseData?.course_prices?.[0]?.currency?.name || 'USD';
    const upsaleTotal = selectedUpsales.reduce((sum, item) => sum + (item?.priceAmount || 0), 0);
    const totalAmount = mainCoursePrice + upsaleTotal;
    return formatCurrency(totalAmount, mainCurrencyCode);
  }, [selectedUpsales, courseData?.course_prices]);

  // Process upsale courses data (same pattern as checkout form)
  const processedUpsaleCourses = useMemo(() => {
    if (!upSaleCourses?.length) return [];

    const getPriceData = (course_prices: any) =>
      course_prices?.find(
        ({ is_upsale_price, currency }: any) =>
          is_upsale_price && currency?.name === mainCurrencyCode
      );

    return upSaleCourses
      .filter(({ course_prices }: any) => getPriceData(course_prices))
      .map(({ id, course_translation, course_prices }: any) => {
        const title = course_translation?.title;
        const image = resolveUrl(course_translation?.course_image);

        const priceData = getPriceData(course_prices);
        const priceAmount = priceData?.price || 0;
        const currencyCode = priceData?.currency?.name || mainCurrencyCode;

        const price = formatCurrency(priceAmount, currencyCode);
        const discount = course_translation?.course?.discount || 0;
        const actualPriceAmount = getActualPrice(priceAmount, discount);
        const actualPrice = formatCurrency(actualPriceAmount, currencyCode);

        return {
          id,
          title,
          image,
          price,
          actualPrice,
          priceAmount,
          stripeId: priceData?.stripe_price_id,
        };
      });
  }, [upSaleCourses, mainCurrencyCode]);

  // Handle checkout - call purchase upsale course API
  const handleCheckout = useCallback(async () => {
    try {
      setLoading(true);

      if (!selectedUpsales.length) {
        return;
      }

      // Get upsale course price IDs from selected upsales
      const upsalePriceIds = selectedUpsales.map(upsale => upsale.stripeId).filter(Boolean);

      if (!upsalePriceIds.length) {
        return;
      }

        const data = {
          selected_upsale_price_ids: upsalePriceIds,
          user_id: user?.id,
          domain: DOMAIN,
          final_url: courseData?.final_url || courseData?.slug,
        };

      const response = await api.getAccess.purchaseUpsaleCourse({ data });

      if (response?.data?.data?.status === 'succeeded') {
        // Redirect to email verification page after successful purchase
        window.location.href = routes.public.email_verification;
      } else {
        console.error('Upsale purchase failed:', response);
      }
    } catch (error) {
      console.error('Upsale checkout failed:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedUpsales, user?.id, courseData?.final_url, courseData?.slug]);

  // Handle decline upsale
  const handleDeclineUpsale = useCallback(() => {
    window.location.href = routes.public.email_verification;
  }, []);

  return {
    // State
    selectedUpsales,
    loading,
    isPaymentSuccess,
    isPaymentFailed,

    // Data
    upsaleCourses: processedUpsaleCourses,
    totalPrice,

    // Actions
    handleAddToOrder,
    removeFromOrder,
    handleCheckout,
    handleDeclineUpsale,
    fetchUpsaleCourses,
  };
};

export default useUpsale;
