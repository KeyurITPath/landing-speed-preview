import { Box, Grid2, Stack, Typography } from '@mui/material';
import { IMAGES } from '@/assets/images';
import CustomButton from '@/shared/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMediaQuery } from '@mui/system';

const TopTrialBanner = ({
  transformDataForTrialBannerTopOfThePage,
  startFreeTrialSubmitForTopOfTheBanner,
  isStartFreeTrialSubmitForTopOfTheBannerLoading: loading,
}: any) => {
  const { title, trial_days, price } =
    transformDataForTrialBannerTopOfThePage || {};
  const t = useTranslations();
  const isMdDown = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  return (
    <Grid2 size={{ xs: 12 }}>
      <Box px={{ xs: 2, sm: 0 }}>
        <Box
          sx={{
            width: '100%',
            background: 'linear-gradient(to bottom, #B14EFE, #6CC2FF, #304BE0)',
            px: { xs: 2, sm: 4, xl: 6 },
            pt: { xs: 2, sm: 4 },
            pb: { xs: 0, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '14px',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: { xs: '-10px', sm: '5%', md: '5%' },
              bottom: 0,
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Image
              src={IMAGES.leftTrialBannerImage}
              alt={t('yoga_practitioner')}
              width={160} // base width for xs
              height={200} // just to keep aspect ratio (can be any)
              style={{
                width: '100%', // allows responsive resizing
                maxWidth: '160px', // matches xs
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              right: { xs: '-10px', sm: '5%', md: '5%' },
              bottom: 0,
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Image
              src={IMAGES.rightTrialBannerImage}
              alt={t('right_yoga_pose')}
              width={160}
              height={200}
              style={{
                width: '100%',
                maxWidth: '160px',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>
          <Stack alignItems='center' spacing={4}>
            <Stack
              alignItems='center'
              spacing={{ xs: 3, sm: 6 }}
              sx={{
                zIndex: 2,
                py: { xs: 2, sm: 0 },
                px: { xs: 0, sm: 2 },
              }}
              maxWidth={{ xs: 350, sm: 565 }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '24px', sm: '26px' },
                  fontWeight: 700,
                  color: 'white',
                  textAlign: { xs: 'left', sm: 'center' },
                  lineHeight: 1.2,
                }}
              >
                {title}
              </Typography>
            </Stack>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                justifyContent: { xs: 'space-between', md: 'center' },
              }}
            >
              <Stack spacing={2}>
                <CustomButton
                  sx={{
                    backgroundColor: '#fff',
                    color: '#0E0E0E !important',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.14)',
                    fontSize: { xs: '14px', sm: '16px' },
                    fontWeight: 600,
                    textAlign: 'center',
                    height: { xs: 'auto', sm: '45px' },
                    '&:hover': {
                      backgroundColor: '#f5f5f5 !important',
                    },
                    '&:disabled': {
                      backgroundColor: '#f5f5f5 !important',
                    },
                  }}
                  {...{ loading }}
                  onClick={startFreeTrialSubmitForTopOfTheBanner}
                >
                  {t('get_started_today')}
                </CustomButton>

                <Stack textAlign={'center'}>
                  <Typography
                    sx={{
                      fontSize: { xs: '12px', sm: '14px' },
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    {t('start_with_free_trial', { trial_days })}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '10px', sm: '12px' },
                      fontWeight: 400,
                      color: 'white',
                    }}
                  >
                    {t('then_price_per_month', { price })}
                  </Typography>
                </Stack>
              </Stack>
              {isMdDown ? (
                <Image
                  width={150}
                  height={350}
                  src={IMAGES.leftTrialBannerImage}
                  alt={t('yoga_practitioner')}
                  style={{
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              ) : null}
            </Box>
          </Stack>
        </Box>
      </Box>
    </Grid2>
  );
};

export default TopTrialBanner;
