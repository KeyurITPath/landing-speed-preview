import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  styled,
  Skeleton,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { api } from '@/api';
import {
  getStripeCheckoutClose,
  clearRegisterUserData,
} from '@/store/features/course.slice';
import { pixel } from '@/utils/pixel';
import { isEmptyObject } from '@/utils/helper';
import { formatCurrency } from '@/utils/helper';
import { DOMAIN } from '../../../../../../utils/constants';
import { routes } from '../../../../../../utils/constants/routes';
import Link from 'next/link';
import CustomButton from '../../../../../../shared/button';
import { ICONS } from '../../../../../../assets/icons';
import useDispatchWithAbort from '../../../../../../hooks/use-dispatch-with-abort';
import { fetchFreeTrialPopups } from '../../../../../../store/features/popup.slice';
import cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import { AuthContext } from '@/context/auth-provider';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

// Styled component for terms links
const TermsLink = styled(Link)(() => ({
  color: '#304BE0',
  textDecorationColor: '#304BE0',
  ':hover': {
    opacity: 0.7,
  },
}));

// Inner form component that handles payment processing
const StripeInnerForm = ({
  courseData,
  clientSecret,
  isLoading,
  error,
  activeLandingPage,
  registerUserData,
  subscriptionPrice,
  brandName,
  utmData,
  params,
  selectedUpsaleCourses,
  setActiveForm,
  user,
  isCourseUpsaleCoursesAvailable,
  isCourseBundleCoursesAvailable,
}: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const t = useTranslations();
  const [isProcessing, setIsProcessing] = useState(false);

  const coursePrice = courseData?.course_prices?.[0];
  // Cleanup registerUserData when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearRegisterUserData());
    };
  }, [dispatch]);

  const upsaleContents = useMemo(() => {
    return (
      selectedUpsaleCourses?.map((upsale: any) => ({
        id: upsale.id,
        quantity: 1,
        item_price: upsale.priceAmount,
      })) || []
    );
  }, [selectedUpsaleCourses]);

  const totalAmount = useMemo(() => {
    return (
      (coursePrice?.price || 0) +
      (selectedUpsaleCourses?.reduce(
        (sum: number, upsale: any) => sum + (upsale.priceAmount || 0),
        0
      ) || 0)
    );
  }, [coursePrice?.price, selectedUpsaleCourses]);

  const formattedPrice = formatCurrency(
    coursePrice?.price,
    coursePrice?.currency?.name
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    // Check if elements are complete before processing
    const { error: elementsError } = await elements.submit();
    if (elementsError) {
      return;
    }

    setIsProcessing(true);

    try {
      const queryString = new URLSearchParams(params).toString();
      const { origin, pathname } = window.location;

      let returnUrl = '';
      if (user?.is_verified) {
        returnUrl = `${origin}${pathname}?payment=success`;
      } else {
        if (activeLandingPage?.name === 'landing2') {
          const hasPurchasedUpsales = selectedUpsaleCourses?.length > 0;
          if (hasPurchasedUpsales) {
            returnUrl = `${origin}${routes.public.complete_profile}?payment=success${queryString ? `&${queryString}` : ''}`;
          } else if (isCourseBundleCoursesAvailable) {
            returnUrl = `${origin}${routes.public.bundles}?payment=success${queryString ? `&${queryString}` : ''}`;
          } else {
            returnUrl = `${origin}${routes.public.complete_profile}?payment=success${queryString ? `&${queryString}` : ''}`;
          }
        } else if (
          isCourseBundleCoursesAvailable &&
          activeLandingPage?.name === 'landing1'
        ) {
          returnUrl = `${origin}${routes.public.bundles}?payment=success${queryString ? `&${queryString}` : ''}`;
        } else if (isCourseUpsaleCoursesAvailable) {
          returnUrl = `${origin}${routes.public.upsale_courses}?payment=success${queryString ? `&${queryString}` : ''}`;
        } else {
          returnUrl = `${origin}${routes.public.complete_profile}?payment=success${queryString ? `&${queryString}` : ''}`;
        }
      }
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          confirmParams: {
            return_url: returnUrl,
          },
          redirect: 'if_required',
        }
      );

      if (stripeError) {
        if (!user?.is_verified) {
          cookies.remove('onboarding_redirection_url', { path: '/' });
        }
        setIsProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        if (!user?.is_verified) {
          cookies.set(
            'onboarding_redirection_url',
            routes.public.complete_profile,
            {
              expires: 7,
              path: '/',
            }
          );
        }
        // Clear selected upsale IDs cookie after successful payment
        cookies.remove('selectedUpsaleIds');
        await pixel.initial_checkout({
          userId: registerUserData?.id,
          content_type: 'course',
          content_ids: [
            courseData?.id,
            ...(selectedUpsaleCourses?.map((upsale: any) => upsale.id) || []),
          ],
          total_amount: totalAmount,
          value: totalAmount,
          currency: coursePrice?.currency?.name,
          contents: [
            {
              id: courseData?.id,
              quantity: 1,
              item_price: coursePrice?.price,
            },
            ...upsaleContents,
          ],
          ...(!isEmptyObject(utmData) ? { utmData } : {}),
        });

        // Store course data in cookie before redirecting to ensure upsale page has all required data
        cookies.set(
          'course_data',
          JSON.stringify({
            id: courseData?.course?.id || courseData?.id,
            slug: courseData?.slug || courseData?.final_url,
            course_title:
              courseData?.course_translations?.[0]?.title || courseData?.title,
            landing_page: activeLandingPage,
            landing_page_name: activeLandingPage,
            currency_id: coursePrice?.currency?.id,
            currency_name: coursePrice?.currency?.name,
            language_id:
              courseData?.language_id || registerUserData?.language_id,
          })
        );

        setTimeout(() => {
          setActiveForm('');
          dispatch(getStripeCheckoutClose());

          let redirectUrl = '';
          if (user?.is_verified) {
            redirectUrl = `${origin}${pathname}?payment=success`;
            cookies.remove('onboarding_redirection_url', { path: '/' });
          } else {
            if (activeLandingPage?.name === 'landing2') {
              const hasPurchasedUpsales = selectedUpsaleCourses?.length > 0;
              if (hasPurchasedUpsales) {
                redirectUrl = `${origin}${routes.public.complete_profile}?payment=success${queryString ? `&${queryString}` : ''}`;
              } else if (isCourseBundleCoursesAvailable) {
                redirectUrl = `${origin}${routes.public.bundles}?payment=success${queryString ? `&${queryString}` : ''}`;
              } else {
                redirectUrl = `${origin}${routes.public.complete_profile}?payment=success${queryString ? `&${queryString}` : ''}`;
              }
            } else if (
              isCourseBundleCoursesAvailable &&
              activeLandingPage?.name === 'landing1'
            ) {
              redirectUrl = `${origin}${routes.public.bundles}?payment=success${queryString ? `&${queryString}` : ''}`;
            } else if (isCourseUpsaleCoursesAvailable) {
              redirectUrl = `${origin}${routes.public.upsale_courses}?payment=success${queryString ? `&${queryString}` : ''}`;
            } else {
              redirectUrl = `${origin}${routes.public.complete_profile}?payment=success${queryString ? `&${queryString}` : ''}`;
            }
          }
          window.location.href = redirectUrl;
        }, 2000);
      }
    } catch (err) {
      console.error('Payment confirmation failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ width: '100%', minWidth: { xs: '100%', sm: 400 }, mt: 1 }}
    >
      {/* Security message */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          p: 1,
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
        }}
      >
        <LockIcon
          sx={{
            fontSize: 16,
            mr: 1,
            color: 'text.secondary',
            alignSelf: 'flex-start',
            mt: 0.2,
          }}
        />
        <Typography
          variant='body2'
          sx={{ color: 'text.secondary', fontSize: '12px', lineHeight: 1.4 }}
        >
          {t('stripe_checkout.secure_transaction')}
        </Typography>
      </Box>

      {/* Error message */}
      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stripe PaymentElement */}
      {clientSecret && (
        <Box sx={{ mb: 2 }}>
          <PaymentElement
            options={{
              layout: 'tabs',
              terms: {
                card: 'never',
                applePay: 'never',
                googlePay: 'never',
                paypal: 'never',
                ideal: 'never',
                auBecsDebit: 'never',
                usBankAccount: 'never',
                bancontact: 'never',
                sepaDebit: 'never',
                sofort: 'never',
                cashapp: 'never',
              },
            }}
          />
        </Box>
      )}

      {/* Payment summary - updated layout to match second image */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box
          sx={{
            backgroundColor: '#F5F7FF',
            padding: '12px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexDirection: 'row',
            minWidth: { xs: '100%', sm: 'auto' },
          }}
        >
          <Typography
            variant='subtitle1'
            sx={{ fontSize: { xs: '14px', sm: '16px' } }}
          >
            {t('stripe_checkout.total_today')}
          </Typography>
          <Typography
            variant='subtitle1'
            sx={{
              fontWeight: 700,
              color: '#304BE0',
              fontSize: { xs: '16px', sm: '20px' },
            }}
          >
            {formatCurrency(totalAmount, coursePrice?.currency?.name)}
          </Typography>
        </Box>
        <CustomButton
          {...{
            loading: isProcessing,
            disabled: isLoading || isProcessing || !clientSecret,
          }}
          size='large'
          type='submit'
          sx={{
            minWidth: { xs: '100%', sm: 140 },
            height: { xs: '100%', sm: 50 },
          }}
        >
          {isProcessing
            ? t('stripe_checkout.processing')
            : t('stripe_checkout.pay_now')}
        </CustomButton>
      </Box>

      {/* Loading state */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
          <Typography sx={{ ml: 1 }}>
            {t('stripe_checkout.initializing_payment')}
          </Typography>
        </Box>
      )}

      {/* Terms and conditions */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant='caption'
          sx={{ color: '#747474', fontSize: { xs: '11px', sm: '12px' } }}
        >
          {t.rich('stripe_checkout.payment_agreement', {
            price: formatCurrency(totalAmount, coursePrice?.currency?.name),
            domain: brandName,
            terms: chunks => (
              <TermsLink
                href='/terms-of-service'
                target='_blank'
                rel='noopener noreferrer'
              >
                {chunks}
              </TermsLink>
            ),
            privacy: chunks => (
              <TermsLink
                href='/privacy-policy'
                target='_blank'
                rel='noopener noreferrer'
              >
                {chunks}
              </TermsLink>
            ),
          })}
        </Typography>{' '}
        <Typography
          variant='caption'
          sx={{ color: '#747474', fontSize: { xs: '11px', sm: '12px' } }}
        >
          {t.rich('stripe_checkout.subscription_renewal', {
            price: subscriptionPrice,
            domain: brandName,
            email: chunks => (
              <a
                href='mailto:support@eduelle.com'
                style={{
                  color: '#304BE0',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                {chunks}
              </a>
            ),
          })}
        </Typography>
      </Box>
    </Box>
  );
};

// Main popup component
export default function StripeCheckoutPopup({
  open,
  onClose,
  courseData,
  utmData,
  landingData,
  setActiveForm,
  ...props
}: any) {
  const { user } = useContext(AuthContext);
  const t = useTranslations();
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const paymentIntentCreated = useRef(false);
  const { registerUserData, upSaleCourses } = useSelector(
    ({ course }: any) => course
  );

  const { data: monthlySubscriptionData } = useSelector(
    ({ popup }: any) => popup?.monthlySubscription
  );

  // Get course price for display
  const coursePrice = courseData?.course_prices?.[0];
  const searchParams = useSearchParams();

  const subscriptionPrice = formatCurrency(
    monthlySubscriptionData?.subscription_plan_prices?.[0]?.amount,
    monthlySubscriptionData?.subscription_plan_prices?.[0]?.currency?.name
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const brandName = landingData?.BRAND_NAME || '';
  const { data: landingPageData, activeLandingPage } = landingData;

  const { currency } = useSelector(({ defaults }: any) => defaults);
  const mainCurrencyCode = currency.code;

  const { bundleCourses } = useSelector(({ course }: any) => course);

  const [fetchFreeTrialPopupsData] = useDispatchWithAbort(fetchFreeTrialPopups);

  const country_code = cookies.get('country_code') || '';

  const isCourseUpsaleCoursesAvailable = useMemo(() => {
    return Boolean(upSaleCourses?.length > 0);
  }, [upSaleCourses?.length]);

  const isCourseBundleCoursesAvailable = useMemo(() => {
    return Boolean(bundleCourses?.length > 0);
  }, [bundleCourses?.length]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  // Get selected upsale courses with full data (for landing2)
  const [selectedUpsaleCourses, setSelectedUpsaleCourses] = useState<any[]>([]);
  useEffect(() => {
    if (!open) return;

    try {
      const storedUpsaleIds = cookies.get('selectedUpsaleIds');
      if (!storedUpsaleIds || !upSaleCourses || upSaleCourses.length === 0) {
        setSelectedUpsaleCourses([]);
        return;
      }

      const selectedIds = JSON.parse(storedUpsaleIds);

      const courses = upSaleCourses
        .map((course: any) => {
          const priceData = course.course_prices?.find(
            ({ is_upsale_price, currency, stripe_price_id }: any) =>
              is_upsale_price &&
              currency?.name === mainCurrencyCode &&
              selectedIds.includes(stripe_price_id)
          );

          if (!priceData) return null;

          return {
            id: course.id,
            priceAmount: priceData?.price || 0,
            stripeId: priceData?.stripe_price_id,
          };
        })
        .filter((item: any) => item !== null);

      setSelectedUpsaleCourses(courses);
    } catch (e) {
      setSelectedUpsaleCourses([]);
    }
  }, [upSaleCourses, mainCurrencyCode, open]);

  useEffect(() => {
    if (!open) {
      paymentIntentCreated.current = false;
      setClientSecret('');
      setError('');
      // Don't remove cookie here - keep it for when user returns
    }
  }, [open]);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!open) return;
      try {
        setIsLoading(true);
        setError('');
        const { origin, pathname } = window.location;
        const queryString = new URLSearchParams(params).toString();
        let success_url = '';
        if (activeLandingPage?.name === 'landing2') {
          const hasPurchasedUpsales = selectedUpsaleCourses?.length > 0;
          if (hasPurchasedUpsales) {
            success_url = `${origin}${routes.public.complete_profile}?payment=success${queryString ? `&${queryString}` : ''}`;
          } else if (isCourseBundleCoursesAvailable) {
            success_url = `${origin}${routes.public.bundles}?payment=success${queryString ? `&${queryString}` : ''}`;
          } else {
            success_url = `${origin}${routes.public.complete_profile}?payment=success${queryString ? `&${queryString}` : ''}`;
          }
        } else if (
          isCourseBundleCoursesAvailable &&
          activeLandingPage?.name === 'landing1'
        ) {
          success_url = `${origin}${routes.public.bundles}?payment=success${queryString ? `&${queryString}` : ''}`;
        } else if (isCourseUpsaleCoursesAvailable) {
          success_url = `${origin}${routes.public.upsale_courses}?payment=success${queryString ? `&${queryString}` : ''}`;
        } else {
          success_url = `${origin}${routes.public.complete_profile}?payment=success${queryString ? `&${queryString}` : ''}`;
        }

        const cancel_url = `${origin}${pathname}?payment=failed`;

        // Get selected upsale IDs from cookies (for landing2)
        let selectedUpsaleIds = [];
        try {
          const storedUpsaleIds = cookies.get('selectedUpsaleIds');
          if (storedUpsaleIds) {
            selectedUpsaleIds = JSON.parse(storedUpsaleIds);
          }
        } catch (e) {
          console.error('Failed to parse selectedUpsaleIds:', e);
        }

        const data = {
          stripe_price_id: coursePrice?.stripe_price_id,
          selected_upsale_price_ids: selectedUpsaleIds || [],
          user_id: registerUserData?.id,
          success_url,
          cancel_url,
          domain: DOMAIN,
          final_url: landingPageData?.final_url,
          ...params,
        };

        const response = await api.getAccess.orderCheckout({ data });
        if (response?.data?.data?.clientSecret) {
          setClientSecret(response.data.data.clientSecret);
        } else {
          setError('Failed to initialize payment. Please try again.');
        }
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (
      open &&
      courseData &&
      registerUserData?.id &&
      coursePrice?.stripe_price_id &&
      !clientSecret &&
      !paymentIntentCreated.current
    ) {
      paymentIntentCreated.current = true;
      createPaymentIntent();
    }
  }, [
    open,
    courseData,
    coursePrice?.stripe_price_id,
    clientSecret,
    registerUserData?.id,
    params,
    landingPageData?.final_url,
    registerUserData,
    activeLandingPage?.name,
    isCourseUpsaleCoursesAvailable,
    isCourseBundleCoursesAvailable,
    selectedUpsaleCourses?.length,
  ]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#4caf50',
        fontFamily: '"Rubik", sans-serif',
        borderRadius: '8px',
        fontSizeBase: isMobile ? '12px' : '14px', // Base font size
        fontSizeSm: isMobile ? '12px' : '14px', // Small text
        fontSizeXs: isMobile ? '12px' : '14px', // Extra small text
        spacingUnit: isMobile ? '4px' : '6px',
      },
    },
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

  return (
    <Dialog
      open={open}
      onClose={() => {}} // Prevent closing on backdrop click
      fullWidth
      maxWidth='sm'
      scroll='body'
      aria-labelledby='stripe-dialog'
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 2 },
          m: { xs: 0, sm: '50px' },
          width: { xs: '100%', sm: 'calc(100% - 100px)' },
          maxWidth: { xs: '100% !important', sm: '600px !important' },
          position: 'relative',
        },
      }}
      sx={{ bgcolor: 'common.black' }}
      {...props}
    >
      <DialogTitle
        id='stripe-dialog'
        sx={{ pb: 1, position: 'relative', textAlign: 'center' }}
      >
        {!error && t('stripe_checkout.complete_payment')}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#CD4141',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error ? (
          <>
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Box sx={{ mb: 3 }}>
                <Stack
                  sx={{
                    color: 'error.main',
                    fontSize: 60,
                    alignItems: 'center',
                  }}
                >
                  <ICONS.CloseCircle />
                </Stack>
              </Box>
              <Typography
                variant='h6'
                sx={{ mb: 1, color: 'text.primary', fontWeight: 600 }}
              >
                {t('stripe_checkout.payment_setup_failed')}
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  color: 'text.secondary',
                  maxWidth: 300,
                  margin: '0 auto',
                }}
              >
                {t('stripe_checkout.payment_setup_error')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <CustomButton
                onClick={onClose}
                variant='contained'
                color='secondary'
                sx={{ minWidth: 100 }}
              >
                {t('close')}
              </CustomButton>
            </Box>
          </>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <StripeInnerForm
              onClose={onClose}
              courseData={courseData}
              clientSecret={clientSecret}
              isLoading={isLoading}
              error={error}
              activeLandingPage={activeLandingPage}
              registerUserData={registerUserData}
              subscriptionPrice={subscriptionPrice}
              brandName={brandName}
              utmData={utmData}
              user={user}
              params={params}
              selectedUpsaleCourses={selectedUpsaleCourses}
              setActiveForm={setActiveForm}
              isCourseUpsaleCoursesAvailable={isCourseUpsaleCoursesAvailable}
              isCourseBundleCoursesAvailable={isCourseBundleCoursesAvailable}
            />
          </Elements>
        ) : (
          <Box sx={{ py: 2 }}>
            {/* Security message skeleton */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                p: 1,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
              }}
            >
              <LockIcon
                sx={{
                  fontSize: 16,
                  mr: 1,
                  color: 'text.secondary',
                  alignSelf: 'flex-start',
                  mt: 0.2,
                }}
              />
              <Typography
                variant='body2'
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '10px', sm: '12px' },
                  lineHeight: 1.4,
                }}
              >
                {t('stripe_checkout.secure_transaction')}
              </Typography>
            </Box>

            {/* Payment form skeleton */}
            <Box sx={{ mb: 2 }}>
              <Skeleton
                variant='rectangular'
                height={56}
                sx={{ mb: 2, borderRadius: 1 }}
              />
              <Skeleton
                variant='rectangular'
                height={56}
                sx={{ mb: 2, borderRadius: 1 }}
              />
              <Skeleton
                variant='rectangular'
                height={56}
                sx={{ mb: 2, borderRadius: 1 }}
              />
            </Box>

            {/* Payment summary skeleton */}
            <Box
              sx={{ mb: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}
            >
              <Skeleton variant='text' width='60%' height={24} sx={{ mb: 1 }} />
              <Skeleton variant='text' width='40%' height={20} />
            </Box>

            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CircularProgress size={32} sx={{ mb: 2 }} />
              <Typography variant='h6' sx={{ mb: 1, fontWeight: 500 }}>
                {t('stripe_checkout.setting_up_payment')}
              </Typography>
              <Typography
                variant='body2'
                sx={{ color: 'text.secondary', mb: 2 }}
              >
                {t('stripe_checkout.preparing_form')}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
