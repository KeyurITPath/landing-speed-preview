'use client';

import {
  Box,
  Container,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ICONS } from '@assets/icons';

import { INSTRUCTORS } from '@assets/images';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const UserSlider = () => {
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const t = useTranslations();

  const INSTRUCTOR_IMAGES = [
    INSTRUCTORS.instructor1,
    INSTRUCTORS.instructor2,
    INSTRUCTORS.instructor3,
    INSTRUCTORS.instructor4,
    INSTRUCTORS.instructor5,
    INSTRUCTORS.instructor6,
    INSTRUCTORS.instructor7,
    INSTRUCTORS.instructor8,
    INSTRUCTORS.instructor9,
  ];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'primary.background',
        pt: { xs: 2, md: 6 },
      }}
    >
      <Container maxWidth='lg'>
        <Stack
          sx={{ mx: { xs: 1, sm: 0 }, position: 'relative', width: '100%' }}
          spacing={6}
        >
          <Stack
            direction='row'
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant='h4' sx={{ fontWeight: 500 }}>
              {t('popular_authors')}
            </Typography>
            <Box
              className='navigation-wrapper'
              sx={{ display: 'flex', gap: 2 }}
            >
              <div
                className='swiper-button-prev user-slider-swiper-button-prev'
                style={{ position: 'relative', top: '0px' }}
              >
                <ICONS.KeyboardArrowLeft size={32} />
              </div>
              <div
                className='swiper-button-next user-slider-swiper-button-next'
                style={{ position: 'relative', top: '0px' }}
              >
                <ICONS.KeyboardArrowRight size={32} />
              </div>
            </Box>
          </Stack>

          <Box sx={{ position: 'relative' }}>
            <Swiper
              modules={isMobile ? [Navigation] : [Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={5}
              pagination={{
                clickable: !isMobile && true,
              }}
              navigation={{
                nextEl: '.user-slider-swiper-button-next',
                prevEl: '.user-slider-swiper-button-prev',
              }}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                },
                600: {
                  slidesPerView: 3,
                },
                900: {
                  slidesPerView: 4,
                },
                1200: {
                  slidesPerView: 5,
                },
              }}
            >
              {INSTRUCTOR_IMAGES?.map((img, index) => (
                <SwiperSlide key={index}>
                  <Box pb={4}>
                    {}
                    <Image
                      loading='lazy'
                      src={img}
                      alt='author'
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                        borderRadius: '14px',
                      }}
                    />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default UserSlider;
