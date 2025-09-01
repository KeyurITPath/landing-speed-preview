'use client';

import {
  Box,
  Container,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ICONS } from '@assets/icons';
import { IMAGES } from '@assets/images';
import dynamic from 'next/dynamic';
import { USER_REVIEW_IMAGES } from '@assets/images';
import { useTranslations } from 'next-intl';
import CustomImage from '../custom-image';
import Image from 'next/image';

const UserSlider = dynamic(() => import('../user-slider'), {
  ssr: false,
});

const UserReviews = () => {
  const t = useTranslations();
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const USER_REVIEWS = [
    {
      id: 1,
      name: 'Melisa Beckett',
      rating: 5,
      messageKey: 'user_reviews.1.message',
      image: USER_REVIEW_IMAGES.userReviewImage1,
    },
    {
      id: 2,
      name: 'Sofia Lin',
      rating: 5,
      messageKey: 'user_reviews.2.message',
      image: USER_REVIEW_IMAGES.userReviewImage2,
    },
    {
      id: 3,
      name: 'Jordan Reyes',
      rating: 5,
      messageKey: 'user_reviews.3.message',
      image: USER_REVIEW_IMAGES.userReviewImage3,
    },
    {
      id: 4,
      name: 'Emma Marshall',
      rating: 5,
      messageKey: 'user_reviews.4.message',
      image: USER_REVIEW_IMAGES.userReviewImage4,
    },
    {
      id: 5,
      name: 'Patricia Menon',
      rating: 5,
      messageKey: 'user_reviews.5.message',
      image: USER_REVIEW_IMAGES.userReviewImage5,
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'primary.background',
        py: { xs: 2, md: 6 },
      }}
    >
      <Container maxWidth='lg'>
        <Stack
          spacing={{ xs: 0, sm: 6 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            mx: { xs: 1, sm: 0 },
            width: '100%',
          }}
        >
          <Typography variant='h4' sx={{ fontWeight: 500 }}>
            {t('words_from_users')}
          </Typography>
          <Box
            sx={{
              width: '100%',
              position: 'relative',
              top: { xs: '-40px', sm: 0 },
            }}
          >
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              style={{ width: '100%' }}
              pagination={{
                clickable: true,
              }}
              navigation={{
                nextEl: '.user-reviews-swiper-button-next',
                prevEl: '.user-reviews-swiper-button-prev',
              }}
            >
              <Box sx={{ position: 'relative' }}>
                {USER_REVIEWS?.map(
                  ({ name, rating, messageKey, image }, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <Stack
                          sx={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: { xs: 2, sm: 2, md: 0 },
                            width: { xs: '100%', sm: '80%' },
                            margin: '0 auto',
                            pb: 4,
                          }}
                        >
                          <Stack
                            sx={{
                              width: {
                                xs: '100%',
                                sm: '100%',
                                md: '75%',
                              },
                              p: { xs: 2, sm: 4 },
                              gap: { xs: 2, sm: 4 },
                              borderRadius: 3,
                              backgroundColor: 'initial.white',
                              mr: { xs: 0, sm: 0, md: -7 },
                              zIndex: 1,
                              order: { xs: 2, sm: 2, md: 1 },
                            }}
                          >
                            <Stack
                              sx={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                gap: 1,
                              }}
                            >
                              <Stack
                                sx={{
                                  flexDirection: 'row',
                                  aspectRatio: '1/1',
                                  position: 'relative', // required for fill
                                  width: { xs: 20, sm: 40 }, // MUI responsive width
                                  height: { xs: 'auto', sm: 32 },
                                }}
                              >
                                <Image
                                  src={IMAGES.doubleQuotes.src}
                                  alt={name}
                                  fill
                                  sizes='(min-width: 600px) 40px, 20px'
                                  style={{ objectFit: 'cover' }}
                                />
                              </Stack>
                              <Rating
                                readOnly
                                precision={0.5}
                                value={rating}
                                sx={{ color: 'primaryNew.main' }}
                                icon={
                                  <Stack
                                    sx={{
                                      fontSize: {
                                        xs: '1.3rem',
                                        sm: 'inherit',
                                      },
                                    }}
                                  >
                                    <ICONS.Star />
                                  </Stack>
                                }
                                emptyIcon={
                                  <Stack
                                    sx={{
                                      fontSize: {
                                        xs: '1.3rem',
                                        sm: 'inherit',
                                      },
                                      color: '#BBBBBB',
                                    }}
                                  >
                                    <ICONS.StarOutline />
                                  </Stack>
                                }
                              />
                            </Stack>
                            <Typography variant='body1' textAlign={'left'}>
                              {t(messageKey)}
                            </Typography>
                            <Typography
                              variant='subtitle2'
                              fontWeight={600}
                              textAlign={'left'}
                            >
                              {name}
                            </Typography>
                          </Stack>
                          <CustomImage
                            src={image}
                            alt='coursesBanner'
                            aspectRatio='4/5'
                            borderRadius={2}
                            containerSx={{
                              width: {
                                xs: '100%',
                                sm: '100%',
                                md: '35%',
                              },
                              order: { xs: 1, sm: 1, md: 2 },
                              ...(isMobile && {
                                maxWidth: '150px !important',
                                zIndex: 2,
                                position: 'relative !important',
                                top: 60,
                                left: 0,
                                alignSelf: 'flex-start !important',
                              }),
                            }}
                          />
                        </Stack>
                      </SwiperSlide>
                    );
                  }
                )}
              </Box>
            </Swiper>
            <Box
              className='swiper-button-prev user-reviews-swiper-button-prev'
              sx={{
                visibility: { xs: 'hidden', sm: 'visible' },
              }}
            >
              <ICONS.KeyboardArrowLeft size={32} />
            </Box>
            <Box
              className='swiper-button-next user-reviews-swiper-button-next'
              sx={{
                visibility: { xs: 'hidden', sm: 'visible' },
              }}
            >
              <ICONS.KeyboardArrowRight size={32} />
            </Box>
          </Box>
        </Stack>
      </Container>
      <UserSlider />
    </Box>
  );
};

export default UserReviews;
