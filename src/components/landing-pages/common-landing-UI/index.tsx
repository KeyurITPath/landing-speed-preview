import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import moment from 'moment/moment';
import { useTranslations, useLocale } from 'next-intl';
import 'moment/locale/fr';
import 'moment/locale/es';
import VideoPlayer from '@/shared/video-player';
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
import { videoURL } from '@/utils/helper';
import Image from 'next/image';

const CommonLandingUIOneAndTwo = ({ landingData }: any) => {
  const {
    data,
    course,
    videoContainerRef,
    videoPlayerOptions,
    pipMode,
    closePipMode,
    loading,
    getAccessState,
    dispatch,
    isPaymentSuccess,
    isPaymentFailed,
    BRAND_NAME,
    SUPPORT_MAIL,
  } = landingData;

  const t = useTranslations();
  const locale = useLocale();
  moment.locale(locale);
  const { is_video_processed } = data;

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
        <Container maxWidth='md' sx={{ my: 6 }}>
          {!is_video_processed ? (
            <Typography
              variant='body1'
              fontWeight={500}
              sx={{
                textAlign: 'right',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.6 },
                  '100%': { opacity: 1 },
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <CircularProgress size={16} thickness={6} />
              {t('video_processing')}
            </Typography>
          ) : null}
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
            {/* Show poster when video is not processed OR data is still loading */}
            {(!is_video_processed || !videoPlayerOptions?.sources?.[0]?.src) &&
              data?.intro_thumbnail && (
                <div
                  style={{
                    width: '100%',
                    height: '480px',
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#000',
                  }}
                >
                  <Image
                    loading='eager'
                    src={encodeURI(videoURL(data?.intro_thumbnail))}
                    alt='Video processing poster'
                    fill
                    sizes='100vw'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              )}

            {/* Only render VideoPlayer when video is processed AND has valid video source */}
            {is_video_processed && videoPlayerOptions?.sources?.[0]?.src && (
              <VideoPlayer
                options={{
                  ...videoPlayerOptions,
                  poster: data?.intro_thumbnail
                    ? videoURL(data?.intro_thumbnail)
                    : '',
                }}
                isVideoProcessed={is_video_processed}
                {...{ pipMode, closePipMode }}
              />
            )}
          </Box>

          {/* Rating Section */}
          <Box sx={{ my: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: 'primary.typography', fontSize: 16 }}>
              <ICONS.STAR size={16} color={warning.main} />{' '}
              {Number(data?.rating).toFixed(1) || 0} /
            </Typography>
            <Typography sx={{ color: 'success.main', fontSize: 16 }}>
              {data?.amount_of_review || 0} {t('reviews')}
            </Typography>
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
