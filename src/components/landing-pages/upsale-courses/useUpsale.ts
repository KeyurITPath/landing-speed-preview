'use client';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchAllUpSales } from '@/store/features/course.slice';
import { AuthContext } from '@/context/auth-provider';
import { formatCurrency, getActualPrice, resolveUrl } from '@/utils/helper';
import { api } from '@/api';
import { DOMAIN } from '../../../utils/constants';
import { routes } from '@/utils/constants/routes';
import cookies from 'js-cookie';

const useUpsale = (courseData?: any, currency?: any) => {
  const searchParams = useSearchParams();
  const { user } = useContext(AuthContext);
  const router = useRouter();
  // Redux state
  const { upSaleCourses } = useSelector(({ course }: any) => course);
  const { currency: reduxCurrency } = useSelector(
    ({ defaults }: any) => defaults
  );

  // Use passed currency with Redux fallback (same pattern as checkout form)
  const effectiveCurrency = currency || reduxCurrency;

  // Extract course ID and currency ID from course data
  const effectiveCourseId = courseData?.course?.id;
  const effectiveCurrencyId = effectiveCurrency?.id;
  const effectiveLanguageId =
    courseData?.landing_page_translations?.[0]?.language_id ||
    user?.language_id;
  // Local state
  const [selectedUpsales, setSelectedUpsales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingUpsales, setIsLoadingUpsales] = useState(true); // Start with true to show skeleton initially
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string>('');

  // Dispatch actions
  const [fetchUpSales] = useDispatchWithAbort(fetchAllUpSales);

  // Payment status detection (same pattern as useLanding)
  const isPaymentSuccess = useMemo(() => {
    return searchParams?.get('payment') === 'success';
  }, [searchParams]);

  const isPaymentFailed = useMemo(() => {
    return searchParams?.get('payment') === 'failed';
  }, [searchParams]);

  const mainCurrencyCode = effectiveCurrency?.name || 'USD';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  // Fetch upsale courses (if not already fetched) - using same pattern as useLanding
  const fetchUpsaleCourses = useCallback(async () => {
    // Check if all required params are available
    if (!effectiveCourseId || !effectiveCurrencyId || !effectiveLanguageId) {
      // Don't show loading if we're missing required params
      setIsLoadingUpsales(false);
      return;
    }

    if (
      fetchUpSales &&
      !upSaleCourses?.length &&
      effectiveCourseId &&
      effectiveCurrencyId
    ) {
      setIsLoadingUpsales(true);
      try {
        // Add minimum loading time to show skeleton
        const [result] = await Promise.all([
          fetchUpSales({
            params: {
              course_id: effectiveCourseId,
              currency_id: effectiveCurrencyId,
              language_id: effectiveLanguageId,
            },
          }),
          new Promise(resolve => setTimeout(resolve, 1000)), // Minimum 1 second loading
        ]);
      } catch (error) {
        console.error('Error fetching upsale courses:', error);
      } finally {
        setIsLoadingUpsales(false);
      }
    } else if (upSaleCourses?.length === 0) {
      // If we already know there are no courses, don't show loading
      setIsLoadingUpsales(false);
    }
  }, [
    fetchUpSales,
    upSaleCourses?.length,
    effectiveCourseId,
    effectiveCurrencyId,
    effectiveLanguageId,
  ]);
  // Load upsale courses on mount if not already loaded
  useEffect(() => {
    fetchUpsaleCourses();
  }, [fetchUpsaleCourses]);

  // Set loading to false when courses are loaded or when we know there are no courses
  useEffect(() => {
    // If we have courses or if we've tried to fetch and got no results
    if (
      upSaleCourses?.length > 0 ||
      (upSaleCourses?.length === 0 && !isLoadingUpsales)
    ) {
      setIsLoadingUpsales(false);
    }
  }, [upSaleCourses?.length, isLoadingUpsales]);

  // Handle adding course to order
  const handleAddToOrder = useCallback(
    (course: any) => {
      if (!selectedUpsales.find(item => item.id === course.id)) {
        setSelectedUpsales(prev => [...prev, course]);
      }
    },
    [selectedUpsales]
  );

  // Handle removing course from order
  const removeFromOrder = useCallback((idToDelete: any) => {
    setSelectedUpsales(prev => prev.filter(({ id }) => id !== idToDelete));
  }, []);

  // Calculate total price
  const totalPrice = useMemo(() => {
    const mainCoursePrice = courseData?.course_prices?.[0]?.price || 0;
    const mainCurrencyCode =
      courseData?.course_prices?.[0]?.currency?.name ||
      effectiveCurrency?.name ||
      'USD';
    const upsaleTotal = selectedUpsales.reduce(
      (sum, item) => sum + (item?.priceAmount || 0),
      0
    );
    const totalAmount = mainCoursePrice + upsaleTotal;
    return formatCurrency(totalAmount, mainCurrencyCode);
  }, [selectedUpsales, courseData?.course_prices, effectiveCurrency?.name]);

  const isCompleteButtonDisabled = useMemo(() => {
    return selectedUpsales.length === 0;
  }, [selectedUpsales.length]);

  // Process upsale courses data (same pattern as checkout form)
  const processedUpsaleCourses = useMemo(() => {
    if (!upSaleCourses?.length) {
      return [];
    }

    const getPriceData = (course_prices: any) => {
      // First try to find exact currency match
      let found = course_prices?.find(({ is_upsale_price, currency }: any) => {
        return is_upsale_price && currency?.name === mainCurrencyCode;
      });

      if (!found) {
        found = course_prices?.find(({ is_upsale_price, currency }: any) => {
          return (
            is_upsale_price &&
            currency?.name?.toLowerCase() === mainCurrencyCode?.toLowerCase()
          );
        });
      }

      // If still no match, try to find any upsale price (fallback)
      if (!found) {
        found = course_prices?.find(({ is_upsale_price }: any) => {
          return is_upsale_price;
        });
      }

      return found;
    };

    const filteredCourses = upSaleCourses.filter(({ course_prices }: any) => {
      const hasValidPrice = getPriceData(course_prices);
      return hasValidPrice;
    });

    const processed = filteredCourses.map(
      ({ id, course_translation, course_prices }: any) => {
        const title = course_translation?.title;
        const image = resolveUrl(course_translation?.course_image);

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

        return result;
      }
    );

    return processed;
  }, [upSaleCourses, mainCurrencyCode]);

  // Handle checkout - call purchase upsale course API
  const handleCheckout = useCallback(async () => {
    try {
      setLoading(true);
      setShowPaymentError(false);
      setPaymentErrorMessage('');

      if (!selectedUpsales.length) {
        return;
      }

      // Get upsale course price IDs from selected upsales
      const upsalePriceIds = selectedUpsales
        .map(upsale => upsale.stripeId)
        .filter(Boolean);

      if (!upsalePriceIds.length) {
        return;
      }

      // Store in cookies so it persists across sessions
      cookies.set('selectedUpsaleIds', JSON.stringify(upsalePriceIds), {
        expires: 7,
        path: '/',
      });

      const data = {
        selected_upsale_price_ids: upsalePriceIds,
        user_id: user?.id,
        domain: DOMAIN,
        final_url: courseData?.final_url || courseData?.slug,
        ...params,
      };

      // Use .then() and .catch() for better error handling
      await api.getAccess
        .purchaseUpsaleCourse({ data })
        .then((response: any) => {
          if (response?.data?.data?.status === 'succeeded') {
            router.push(routes.public.complete_profile);
          } else {
            const errorMessage =
              response?.data?.message ||
              response?.data?.data?.message ||
              response?.data?.data?.error ||
              response?.data?.error ||
              'Payment failed. Please try again.';
            setPaymentErrorMessage(errorMessage);
            setShowPaymentError(true);
          }
        })
        .catch((error: any) => {
          const errorMessage =
            error?.data?.message ||
            error?.apiError?.message ||
            error?.message ||
            'Payment failed. Please try again.';
          console.log('Error message extracted:', errorMessage);
          setPaymentErrorMessage(errorMessage);
          setShowPaymentError(true);
        });
    } catch (error: any) {
      const errorMessage =
        error?.message || 'Payment failed. Please try again.';
      setPaymentErrorMessage(errorMessage);
      setShowPaymentError(true);
    } finally {
      setLoading(false);
    }
  }, [
    selectedUpsales,
    user?.id,
    courseData?.final_url,
    courseData?.slug,
    params,
    router,
  ]);

  // Handle decline upsale
  const handleDeclineUpsale = useCallback(() => {
    window.location.href = routes.public.complete_profile;
  }, []);

  const handleClosePaymentError = useCallback(() => {
    setShowPaymentError(false);
    setPaymentErrorMessage('');
    window.location.href = routes.public.complete_profile;
  }, []);

  return {
    // State
    selectedUpsales,
    loading,
    isLoadingUpsales,
    isPaymentSuccess,
    isPaymentFailed,
    showPaymentError,
    paymentErrorMessage,

    // Data
    upsaleCourses: processedUpsaleCourses,
    totalPrice,

    // Actions
    handleAddToOrder,
    removeFromOrder,
    handleCheckout,
    handleDeclineUpsale,
    handleClosePaymentError,
    fetchUpsaleCourses,
    isCompleteButtonDisabled,
  };
};

export default useUpsale;
