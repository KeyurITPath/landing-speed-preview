import {
  Box,
  Container,
  Grid2,
  Stack,
  Typography
} from '@mui/material';
import { primaryNew } from '../../theme/color';
import NextImage from 'next/image';
import { GET_STARTED_IMAGE, IMAGES } from '@assets/images';
import { useTranslations } from 'next-intl';

const GetStartedSteps = () => {
  const GET_STARTED_STEPS = [
    {
      id: 1,
      title: 'get_started_steps.0.title',
      image: IMAGES.meditation,
      description: 'get_started_steps.0.description',
    },
    {
      id: 2,
      title: 'get_started_steps.1.title',
      image: IMAGES.laptopAccount,
      description: 'get_started_steps.1.description',
    },
    {
      id: 3,
      title: 'get_started_steps.2.title',
      image: IMAGES.bookClockOutline,
      description: 'get_started_steps.2.description',
    },
  ];
  const t = useTranslations();

  return (
    <Container maxWidth='lg'>
      <Stack
        spacing={{ xs: 2, sm: 6 }}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          textAlign: { sm: 'flex-start' },
        }}
      >
        <Typography variant='h4' sx={{ fontWeight: 500 }}>
          {t('easy_steps_to_get_started')}
        </Typography>

        <Grid2
          container
          spacing={2}
          sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}
        >
          <Grid2 size={{ xs: 12, sm: 5 }}>
            <NextImage
              src={GET_STARTED_IMAGE}
              alt='Get started'
              width={310} // required for NextImage
              height={420} // required for NextImage
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '420px',
                maxWidth: '310px',
                borderRadius: '10px',
                objectFit: 'cover', // mimic aspectRatio
                aspectRatio: '5 / 7', // if you want strict aspect ratio
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 7 }}>
            <Stack
              spacing={{ xs: 2, sm: 4 }}
              sx={{
                '& .step-item:nth-of-type(even)': {
                  flexDirection: { xs: 'row-reverse', sm: 'row-reverse' },
                },
                '& .step-item:nth-of-type(odd)': {
                  flexDirection: { xs: 'row', sm: 'row' },
                },
              }}
            >
              {GET_STARTED_STEPS?.map(
                ({ title, image, description }, index) => {
                  return (
                    <Stack
                      key={index}
                      className='step-item'
                      alignItems={{ xs: 'center' }}
                      flexDirection={'row'}
                      gap={{ xs: 1, sm: 2 }}
                    >
                      <Typography
                        variant='h5'
                        sx={{
                          color: '#E7EAFC',
                          minWidth: {
                            xs: '52px',
                            sm: '64px',
                            md: '124px',
                          },
                          fontWeight: 700,
                          fontSize: {
                            xs: '2rem',
                            sm: '2.5rem',
                            md: '3rem',
                          },
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </Typography>

                      <Stack
                        spacing={2}
                        direction='row'
                        alignItems={'center'}
                        sx={{
                          borderRadius: { xs: 1, sm: 2 },
                          backgroundColor: '#ffffff',
                          boxShadow: '10px 25px 100px 0px #002B6B1A',
                          p: { xs: 1, sm: 1.5, md: 2 },
                        }}
                      >
                        <Stack direction='row' spacing={2} alignItems='center'>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 4,
                              background: primaryNew.main,
                              color: 'common.white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: { xs: '50px', sm: '70px' },
                              width: { xs: '50px', sm: '70px' },
                            }}
                          >
                            <NextImage width={26} height={26}
                              loading='eager'
                              src={image}
                              alt={`Step ${index + 1}`}
                            />
                          </Box>
                        </Stack>
                        <Stack spacing={0.5}>
                          <Typography
                            fontSize={{
                              xs: '1rem',
                              sm: '1.2rem',
                              md: '1.5rem',
                            }}
                            fontWeight={500}
                          >
                            {t(title)}
                          </Typography>
                          <Typography
                            fontSize={{
                              xs: '12px',
                              sm: '0.775rem',
                              md: '1rem',
                            }}
                            color='#303030'
                            sx={{ ml: { xs: 0, sm: 7 } }}
                          >
                            {t(description)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  );
                }
              )}
            </Stack>
          </Grid2>
        </Grid2>
      </Stack>
    </Container>
  );
};

export default GetStartedSteps;
