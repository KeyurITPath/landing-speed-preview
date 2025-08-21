import {
  Box,
  Container,
  Grid2,
  Stack,
  Typography
} from '@mui/material';
import CustomButton from '@shared/button';
import { AUTHOR_URL } from '@utils/constants';
import { useSelector } from 'react-redux';
import { BECOME_AUTHOR_IMAGES } from '@assets/images';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const BecomeAuthor = ({ domainDetails }: any) => {
  const t = useTranslations()

  const BECOME_AUTHORS = [
    BECOME_AUTHOR_IMAGES.becomeAuthor1,
    BECOME_AUTHOR_IMAGES.becomeAuthor2,
    BECOME_AUTHOR_IMAGES.becomeAuthor3,
  ];

  const DOMAIN_DETAILS = {
    BRAND_NAME: domainDetails?.data?.domain_detail?.brand_name || '',
    SUPPORT_MAIL: domainDetails?.data?.domain_detail?.email || '',
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: {
          sm: 'primary.background',
        },
        borderTopRightRadius: {
          sm: '200px',
          md: '400px',
        },
        py: { xs: 2, md: 6 },
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        marginBottom: { xs: '32px !important', sm: '0px !important' },
      }}
      id='about'
    >
      <Container maxWidth='lg' component={Grid2} container>
        <Grid2 size={{ xs: 12 }}>
          <Grid2
            container
            spacing={2}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
            }}
          >
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 7 }}>
                  <Image
                    src={BECOME_AUTHORS[0]}
                    alt='Become Author'
                    width={320}
                    height={380}
                    style={{
                      aspectRatio: '5/6',
                      width: '100%',
                      height: '100%',
                      maxWidth: '320px',
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 5 }}>
                  <Stack spacing={2}>
                    <Image
                      src={BECOME_AUTHORS[1]}
                      alt='Become Author'
                      width={200}
                       height={180}
                      style={{
                        aspectRatio: '10/9',
                        width: '100%',
                        height: '100%',
                        maxWidth: '200px',
                      }}
                    />
                    <Image
                      src={BECOME_AUTHORS[2]}
                      alt='Become Author'
                      width={200}
                      height={180}
                      style={{
                        aspectRatio: '10/9',
                        width: '100%',
                        height: '100%',
                        maxWidth: '200px',
                      }}
                    />
                  </Stack>
                </Grid2>
              </Grid2>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Stack
                spacing={3}
                pl={{ xs: 0, sm: 3, md: 5 }}
                mt={{ xs: 2, md: 3 }}
                maxWidth={{ xs: '100%', sm: '400px' }}
                mx={{ xs: 'auto', sm: 0 }}
              >
                <Typography variant='h4' fontWeight={500}>
                  {t('become_an_author')}
                </Typography>
                <Typography sx={{ xs: 14, sm: 16 }}>
                  {t.rich('join_brand', {
                    brand_name: DOMAIN_DETAILS.BRAND_NAME,
                    span: chunk => (
                      <span style={{ color: '#304BE0' }}>{chunk}</span>
                    ),
                  })}
                </Typography>
                <Typography sx={{ xs: 14, sm: 16 }}>
                  {t.rich('learn_from_creatives', {
                    brand_name: DOMAIN_DETAILS.BRAND_NAME,
                  })}
                </Typography>

                <Stack
                  sx={{
                    display: 'flex',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                  gap={{ xs: 2, sm: 4 }}
                >
                  <CustomButton
                    variant='gradient'
                    size={'medium'}
                    sx={{
                      borderRadius: '8px',
                      fontSize: { xs: '14px', sm: '16px' },
                    }}
                    onClick={() => {
                      window.location.href = 'https://authors.edzen.org/';
                    }}
                  >
                    {t('teach_course')}
                  </CustomButton>
                  <CustomButton
                    variant='gradient'
                    size={'medium'}
                    sx={{
                      borderRadius: '8px',
                      fontSize: { xs: '14px', sm: '16px' },
                    }}
                    onClick={() => {
                      window.open(AUTHOR_URL, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    {t('author_login')}
                  </CustomButton>
                </Stack>
              </Stack>
            </Grid2>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default BecomeAuthor;
