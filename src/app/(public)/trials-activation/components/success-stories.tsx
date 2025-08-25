'use client';
import { useRef, useState } from 'react';
import { Avatar, Rating, Stack, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { AVATARS } from '@/assets/images';
import { ICONS } from '@/assets/icons';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { primaryNew } from '../../../../theme/color';

// Custom styles for this component
const swiperContainerStyles = {
  width: '100%',
  height: 'auto',
  position: 'relative',
};

const swiperSlideStyles = {
  paddingTop: 40,
  display: 'flex !important',
  height: 'auto',
  width: '100%',
};

const SuccessStories = ({ BRAND_NAME }: any) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef(null);
  const t = useTranslations();

  const FEEDBACKS = [
    {
      id: 1,
      name: 'Marcus Lee',
      profile: AVATARS.avatar1,
      rating: 5,
      message: t('feedbacks.1.message', { brand_name: BRAND_NAME }),
    },
    {
      id: 2,
      name: 'Alina Petrova',
      profile: AVATARS.avatar2,
      rating: 4.5,
      message: t('feedbacks.2.message', { brand_name: BRAND_NAME }),
    },
    {
      id: 3,
      name: 'Daniel Novak',
      profile: AVATARS.avatar3,
      rating: 5,
      message: t('feedbacks.3.message', { brand_name: BRAND_NAME }),
    },
    {
      id: 4,
      name: 'Tomás Delgado',
      profile: AVATARS.avatar4,
      rating: 4.5,
      message: t('feedbacks.4.message', { brand_name: BRAND_NAME }),
    },
    {
      id: 5,
      name: 'Elijah Grant',
      profile: AVATARS.avatar5,
      rating: 5,
      message: t('feedbacks.5.message', { brand_name: BRAND_NAME }),
    },
    {
      id: 6,
      name: 'Zoe Kramer',
      profile: AVATARS.avatar6,
      rating: 4.5,
      message: t('feedbacks.6.message', { brand_name: BRAND_NAME }),
    },
    {
      id: 7,
      name: 'Yusuf Karim',
      profile: AVATARS.avatar7,
      rating: 5,
      message: t('feedbacks.7.message', { brand_name: BRAND_NAME }),
    },
  ];

  return (
    <>
      <Stack sx={{ gap: 2 }}>
        <Typography variant='h5' sx={{ zIndex: 1, fontWeight: 500 }}>
          {t('successStories')}
        </Typography>
        <Typography variant='subtitle1' sx={{ zIndex: 1 }}>
          {t('journeyMessage')}
        </Typography>
      </Stack>

      <Stack
        sx={{
          flexDirection: 'row',
          gap: { xs: 1, sm: 2 },
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'start' },
          flexWrap: 'wrap',
        }}
      >
        {FEEDBACKS.map(({ profile }, index) => {
          return (
            <Image
              loading='lazy'
              className='custom-pagination'
              key={index}
              src={profile}
              width={55}
              height={55}
              alt={`profile-${index}`}
              style={{
                cursor: 'pointer',
                ...(activeSlide === index && {
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: primaryNew.main,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }),
              }}
              onClick={() => {
                if (swiperRef.current) {
                  try {
                    swiperRef.current.slideToLoop(index, 1200);
                  } catch (error) {
                    console.warn('Swiper slideToLoop error:', error);
                    // Fallback to slideTo if slideToLoop fails
                    swiperRef.current.slideTo(index, 1200);
                  }
                }
              }}
            />
          );
        })}
      </Stack>

      <div style={{ width: '100%', position: 'relative' }}>
        <Swiper
          onSwiper={swiper => (swiperRef.current = swiper)}
          onSlideChange={({ realIndex }) => {
            setActiveSlide(realIndex);
          }}
          slidesPerView={1}
          spaceBetween={16}
          loop={true}
          speed={1200}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          style={swiperContainerStyles}
        >
          {FEEDBACKS.map(({ name, profile, message, rating }, index) => {
            return (
              <SwiperSlide key={index} style={swiperSlideStyles}>
                <Stack
                  sx={{
                    height: '100%',
                    p: { xs: 2, sm: 3 },
                    gap: { xs: 2, sm: 4 },
                    borderRadius: 1.5,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: 'primaryNew.main',
                    width: '100%',
                  }}
                >
                  <Stack
                    sx={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Image
                      loading='lazy'
                      src={profile}
                      alt={name}
                      width={75}
                      height={75}
                      style={{
                        marginTop: -7.5,
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: primaryNew.main,
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                    <Rating
                      readOnly
                      precision={0.5}
                      value={rating}
                      sx={{ color: 'primaryNew.main' }}
                      icon={
                        <Stack sx={{ fontSize: 'inherit' }}>
                          <ICONS.Star />
                        </Stack>
                      }
                      emptyIcon={
                        <Stack
                          sx={{
                            fontSize: 'inherit',
                            color: 'grey.400',
                          }}
                        >
                          <ICONS.StarOutline />
                        </Stack>
                      }
                    />
                  </Stack>
                  <Typography variant='body1'>{message}</Typography>
                  <Typography variant='h6'>{name}</Typography>
                </Stack>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
};

export default SuccessStories;
