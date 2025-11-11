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

  const countryCode = useMemo(() => {
    return cookies.get('country_code') || 'US';
  }, []);

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
              domain: DOMAIN,
            },
          }),
          new Promise(resolve => setTimeout(resolve, 1000)),
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
      ({ id, course_translation, course_prices }: any) => {
        const title = course_translation?.title;
        const image = resolveUrl(course_translation?.course_image);
        const { course } = course_translation;
        const { rating } =
          course?.landing_pages?.[0]?.landing_page_translations?.[0] || {};
        const { name: instructorName, profile_image: instructorAvatar } =
          course?.user || {};

        const getBundlePriceData = (course_prices: any) => {
          let found = course_prices?.find(
            ({ is_bundle_price, currency }: any) => {
              return (
                is_bundle_price &&
                currency?.name === mainCurrencyCode
              );
            }
          );

          if (!found) {
            found = course_prices?.find(
              ({ is_bundle_price, currency }: any) => {
                return (
                  is_bundle_price &&
                  currency?.name?.toLowerCase() === mainCurrencyCode?.toLowerCase()
                );
              }
            );
          }

          if (!found) {
            found = course_prices?.find(({ is_bundle_price }: any) => {
              return is_bundle_price;
            });
          }

          return found;
        };

        const getActualPriceData = (innerCoursePrices: any) => {
          let found = innerCoursePrices?.find(
            ({ isDefault, currency, language_id }: any) => {
              return (
                isDefault &&
                (currency?.name === mainCurrencyCode ||
                  !currency) &&
                language_id === effectiveLanguageId
              );
            }
          );

          if (!found) {
            found = innerCoursePrices?.find(
              ({ isDefault, currency }: any) => {
                return (
                  isDefault &&
                  currency?.name?.toLowerCase() === mainCurrencyCode?.toLowerCase()
                );
              }
            );
          }

          if (!found) {
            found = innerCoursePrices?.find(({ isDefault }: any) => {
              return isDefault;
            });
          }

          if (!found) {
            found = innerCoursePrices?.[0];
          }

          return found;
        };

        const bundlePriceData = getBundlePriceData(course_prices);
        const bundlePriceAmount = bundlePriceData?.price || 0;
        const currencyCode = bundlePriceData?.currency?.name || mainCurrencyCode;

        // Get actual price (original price)
        const actualPriceData = getActualPriceData(course?.course_prices);
        const actualPriceAmount = actualPriceData?.price || 0;

        const result = {
          id,
          title,
          image,
          instructor: {
            name: instructorName,
            avatar: instructorAvatar,
          },
          rating: rating?.toString() || '0',
          bundlePriceAmount,
          actualPriceAmount,
          currencyCode,
          stripeId: bundlePriceData?.stripe_price_id,
        };

        return result;
      }
    );

    return processed;
  }, [bundleCourses, mainCurrencyCode, effectiveLanguageId]);
  // Calculate bundle pricing
  const bundlePricing = useMemo(() => {
    if (!processedBundleCourses?.length) {
      return {
        originalPrice: formatCurrency(0, mainCurrencyCode),
        discountPrice: formatCurrency(0, mainCurrencyCode),
        discountPercentage: '0%',
      };
    }

    const totalActualPrice = processedBundleCourses.reduce(
      (sum: number, course: any) => sum + (course.actualPriceAmount || 0),
      0
    );

    const totalBundlePrice = processedBundleCourses.reduce(
      (sum: number, course: any) => sum + (course.bundlePriceAmount || 0),
      0
    );

    // Calculate discount percentage
    let discountPercentage = 0;
    if (totalActualPrice > 0) {
      const discountAmount = totalActualPrice - totalBundlePrice;
      discountPercentage = Math.round((discountAmount / totalActualPrice) * 100);
    }

    const formattedOriginalPrice = formatCurrency(totalActualPrice, mainCurrencyCode);
    const formattedDiscountPrice = formatCurrency(totalBundlePrice, mainCurrencyCode);

    const originalPrice = `${countryCode} ${formattedOriginalPrice}`;
    const discountPrice = `${countryCode} ${formattedDiscountPrice}`;

    return {
      originalPrice,
      discountPrice,
      discountPercentage: `${discountPercentage}%`,
    };
  }, [processedBundleCourses, mainCurrencyCode, countryCode]);

  const handleCheckout = useCallback(async () => {
    try {
      setLoading(true);
      setShowPaymentError(false);
      setPaymentErrorMessage('');

      if (!processedBundleCourses?.length) {
        return;
      }

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
