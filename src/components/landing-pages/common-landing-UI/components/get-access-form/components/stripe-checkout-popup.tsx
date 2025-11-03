import React, { useState, useEffect, useRef } from 'react';
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
  utmData,
  queryParams,
  clientSecret,
  isLoading,
  error,
  activeLandingPage,
  registerUserData,
  subscriptionPrice,
  brandName,
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
      const queryString = new URLSearchParams(queryParams).toString();
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          confirmParams: {
            return_url: `${window.location.origin}${routes.public.upsale_courses}?payment=success${queryString ? `&${queryString}` : ''}`,
          },
          redirect: 'if_required',
        }
      );

      if (stripeError) {
        setIsProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        await pixel.initial_checkout({
          userId: registerUserData?.id,
          content_type: 'course',
          content_ids: [courseData?.id],
          total_amount: coursePrice?.price,
          value: coursePrice?.price,
          currency: coursePrice?.currency?.name,
          contents: [
            {
              id: courseData?.id,
              quantity: 1,
              item_price: coursePrice?.price,
            },
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

        // Close popup and redirect to email verification page
        dispatch(getStripeCheckoutClose());
        window.location.href = `${window.location.origin}${routes.public.upsale_courses}?payment=success${queryString ? `&${queryString}` : ''}`;
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
            sx={{ fontSize: { xs: '16px', sm: '18px' } }}
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
            {formattedPrice}
          </Typography>
        </Box>
        <Button
          type='submit'
          variant='contained'
          disabled={isLoading || isProcessing || !clientSecret}
          sx={{
            backgroundColor: '#49AE56',
            '&:hover': { backgroundColor: '#42994C' },
            minWidth: { xs: '100%', sm: 140 },
            height: { xs: 40, sm: 50 },
            fontSize: { xs: '16px', sm: '18px' },
            fontWeight: 400,
          }}
        >
          {isProcessing ? (
            <>
              <CircularProgress size={16} sx={{ mr: { xs: 0.5, sm: 1 } }} />
              {t('stripe_checkout.processing')}
            </>
          ) : (
            t('stripe_checkout.pay_now')
          )}
        </Button>
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
            price: formattedPrice,
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
  queryParams,
  landingData,
  ...props
}: any) {
  const t = useTranslations();
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const paymentIntentCreated = useRef(false);
  const { registerUserData } = useSelector(({ course }: any) => course);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  useEffect(() => {
    if (!open) {
      paymentIntentCreated.current = false;
      setClientSecret('');
      setError('');
    }
  }, [open]);
  const [fetchFreeTrialPopupsData] = useDispatchWithAbort(fetchFreeTrialPopups);
  const country_code = cookies.get('country_code') || '';

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!open) return;
      try {
        setIsLoading(true);
        setError('');
        const { data: landingPageData, activeLandingPage } = landingData;
        const { origin, pathname } = window.location;
        const queryString = new URLSearchParams(queryParams).toString();
        const success_url = `${origin}${routes.public.upsale_courses}?payment=success${queryString ? `&${queryString}` : ''}`;
        const cancel_url = `${origin}${pathname}?payment=failed`;

        const data = {
          stripe_price_id: coursePrice?.stripe_price_id,
          selected_upsale_price_ids: [],
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
        console.error('Payment intent creation failed:', err);
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
  }, [open, courseData, coursePrice?.stripe_price_id, clientSecret, queryParams, landingData, registerUserData?.id, params]);

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
        {t('stripe_checkout.complete_payment')}
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
                <Stack sx={{ color: 'error.main', fontSize: 60 }}>
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
              utmData={utmData}
              queryParams={queryParams}
              clientSecret={clientSecret}
              isLoading={isLoading}
              error={error}
              activeLandingPage={landingData?.activeLandingPage}
              registerUserData={registerUserData}
              subscriptionPrice={subscriptionPrice}
              brandName={brandName}
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
