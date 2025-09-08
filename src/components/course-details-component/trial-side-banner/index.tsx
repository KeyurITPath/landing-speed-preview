import { Box, Stack, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useTranslations } from 'next-intl';
import CustomButton from '@/shared/button';
import { SIDE_BANNER_IMAGE } from '@/assets/images';
import { useMemo } from 'react';
import Image from 'next/image';

const scrollAnimation = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(calc(-50%)); }
`;

const SIDE_BANNER_IMAGES = [
  SIDE_BANNER_IMAGE.sideBanner1,
  SIDE_BANNER_IMAGE.sideBanner2,
  SIDE_BANNER_IMAGE.sideBanner6,
  SIDE_BANNER_IMAGE.sideBanner3,
  SIDE_BANNER_IMAGE.sideBanner4,
  SIDE_BANNER_IMAGE.sideBanner8,
  SIDE_BANNER_IMAGE.sideBanner5,
  SIDE_BANNER_IMAGE.sideBanner9,
  SIDE_BANNER_IMAGE.sideBanner7,
];

const TrialSideBanner = ({ dashboardData }: any) => {
  const {
    transformDataForTrialSideBanner,
    startTrialSubmitForSideBanner,
    isStartTrialSubmitForSideBannerLoading: loading,
    BRAND_NAME: brand_name,
    isBecomeAMemberWithVerified,
  } = dashboardData;

  const t = useTranslations();
  const { title, description } = transformDataForTrialSideBanner || {};

  const quadruplicatedImages = useMemo(
    () => [
      ...SIDE_BANNER_IMAGES,
      ...SIDE_BANNER_IMAGES,
      ...SIDE_BANNER_IMAGES,
      ...SIDE_BANNER_IMAGES,
    ],
    []
  );

  const leftColumnImages = useMemo(
    () => quadruplicatedImages.filter((_, i) => i % 2 === 0),
    [quadruplicatedImages]
  );

  const rightColumnImages = useMemo(
    () => quadruplicatedImages.filter((_, i) => i % 2 !== 0),
    [quadruplicatedImages]
  );

  // Animation starts immediately on component mount
  const animationDuration = Math.max(40, SIDE_BANNER_IMAGES.length * 5);

  return (
    <Box px={{ xs: 2, sm: 0 }}>
      <Box
        sx={{
          width: '100%',
          background: 'linear-gradient(to bottom, #B14EFE, #6CC2FF, #304BE0)',
          px: 2,
          py: { xs: 2 },
          borderRadius: '14px',
        }}
      >
        <Stack alignItems='center' spacing={{ xs: 2, sm: 5 }}>
          <Typography
            sx={{
              fontSize: { xs: 28, sm: 24 },
              fontWeight: 600,
              color: 'white',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant='body1'
            dangerouslySetInnerHTML={{ __html: description }}
            sx={{
              fontSize: 16,
              fontWeight: 400,
              color: 'white',
            }}
          />

          <CustomButton
            color="common.black"
            sx={{
              width: { xs: '100%', sm: 'auto' },
              background: 'rgba(255, 255, 255, 1)',
              borderRadius: '8px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.14)',
              fontSize: 18,
              fontWeight: 500,
              textAlign: 'center',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.8)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.5)',
              },
            }}
            {...{ loading, disabled: !isBecomeAMemberWithVerified || loading }}
            onClick={startTrialSubmitForSideBanner}
          >
            {t('try_brand_name_courses', { brand_name })}
          </CustomButton>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflow: 'hidden',
              height: '500px',
              width: '100%',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflow: 'hidden',
                position: 'relative',
                willChange: 'transform',
                perspective: 1000,
                backfaceVisibility: 'hidden',
              }}
            >
              <Box
                sx={{
                  animation: `${scrollAnimation} ${animationDuration}s linear infinite`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'absolute',
                  width: '100%',
                  willChange: 'transform',
                  transform: 'translate3d(0,0,0)',
                  containIntrinsicSize: '230px 3000px',
                  contentVisibility: 'auto',
                }}
              >
                {leftColumnImages.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      src={item}
                      alt={`trial-banner-${index}`}
                      priority={index < 3}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      fetchPriority={index < 2 ? 'high' : 'auto'}
                      style={{
                        borderRadius: '14px',
                        width: '100%',
                        height: 'auto',
                        maxWidth: 230,
                        maxHeight: 250,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflow: 'hidden',
                position: 'relative',
                willChange: 'transform',
                perspective: 1000,
                backfaceVisibility: 'hidden',
              }}
            >
              <Box
                sx={{
                  animation: `${scrollAnimation} ${animationDuration + 5}s linear infinite`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'absolute',
                  width: '100%',
                  transform: 'translate3d(0, -10%, 0)',
                  willChange: 'transform',
                  containIntrinsicSize: '230px 3000px',
                  contentVisibility: 'auto',
                }}
              >
                {rightColumnImages.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      src={item}
                      alt={`trial-banner-alt-${index}`}
                      priority={index < 3}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      fetchPriority={index < 2 ? 'high' : 'auto'}
                      style={{
                        borderRadius: '14px',
                        width: '100%',
                        height: 'auto',
                        maxHeight: 250,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default TrialSideBanner;
