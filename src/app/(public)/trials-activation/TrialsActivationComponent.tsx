'use client';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import useTrialActivation from './use-trial-activation';
import IntroductionToMembership from './components/introduction-to-membership';
import SuccessStories from './components/success-stories';
import OneTimeOpportunity from './components/one-time-opportunity';
import WhatYouGet from './components/what-you-get';
import Marquees from './components/marquees';
import Faqs from './components/faqs';
import CustomButton from '@/shared/button';
import LandingLayoutContainer from '@/shared/landing-layout-container';
import VideoPlayer from '@/shared/video-player';
import { formatCurrency, videoURL } from '@/utils/helper';
import { initial, linearGradients } from '@/theme/color';
import { OVERRIDE } from '@/theme/basic';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import SalesPopups from '@/components/sales-popups';

const TrialsActivationComponent = ({ domainDetails, country_code }: any) => {
  const {
    popupsState,
    popupsClose,
    isFreeTrial,
    setIsFreeTrial,
    loading,
    onSubmit,
    onPopupCancel,
    onPopupSuccess,
    handleWarningSuccess,
    setIsAllCancelled,
    BRAND_NAME,
    // COURSE_TITLE,
    popupsOpen,
    isMobile,
    continueToCourseButtonRef,
    isButtonHidden,
    monthlySubscriptionData,
    trialActivationData,
    trialActivationLoading,
  } = useTrialActivation({ domainDetails, country_code });

  const t = useTranslations();
  const pathname = usePathname();

  // Scroll to top when route/page is first entered
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const trialActivationDetails = Array.isArray(trialActivationData)
    ? trialActivationData[0]
    : {};

  const isVideoType = trialActivationDetails?.content_type === 'video';
  const isImageType = trialActivationDetails?.content_type === 'image';

  // const options = {
  //   autoplay: 'muted',
  //   controls: true,
  //   responsive: true,
  //   fluid: true,
  //   enableSmoothSeeking: true,
  //   loop: true,
  //   autoSetup: true,
  //   BigPlayButton: true,
  //   disablePictureInPicture: false,
  //   enableDocumentPictureInPicture: false,
  //   muted: true,
  //   ...(trialActivationDetails?.thumbnail && {
  //     poster: videoURL(trialActivationDetails?.thumbnail),
  //   }),
  //   controlBar: {
  //     pictureInPictureToggle: false,
  //   },
  //   sources: [
  //     {
  //       src:
  //         videoURL(trialActivationDetails?.video) ||
  //         'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  //       type: 'video/mp4',
  //     },
  //   ],
  // };

  const vimeoSource = {
    is_video_processed: true,
    intro:
      encodeURI(videoURL(trialActivationDetails?.video)) ||
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    intro_thumbnail: null,
  };

  const price = formatCurrency(
    monthlySubscriptionData?.subscription_plan_prices?.[0]?.amount || 0,
    monthlySubscriptionData?.subscription_plan_prices?.[0]?.currency?.name ||
      'USD'
  );

  return (
    <>
      <LandingLayoutContainer
        sx={{ maxWidth: 'auto', gap: { xs: 4, sm: 5 } }}
        containerSx={{ pt: { xs: 0, sm: 5 } }}
      >
        <Stack sx={{ mx: { xs: -2, sm: 0 }, gap: { sm: 2 } }}>
          <Stack
            sx={{
              px: 2,
              py: 0.8,
              alignItems: 'center',
              bgcolor: '#FFE0BC',
              borderRadius: { sm: 0.8 },
            }}
          >
            <Typography
              sx={{
                textAlign: 'center',
                color: '#000000',
                fontWeight: { xs: 500, sm: 600 },
                fontSize: { xs: 12, sm: 16 },
              }}
            >
              {t('keepPageOpen')}
            </Typography>
          </Stack>

          <Stack
            sx={{
              borderRadius: { sm: 0.8 },
              background: linearGradients.primary,
              alignItems: 'center',
            }}
          >
            <Stack
              sx={{
                maxWidth: 900,
                width: '100%',
                px: { xs: 2.5, sm: 2 },
                py: { xs: 2.5, sm: 4 },
                gap: { xs: 2, sm: 3 },
              }}
            >
              {trialActivationLoading && !isMobile ? (
                <Skeleton
                  variant='rectangular'
                  width='100%'
                  height='100%'
                  sx={{ maxHeight: 28, borderRadius: 1 }}
                />
              ) : isVideoType && !isMobile ? (
                <Typography
                  variant='h5'
                  sx={{
                    textAlign: 'center',
                    color: 'common.white',
                  }}
                >
                  {t('continueWatchVideo')}
                </Typography>
              ) : null}
              <Stack
                sx={{
                  borderRadius: 1.4,
                  overflow: 'hidden',
                  width: '100%',
                  ...(isImageType && { aspectRatio: '16/7' }),
                }}
              >
                {trialActivationLoading ? (
                  <Skeleton
                    variant='rectangular'
                    width='100%'
                    sx={{
                      height: { xs: 248, sm: 340, md: 490 },
                    }}
                  />
                ) : isVideoType ? (
                  <VideoPlayer
                    {...{
                      pipMode: false,
                      ...vimeoSource,
                    }}
                  />
                ) : isImageType && trialActivationDetails?.image ? (
                  <Image
                    loading='eager'
                    priority
                    src={videoURL(trialActivationDetails?.image) || ''}
                    alt='defaultBanner'
                  />
                ) : null}
              </Stack>

              <Stack sx={{ zIndex: 1 }}>
                <Stack
                  sx={{
                    bgcolor: 'common.white',
                    p: 2.5,
                    borderRadius: 1.4,
                    gap: 2.5,
                  }}
                >
                  <Stack sx={{ gap: 1 }}>
                    <FormControlLabel
                      sx={{ alignItems: 'start' }}
                      control={
                        <Checkbox
                          color='primaryNew'
                          name='isFreeAccess'
                          checked={isFreeTrial}
                          onChange={e => {
                            const isChecked = e.target.checked;
                            setIsFreeTrial(isChecked);
                            if (isChecked) {
                              setIsAllCancelled(false);
                            } else {
                              popupsOpen();
                            }
                          }}
                          sx={{ mt: -1.2 }}
                        />
                      }
                      label={
                        <Typography variant='body1' sx={{ fontWeight: 700 }}>
                          {t('freeAccessMessage')}
                        </Typography>
                      }
                    />
                    <Typography variant='body1'>
                      {t('subscriptionMessage', { price })}
                    </Typography>
                  </Stack>
                  <Typography variant='body1'>
                    {t('subscriptionAgreement')}
                  </Typography>
                  <CustomButton
                    {...{ loading }}
                    size='large'
                    type='submit'
                    onClick={
                      typeof onSubmit === 'function' ? onSubmit : undefined
                    }
                    sx={{ maxWidth: 280 }}
                    variant='gradient'
                    ref={continueToCourseButtonRef}
                  >
                    {t('continueToCourse')}
                  </CustomButton>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <LandingLayoutContainer
          containerSx={{ p: 0, pt: 0, pb: 0 }}
          sx={{ maxWidth: 900, gap: { xs: 4, sm: 5 } }}
        >
          <OneTimeOpportunity {...{ BRAND_NAME }} />
          {/* <PersonalGrowthPath {...{ BRAND_NAME, COURSE_TITLE }} /> */}
          <IntroductionToMembership
            {...{ BRAND_NAME, monthlySubscriptionData }}
          />
          <WhatYouGet {...{ BRAND_NAME }} />
        </LandingLayoutContainer>
        <Marquees />
        <LandingLayoutContainer
          containerSx={{ p: 0, pt: 0, pb: 0 }}
          sx={{ maxWidth: 900, gap: { xs: 4, sm: 5 } }}
        >
          <SuccessStories {...{ BRAND_NAME }} />
          <Faqs {...{ BRAND_NAME }} />

          {!isMobile ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                alignItems: 'center',
              }}
            >
              <CustomButton
                {...{ loading }}
                size='large'
                type='submit'
                onClick={onSubmit}
                sx={{ maxWidth: 280 }}
                variant='gradient'
              >
                {t('continueToCourse')}
              </CustomButton>
            </Box>
          ) : isButtonHidden ? (
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
              <Box
                sx={{
                  width: '100%',
                  ...OVERRIDE({}).FLEX,
                  boxShadow: {
                    xs: 'none',
                    sm: '0px -1px 3px 0px #0000001A',
                  },
                  background: {
                    xs: 'transparent',
                    sm: initial.white,
                  },
                  py: { xs: 2, sm: 2 },
                  px: { xs: 3, sm: 2 },
                  position: 'sticky',
                  zIndex: 10,
                  bottom: 0,
                  left: 0,
                }}
              >
                <CustomButton
                  {...{ loading }}
                  size='large'
                  type='submit'
                  sx={{
                    width: '100%',
                    minHeight: '58px',
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                  onClick={onSubmit}
                  variant='gradient'
                >
                  {t('continueToCourse')}
                </CustomButton>
              </Box>
            </Box>
          ) : null}
        </LandingLayoutContainer>
      </LandingLayoutContainer>

      {/* Sales popups */}
      <SalesPopups
        {...{ handleWarningSuccess, country_code }}
        open={popupsState}
        onClose={popupsClose}
        rootHandleCancel={onPopupCancel}
        rootHandleSuccess={onPopupSuccess}
        isMobile={isMobile}
        monthlySubscriptionData={monthlySubscriptionData}
      />
    </>
  );
};

export default TrialsActivationComponent;
