import { Grid2, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { IMAGES } from '@/assets/images';
import { linearGradients } from '@/theme/color';
import { useTranslations } from 'next-intl';

const CourseCard = ({ no }: any) => {
  const t = useTranslations();
  return (
    <Stack sx={{ flexDirection: 'row', gap: { xs: 1, sm: 2 } }}>
      <Stack
        sx={{
          bgcolor: '#f5f6fd',
          p: { xs: 2, sm: 2.5 },
          borderRadius: 0.8,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'primaryNew.main',
        }}
      >
        <Grid2 container spacing={{ xs: 2, sm: 3 }} alignItems='center'>
          <Grid2 size={{ xs: 12, sm: 6, md: 6 }} order={{ xs: 1 }}>
            <Stack sx={{ gap: { xs: 2, sm: 3 } }}>
              <Stack
                sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}
              >
                <Stack
                  sx={{
                    minWidth: 40,
                    minHeight: 40,
                    background: linearGradients.primary,
                    borderRadius: 0.8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{ color: 'common.white' }}
                  >
                    {no}
                  </Typography>
                </Stack>
                <Typography variant='h5'>{t('danceTherapy')}</Typography>
              </Stack>

              <Typography variant='h6'>{t('danceManifest')}</Typography>
            </Stack>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 6 }} order={{ xs: 3, sm: 2 }}>
            <Image width={500} height={300} src={IMAGES.demoCourseBanner} alt='Testing' />
          </Grid2>
          <Grid2 size={12} order={{ xs: 2, sm: 3 }}>
            <Typography variant='body1'>
              {t('danceCourseDescription')}
            </Typography>
          </Grid2>
        </Grid2>
      </Stack>
    </Stack>
  );
};

export default CourseCard;
