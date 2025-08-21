import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import CustomButton from '@shared/button';
// import CustomButton from '../../../../shared/button';
// import { Trans, useTranslation } from 'react-i18next';
// import { URLS } from '../../../../constant/urls';
// import { useEffect, useState, useRef, useMemo } from 'react';
// import { scrollToSection } from '../../../../assets/utils/function';
import { scrollToSection } from '@utils/helper';
// import { useSelector } from 'react-redux';
import { JOIN_COURSE_IMAGES, MEMBER_AVATAR_IMAGES } from '../../assets/images';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { routes } from '../../utils/constants/routes';
import { useMemo } from 'react';

// import useLocation from '../../../../hooks/use-location';

const scrollAnimation = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(calc(-50%)); }
`;

const JOIN_COURSES = [
  JOIN_COURSE_IMAGES.joinCourse1,
  JOIN_COURSE_IMAGES.joinCourse2,
  JOIN_COURSE_IMAGES.joinCourse3,
  JOIN_COURSE_IMAGES.joinCourse4,
  JOIN_COURSE_IMAGES.joinCourse5,
  JOIN_COURSE_IMAGES.joinCourse6,
];

const MEMBER_AVATARS = [
  MEMBER_AVATAR_IMAGES.memberAvatar1,
  MEMBER_AVATAR_IMAGES.memberAvatar2,
  MEMBER_AVATAR_IMAGES.memberAvatar3,
  MEMBER_AVATAR_IMAGES.memberAvatar4,
  MEMBER_AVATAR_IMAGES.memberAvatar5,
];

const JoinCourse = ({ domainDetails }: any) => {
  const t = useTranslations();
  const router = useRouter()
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  const DOMAIN_DETAILS = {
    BRAND_NAME: domainDetails?.data?.domain_detail?.brand_name || 'Eduelle',
  };

  const { isLoggedIn } = useSelector(({ auth }: any) => auth);
  // const { handleRedirect } = useLocation()

  // const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const quadruplicatedImages = useMemo(() =>
    [...JOIN_COURSES, ...JOIN_COURSES, ...JOIN_COURSES, ...JOIN_COURSES],
    []
  );

  const leftColumnImages = useMemo(() =>
    quadruplicatedImages.filter((_, i) => i % 2 === 0),
    [quadruplicatedImages]
  );

  const rightColumnImages = useMemo(() =>
    quadruplicatedImages.filter((_, i) => i % 2 !== 0),
    [quadruplicatedImages]
  );

  // Animation starts immediately on component mount

  const animationDuration = Math.max(40, JOIN_COURSES.length * 5);

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#fcfaff',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
      }}
    >
      <Container maxWidth='lg' component={Grid} container>
        <Grid size={{ xs: 12 }}>
          <Grid
            container
            spacing={2}
            sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'row' } }}
          >
            <Grid
              size={{ xs: 12, sm: 7 }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Stack
                spacing={{ xs: 2, sm: 3 }}
                gap={{ xs: 1, sm: 2 }}
                maxWidth={{ xs: '100%', sm: '400px' }}
                mx={{ xs: 'auto', sm: 0 }}
                my={{ xs: 2, sm: 0 }}
              >
                <Typography sx={{ xs: 14, sm: 18 }}>
                  <span style={{ color: '#304BE0' }}>
                    {t('unlock_your_potential', {
                      brand_name: DOMAIN_DETAILS.BRAND_NAME,
                    })}
                  </span>{' '}
                </Typography>
                <Typography variant='h3'>
                  {t('live_with_total_mind')}
                </Typography>
                <Typography sx={{ fontSize: { xs: 16, sm: 18 } }}>
                  {t.rich('get_unlimited_access', {
                    span: chunks => (
                      <span style={{ fontWeight: 600, color: '#304BE0' }}>
                        {chunks}
                      </span>
                    ),
                  })}
                </Typography>

                <Stack
                  spacing={2}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  {isLoggedIn ? (
                    <CustomButton
                      variant='gradient'
                      size={isMobile ? 'medium' : 'large'}
                      sx={{
                        borderRadius: '8px',
                        fontSize: { xs: '14px', sm: '16px' },
                      }}
                      onClick={() => router.push(routes.private.dashboard)}
                    >
                      {t('dashboard')}
                    </CustomButton>
                  ) : (
                    <CustomButton
                      variant='gradient'
                      size={isMobile ? 'medium' : 'large'}
                      sx={{
                        borderRadius: '8px',
                        fontSize: { xs: '14px', sm: '16px' },
                      }}
                      onClick={() => scrollToSection('courses')}
                    >
                      {t('join_now')}
                    </CustomButton>
                  )}
                </Stack>
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing={{ xs: 1, sm: 2 }}
                >
                  <Stack direction='row' sx={{ position: 'relative' }}>
                      {MEMBER_AVATARS?.map((memberImg, index) => (
                        <Image width={45} height={45}
                          key={index}
                          src={memberImg}
                          alt={`member-${index}`}
                          style={{
                            borderRadius: '50%',
                            width: '45px',
                            height: '45px',
                            marginLeft: index === 0 ? 0 : '-14px',
                            zIndex: 1,
                          }}
                        />
                      ))}
                  </Stack>
                  <Stack>
                    <Typography
                      color='#747474'
                      fontSize={{ xs: '10px', sm: '12px' }}
                    >
                      {t('trusted_by')}
                    </Typography>
                    <Typography
                      fontSize={{ xs: '14px', sm: '18px' }}
                      fontWeight={500}
                    >
                      {t('members')}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 5 }}>
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
                  <>
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
                              mb: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Image
                              src={item}
                              alt={`join-course-${index}`}
                              width={185}
                              height={250}
                              priority={index < 3}
                              loading={index < 3 ? 'eager' : 'lazy'}
                              fetchPriority={index < 2 ? 'high' : 'auto'}
                              style={{
                                borderRadius: '14px',
                                width: '100%',
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
                              mb: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Image
                              src={item}
                              alt={`join-course-alt-${index}`}
                              width={185}
                              height={250}
                              priority={index < 3}
                              loading={index < 3 ? 'eager' : 'lazy'}
                              fetchPriority={index < 2 ? 'high' : 'auto'}
                              style={{
                                borderRadius: '14px',
                                width: '100%',
                                maxHeight: 250,
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default JoinCourse;
