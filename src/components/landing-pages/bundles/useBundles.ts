'use client';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchAllBundles } from '@/store/features/course.slice';
import { AuthContext } from '@/context/auth-provider';
import { formatCurrency, resolveUrl } from '@/utils/helper';
import { api } from '@/api';
import { DOMAIN } from '../../../utils/constants';
import { routes } from '@/utils/constants/routes';
import cookies from 'js-cookie';

const useBundles = (courseData?: any, currency?: any) => {
  const searchParams = useSearchParams();
  const { user } = useContext(AuthContext);
  const router = useRouter();
  // Redux state
  const { bundleCourses } = useSelector(({ course }: any) => course);
  const { currency: reduxCurrency } = useSelector(
    ({ defaults }: any) => defaults
  );

  // Use passed currency with Redux fallback
  const effectiveCurrency = currency || reduxCurrency;

  // Extract course ID and currency ID from course data
  const effectiveCourseId = courseData?.course?.id;
  const effectiveCurrencyId = effectiveCurrency?.id;
  const effectiveLanguageId =
    courseData?.landing_page_translations?.[0]?.language_id ||
    user?.language_id;

  // Local state
  const [isLoadingBundles, setIsLoadingBundles] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string>('');

  // Payment status detection
  const isPaymentSuccess = useMemo(() => {
    return searchParams?.get('payment') === 'success';
  }, [searchParams]);

  const isPaymentFailed = useMemo(() => {
    return searchParams?.get('payment') === 'failed';
  }, [searchParams]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  // Dispatch actions
  const [fetchBundles] = useDispatchWithAbort(fetchAllBundles);

  const mainCurrencyCode = effectiveCurrency?.name || 'USD';

  // Fetch bundle courses
  const fetchBundleCourses = useCallback(async () => {
    // Check if all required params are available
    if (!effectiveCourseId || !effectiveCurrencyId || !effectiveLanguageId) {
      setIsLoadingBundles(false);
      return;
    }

    if (fetchBundles) {
      setIsLoadingBundles(true);
      try {
        await Promise.all([
          fetchBundles({
            params: {
              course_id: effectiveCourseId,
              currency_id: effectiveCurrencyId,
              language_id: effectiveLanguageId,
            },
          }),
          new Promise(resolve => setTimeout(resolve, 1000)), // Minimum 1 second loading
        ]);
      } catch (error) {
        console.error('Error fetching bundle courses:', error);
      } finally {
        setIsLoadingBundles(false);
      }
    } else if (bundleCourses?.length === 0) {
      setIsLoadingBundles(false);
    }
  }, [
    fetchBundles,
    bundleCourses?.length,
    effectiveCourseId,
    effectiveCurrencyId,
    effectiveLanguageId,
  ]);

  // Load bundle courses on mount
  useEffect(() => {
    fetchBundleCourses();
  }, [fetchBundleCourses]);

  // Set loading to false when courses are loaded
  useEffect(() => {
    if (
      bundleCourses?.length > 0 ||
      (bundleCourses?.length === 0 && !isLoadingBundles)
    ) {
      setIsLoadingBundles(false);
    }
  }, [bundleCourses?.length, isLoadingBundles]);

  // Process bundle courses data
  const processedBundleCourses = useMemo(() => {
    if (!bundleCourses?.length) {
      return [];
    }

    const processed = bundleCourses.map(
      ({ id, course_translation, course_prices, instructor, rating }: any) => {
        const title = course_translation?.title;
        const image = resolveUrl(course_translation?.course_image);

        // Get price data (similar to upsale processing)
        const getPriceData = (course_prices: any) => {
          let found = course_prices?.find(({ currency }: any) => {
            return currency?.name === mainCurrencyCode;
          });

          if (!found) {
            found = course_prices?.find(({ currency }: any) => {
              return (
                currency?.name?.toLowerCase() ===
                mainCurrencyCode?.toLowerCase()
              );
            });
          }

          if (!found) {
            found = course_prices?.[0];
          }

          return found;
        };

        const priceData = getPriceData(course_prices);
        const priceAmount = priceData?.price || 0;
        const currencyCode = priceData?.currency?.name || mainCurrencyCode;

        // Instructor data
        const instructorName =
          instructor?.instructor_translations?.[0]?.name ||
          instructor?.name ||
          '';
        const instructorAvatar = resolveUrl(
          instructor?.avatar || instructor?.instructor_image
        );

        const result = {
          id,
          title,
          image,
          instructor: {
            name: instructorName,
            avatar: instructorAvatar,
          },
          rating: rating?.toString() || '0',
          priceAmount,
          currencyCode,
          stripeId: priceData?.stripe_price_id,
        };

        return result;
      }
    );

    return processed;
  }, [bundleCourses, mainCurrencyCode]);

  // Calculate bundle pricing (if needed)
  const bundlePricing = useMemo(() => {
    if (!processedBundleCourses?.length) {
      return {
        originalPrice: 'US $0.00',
        discountPrice: 'US $0.00',
        discountPercentage: '0%',
      };
    }

    // Calculate total original price
    const totalOriginalPrice = processedBundleCourses.reduce(
      (sum: number, course: any) => sum + (course.priceAmount || 0),
      0
    );

    // For now, using static discount values - can be made dynamic later
    const discountPercentage = 90;
    const discountMultiplier = discountPercentage / 100;
    const totalDiscountPrice = totalOriginalPrice * (1 - discountMultiplier);

    const originalPrice = formatCurrency(totalOriginalPrice, mainCurrencyCode);
    const discountPrice = formatCurrency(totalDiscountPrice, mainCurrencyCode);

    return {
      originalPrice,
      discountPrice,
      discountPercentage: `${discountPercentage}%`,
    };
  }, [processedBundleCourses, mainCurrencyCode]);

  // Handle bundle purchase - call purchase bundle course API
  const handleCheckout = useCallback(async () => {
    try {
      setLoading(true);
      setShowPaymentError(false);
      setPaymentErrorMessage('');

      if (!processedBundleCourses?.length) {
        return;
      }

      // Get bundle course price IDs (stripe_price_id)
      const bundlePriceIds = processedBundleCourses
        .map((course: any) => course.stripeId)
        .filter(Boolean);

      if (!bundlePriceIds.length) {
        return;
      }

      const data = {
        selected_bundle_price_ids: bundlePriceIds,
        user_id: user?.id,
        domain: DOMAIN,
        final_url: courseData?.final_url || courseData?.slug,
        ...params,
      };

      // Use .then() and .catch() for better error handling
      await api.getAccess
        .purchaseBundleCourse({ data })
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
    processedBundleCourses,
    user?.id,
    courseData?.final_url,
    courseData?.slug,
    params,
    router,
  ]);

  // Handle decline bundle - redirect to upsale courses
  const handleDeclineBundle = useCallback(() => {
    window.location.href = routes.public.upsale_courses;
  }, []);

  const handleClosePaymentError = useCallback(() => {
    setShowPaymentError(false);
    setPaymentErrorMessage('');
    window.location.href = routes.public.complete_profile;
  }, []);

  return {
    // State
    isLoadingBundles,
    loading,
    isPaymentSuccess,
    isPaymentFailed,
    showPaymentError,
    paymentErrorMessage,

    // Data
    bundleCourses: processedBundleCourses,
    bundlePricing,

    // Actions
    handleCheckout,
    handleDeclineBundle,
    handleClosePaymentError,
  };
};

export default useBundles;
