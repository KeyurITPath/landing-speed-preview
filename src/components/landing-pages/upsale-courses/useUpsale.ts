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
  const { currency: reduxCurrency } = useSelector(({ defaults }: any) => defaults);

  // Use passed currency with Redux fallback (same pattern as checkout form)
  const effectiveCurrency = currency || reduxCurrency;

  // Extract course ID and currency ID from course data
  const effectiveCourseId = courseData?.course?.id;
  const effectiveCurrencyId = effectiveCurrency?.id;
  const effectiveLanguageId = courseData?.landing_page_translations?.[0]?.language_id || user?.language_id;

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

  // Debug currency information
  console.log('CURRENCY DEBUG:');
  console.log('effectiveCurrency:', effectiveCurrency);
  console.log('mainCurrencyCode:', mainCurrencyCode);
  console.log('reduxCurrency:', reduxCurrency);

  // Fetch upsale courses (if not already fetched) - using same pattern as useLanding
  const fetchUpsaleCourses = useCallback(async () => {
    if (fetchUpSales && !upSaleCourses?.length && effectiveCourseId && effectiveCurrencyId) {
      await fetchUpSales({
        params: {
          course_id: effectiveCourseId,
          currency_id: effectiveCurrencyId,
          language_id: effectiveLanguageId
        },
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
    console.log('DEBUG - Processing upsale courses:');
    console.log('upSaleCourses:', upSaleCourses);
    console.log('upSaleCourses length:', upSaleCourses?.length);
    console.log('mainCurrencyCode:', mainCurrencyCode);
    console.log('effectiveCurrency:', effectiveCurrency);

    if (!upSaleCourses?.length) {
      console.log('No upsale courses found');
      return [];
    }

    const getPriceData = (course_prices: any) => {
      console.log('Checking course_prices:', course_prices);

      // First try to find exact currency match
      let found = course_prices?.find(
        ({ is_upsale_price, currency }: any) => {
          console.log('Checking price:', { is_upsale_price, currencyName: currency?.name, mainCurrencyCode });
          return is_upsale_price && currency?.name === mainCurrencyCode;
        }
      );

      // If no exact match, try case-insensitive match
      if (!found) {
        console.log('No exact currency match, trying case-insensitive...');
        found = course_prices?.find(
          ({ is_upsale_price, currency }: any) => {
            console.log('Checking case-insensitive price:', { is_upsale_price, currencyName: currency?.name, mainCurrencyCode });
            return is_upsale_price && currency?.name?.toLowerCase() === mainCurrencyCode?.toLowerCase();
          }
        );
      }

      // If still no match, try to find any upsale price (fallback)
      if (!found) {
        console.log('No currency match, trying fallback...');
        found = course_prices?.find(
          ({ is_upsale_price }: any) => {
            console.log('Checking fallback price:', { is_upsale_price });
            return is_upsale_price;
          }
        );
      }

      console.log('Found price data:', found);
      return found;
    };

    const filteredCourses = upSaleCourses.filter(({ course_prices }: any) => {
      const hasValidPrice = getPriceData(course_prices);
      console.log('Course has valid price:', hasValidPrice);
      return hasValidPrice;
    });

    console.log('Filtered courses count:', filteredCourses.length);

    const processed = filteredCourses.map(({ id, course_translation, course_prices }: any) => {
      const title = course_translation?.title;
      const image = resolveUrl(course_translation?.course_image);
      console.log('image:', image, 'course_translation?.course_image:', course_translation?.course_image);

      const priceData = getPriceData(course_prices);
      const priceAmount = priceData?.price || 0;
      const currencyCode = priceData?.currency?.name || mainCurrencyCode;

      const price = formatCurrency(priceAmount, currencyCode);
      const discount = course_translation?.course?.discount || 0;
      const actualPriceAmount = getActualPrice(priceAmount, discount);
      const actualPrice = formatCurrency(actualPriceAmount, currencyCode);

      const result = {
        id,
        title,
        image,
        price,
        actualPrice,
        priceAmount,
        stripeId: priceData?.stripe_price_id,
      };

      console.log('Processed course:', result);
      return result;
    });

    console.log('Final processed courses:', processed);
    return processed;
  }, [upSaleCourses, mainCurrencyCode, effectiveCurrency]);
  console.log('processedUpsaleCourses :>> ', processedUpsaleCourses);

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
