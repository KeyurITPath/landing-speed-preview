import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
  Skeleton,
} from '@mui/material';
import moment from 'moment/moment';
import { useTranslations, useLocale } from 'next-intl';
import { useMemo } from 'react';
import 'moment/locale/fr';
import 'moment/locale/es';
import VideoPlayer from '@/shared/video-player';
import VimeoPlayer from '@/components/vimeo-player';
import { ICONS } from '@/assets/icons';
import { hover, warning } from '@/theme/color';
import GetAccessWithReview from './components/access-plan-with-review';
import { getAccessClose, getAccessOpen } from '@/store/features/course.slice';
import CourseDetails from './components/course-details';
import AcademicPlan from './components/academic-plan';
import CourseAuthor from './components/course-author';
import PaymentSteps from './components/payment-steps';
import FAQ from './components/faq';
import CustomerReviews from './components/customer-reviews';
import GetAccessForm from './components/get-access-form';
import AccessPlan from './components/access-plan';
import SuccessPaymentPopup from '../../success-payment-popup';
import FailedPaymentPopup from '../../failed-payment-popup';
import { videoURL, formatCurrency } from '@/utils/helper';
import Image from 'next/image';
import { IMAGES } from '../../../assets/images';

const CommonLandingUIOneAndTwo = ({ vimeoSource, landingData }: any) => {
  const {
    data,
    course,
    videoContainerRef,
    videoPlayerOptions,
    isVimeoVideo,
    vimeoPlayerProps,
    pipMode,
    closePipMode,
    loading,
    getAccessState,
    dispatch,
    isPaymentSuccess,
    isPaymentFailed,
    BRAND_NAME,
    SUPPORT_MAIL,
    isMobile,
    isLoading,
  } = landingData;

  const t = useTranslations();
  const locale = useLocale();
  moment.locale(locale);
  const { is_video_processed, intro_thumbnail, intro } = vimeoSource;

  // Price calculation logic
  const prices = useMemo(() => {
    const clone = { ...course };
    if (clone?.course_prices?.length) {
      const currentDefaultPrice = clone?.course_prices?.[0];
      return {
        price: currentDefaultPrice?.price || 0,
        currency: currentDefaultPrice?.currency?.name || 'USD',
      };
    } else
      return {
        price: 0,
        currency: 'USD',
      };
  }, [course]);

  const withIncrease = useMemo(() => {
    const calculatedDiscount = 100 - course?.discount;
    const actualPrice = (prices.price / calculatedDiscount) * 100;

    return formatCurrency(actualPrice, prices.currency);
  }, [course?.discount, prices.currency, prices.price]);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: !data?.id || loading ? 'none' : 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth='md' sx={{ my: 3 }}>
          <Box
            ref={videoContainerRef}
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {/* Only render VideoPlayer when video is processed AND has valid video source */}
            {(intro || intro_thumbnail) && (
              <VideoPlayer
                {...{
                  is_video_processed,
                  intro_thumbnail,
                  intro,
                }}
                {...{ pipMode, closePipMode }}
              />
            )}
          </Box>

          {/* Rating Section */}
          <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <>
                  <Skeleton
                    variant='rectangular'
                    width={30}
                    height={30}
                    sx={{ borderRadius: 1 }}
                  />
                  <Skeleton variant='text' width={60} height={30} />
                  <Skeleton variant='text' width={100} height={30} />
                </>
              </Box>
            ) : isMobile ? (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Image
                  src={IMAGES.priceTag.src}
                  alt='price-tag'
                  width={30}
                  height={30}
                  style={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: 22,
                      lineHeight: 1.2,
                    }}
                  >
                    {formatCurrency(prices.price, prices.currency)}
                  </Typography>
                  {course?.discount && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#808080',
                          textDecoration: 'line-through',
                          fontSize: 14,
                        }}
                      >
                        {withIncrease || ''}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 14,
                          color: 'error.main',
                        }}
                      >
                        {`-${course?.discount}` || 0}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ) : (
              <>
                {' '}
                <Typography sx={{ color: 'primary.typography', fontSize: 16 }}>
                  <ICONS.STAR size={16} color={warning.main} />
                  {Number(data?.rating).toFixed(1) || 0} /
                </Typography>
                <Typography sx={{ color: 'success.main', fontSize: 16 }}>
                  {data?.amount_of_review || 0} {t('reviews')}
                </Typography>
              </>
            )}
          </Box>

          {/* Title and Description */}
          <Typography
            sx={{
              color: 'primary.typography',
              fontSize: 28,
              fontWeight: 500,
              mb: 2,
            }}
          >
            {data?.header || ''}
          </Typography>
          <Typography
            fontWeight={400}
            fontSize={16}
            color='primary.typography'
            dangerouslySetInnerHTML={{
              __html: data?.description || '',
            }}
            sx={{
              '& ul': {
                listStyleType: 'disc',
                marginLeft: 2,
                paddingLeft: 2,
              },
              '& li': {
                display: 'list-item',
              },
              whiteSpace: 'break-spaces',
            }}
          />

          {/* Course Details */}
          <Stack gap={2} sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ICONS.USER size={22} color={hover.secondary} />
              <Typography sx={{ fontSize: 16 }}>
                {t('author')}:{' '}
                <span style={{ fontWeight: 500 }}>
                  {course?.user?.name || '-'}
                </span>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ICONS.USERS size={22} color={hover.secondary} />
              <Typography sx={{ fontSize: 16 }}>
                <span style={{ fontWeight: 500 }}>
                  {data?.participants || 0}
                </span>{' '}
                {t('participants')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ICONS.CALENDAR size={22} color={hover.secondary} />
              <Typography sx={{ fontSize: 16 }}>
                {t('last_update')}:{' '}
                <span style={{ fontWeight: 500 }}>
                  {data?.last_update
                    ? moment(data?.last_update).format('MMMM YYYY')
                    : '-'}
                </span>
              </Typography>
            </Box>
          </Stack>
        </Container>
        <GetAccessWithReview {...{ landingData, getAccessOpen }} />
        <CourseDetails {...{ data }} />
        <AcademicPlan {...{ data }} />
        <CourseAuthor {...{ data, SUPPORT_MAIL }} />
        <PaymentSteps {...{ BRAND_NAME }} />
        <FAQ {...{ SUPPORT_MAIL }} />
        <CustomerReviews {...{ SUPPORT_MAIL }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center',
            position: 'fixed',
            bottom: 0,
            left: 0,
            zIndex: 10,
          }}
        >
          <AccessPlan {...{ landingData }} />
        </Box>
      </Box>

      {/* Get Access Form */}
      <GetAccessForm
        {...{ landingData }}
        open={getAccessState}
        onClose={() => {
          dispatch(getAccessClose());
        }}
      />

      {/* Payment popups */}
      <SuccessPaymentPopup open={isPaymentSuccess} />
      <FailedPaymentPopup open={isPaymentFailed} />
    </>
  );
};

export default CommonLandingUIOneAndTwo;
