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
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { api } from '@/api';
import { getStripeCheckoutClose } from '@/store/features/course.slice';
import { pixel } from '@/utils/pixel';
import { isEmptyObject } from '@/utils/helper';
import { formatCurrency } from '@/utils/helper';
import { DOMAIN } from '../../../../../../utils/constants';
import { routes } from '../../../../../../utils/constants/routes';
import Link from 'next/link';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

// Styled component for terms links
const TermsLink = styled(Link)(() => ({
  color: 'black',
  textDecorationColor: 'black',
  ':hover': {
    opacity: 0.7,
  },
}));

// Inner form component that handles payment processing
const StripeInnerForm = ({
  onClose,
  courseData,
  user,
  utmData,
  queryParams,
  clientSecret,
  isLoading,
  error,
}: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const t = useTranslations();

  const [isProcessing, setIsProcessing] = useState(false);

  // Get course price for display
  const coursePrice = courseData?.course_prices?.[0];
  const formattedPrice = formatCurrency(
    coursePrice?.price,
    coursePrice?.currency?.name
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    try {
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          confirmParams: {
            return_url: `${window.location.origin}${window.location.pathname}?payment=success`,
          },
          redirect: 'if_required',
        }
      );

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        // Error will be handled by parent component
      } else if (paymentIntent.status === 'succeeded') {
        // Track successful payment
        await pixel.initial_checkout({
          userId: user?.id,
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

        // Close popup and redirect to upsell-courses page
        dispatch(getStripeCheckoutClose());
        const queryString = new URLSearchParams(queryParams).toString();
        window.location.href = `${window.location.origin}${routes.public.email_verification}?payment=success${queryString ? `&${queryString}` : ''}`;
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
      sx={{ width: '100%', minWidth: 400, mt: 1 }}
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
          <LockIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 0.2 }} />
          <Typography
            variant='body2'
            sx={{ color: 'text.secondary', fontSize: '12px', lineHeight: 1.4 }}
          >
            All transactions are secure and encrypted. Credit Card information
            is never stored.
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
            }}
          />
        </Box>
      )}

      {/* Payment summary - shown below card UI */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
        <Typography
          variant='h6'
          sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}
        >
          Total Today: {formattedPrice}
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          {courseData?.title || 'Course Access'}
        </Typography>
      </Box>

      {/* Loading state */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
          <Typography sx={{ ml: 1 }}>Initializing payment...</Typography>
        </Box>
      )}

      {/* Terms and conditions */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant='body2'
          sx={{ color: 'text.secondary', fontSize: '12px', lineHeight: 1.4 }}
        >
          By clicking &quot;Pay Now&quot;, you agree to pay {formattedPrice} for
          your results, and 7 days access to Eduell platform. Also you accept
          our{' '}
          <TermsLink
            href='/terms-of-service'
            target='_blank'
            rel='noopener noreferrer'
          >
            Terms of Use
          </TermsLink>
          ,{' '}
          <TermsLink
            href='/privacy-policy'
            target='_blank'
            rel='noopener noreferrer'
          >
            Privacy Policy
          </TermsLink>{' '}
          and subscription policy.
        </Typography>
        <Typography
          variant='body2'
          sx={{
            color: 'text.secondary',
            fontSize: '12px',
            lineHeight: 1.4,
            mt: 1,
          }}
        >
          After 7 days, your subscription will begin automatically and renew at
          $29.99 every 4 weeks until canceled. You may cancel anytime via your
          Eduelle dashboard or by contacting us at{' '}
          <Box
            component='span'
            sx={{
              color: '#1976d2',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            hello@eduelle.com
          </Box>
          .
        </Typography>
      </Box>

      <DialogActions sx={{ px: 0, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isLoading || isProcessing}
          variant='outlined'
          sx={{
            backgroundColor: '#4caf50',
            '&:hover': { backgroundColor: '#45a049' },
          }}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          variant='contained'
          disabled={isLoading || isProcessing || !clientSecret}
          sx={{
            backgroundColor: '#4caf50',
            '&:hover': { backgroundColor: '#45a049' },
          }}
        >
          {isProcessing ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </Button>
      </DialogActions>
    </Box>
  );
};

// Main popup component
export default function StripeCheckoutPopup({
  open,
  onClose,
  courseData,
  user,
  utmData,
  queryParams,
  landingData,
}: any) {
  const t = useTranslations();
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const paymentIntentCreated = useRef(false);

  // Get course price for display
  const coursePrice = courseData?.course_prices?.[0];

  // Reset payment intent when popup closes
  useEffect(() => {
    if (!open) {
      paymentIntentCreated.current = false;
      setClientSecret('');
      setError('');
    }
  }, [open]);

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!open) return; // Ensure API is only called when modal is open
      try {
        setIsLoading(true);
        setError('');

        // Generate URLs for success and cancel
        const { origin, pathname } = window.location;
        const queryString = new URLSearchParams(queryParams).toString();
        const success_url = `${origin}${routes.public.email_verification}?payment=success${queryString ? `&${queryString}` : ''}`;
        const cancel_url = `${origin}${pathname}?payment=failed`;

        // Create params object like in checkout-form.tsx
        const params: Record<string, string> = {};
        if (queryParams) {
          Object.entries(queryParams).forEach(([key, value]) => {
            params[key] = String(value);
          });
        }

        const { data: landingPageData } = landingData;
        const data = {
          stripe_price_id: coursePrice?.stripe_price_id,
          selected_upsale_price_ids: [],
          user_id: user?.id,
          success_url,
          cancel_url,
          domain: DOMAIN,
          final_url: landingPageData?.final_url,
          ...params,
        };

        console.log('Creating payment intent with data:', data);
        const response = await api.getAccess.orderCheckout({ data });
        console.log('response', response);

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
      user &&
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
    user,
    coursePrice?.stripe_price_id,
    clientSecret,
    queryParams,
    landingData,
  ]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#4caf50',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      aria-labelledby='stripe-dialog'
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle id='stripe-dialog' sx={{ pb: 1 }}>
        Complete Your Payment
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <StripeInnerForm
              onClose={onClose}
              courseData={courseData}
              user={user}
              utmData={utmData}
              queryParams={queryParams}
              clientSecret={clientSecret}
              isLoading={isLoading}
              error={error}
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
              <LockIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 0.2 }} />
              <Typography
                variant='body2'
                sx={{ color: 'text.secondary', fontSize: '12px', lineHeight: 1.4 }}
              >
                All transactions are secure and encrypted. Credit Card information
                is never stored.
              </Typography>
            </Box>

            {/* Payment form skeleton */}
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
            </Box>

            {/* Payment summary skeleton */}
            <Box sx={{ mb: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
              <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>

            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CircularProgress size={32} sx={{ mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                Setting up secure payment
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Please wait while we prepare your payment form...
              </Typography>
              {/* <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                This may take a moment on slower connections
              </Typography> */}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
