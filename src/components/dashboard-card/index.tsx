import { Box, Grid2, Stack, Typography, useMediaQuery } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import RenderCard from './components/course-card';
import RenderCardLoading from './components/course-card-loading';
import { isEmptyArray } from '@/utils/helper';
import { useTranslations } from 'next-intl';

const CourseCard = ({
  dashboardData,
  nextEl,
  prevEl,
  progress,
  COURSES_DATA,
  isLoading,
  breakpoints,
  forContinueWatching = false,
  handleContinueWatchingCourse,
}: any) => {
  const { isBecomeAMemberWithVerified, handleStartFree } = dashboardData;
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const skeletonArray = Array.from({ length: 8 });
  const t = useTranslations();

  return (
    <Stack>
      <Swiper
        modules={isMobile ? [Navigation, Pagination] : [Navigation]}
        slidesPerView={3}
        spaceBetween={20}
        style={{ width: '100%' }}
        pagination={{ clickable: isMobile && true }}
        navigation={nextEl && prevEl ? { nextEl, prevEl } : false}
        breakpoints={
          breakpoints
            ? breakpoints
            : {
                0: {
                  slidesPerView: 1.3,
                },
                600: {
                  slidesPerView: 2,
                },
                900: {
                  slidesPerView: 3,
                },
              }
        }
      >
        {isLoading ? (
          skeletonArray?.map((_, index) => (
            <SwiperSlide key={index}>
              <Box pb={{ xs: 4, sm: 4 }}>
                <RenderCardLoading />
              </Box>
            </SwiperSlide>
          ))
        ) : !isEmptyArray(COURSES_DATA) ? (
          COURSES_DATA?.map((course: any, index: number) => (
            <SwiperSlide key={index}>
              <Box pb={{ xs: 4, sm: 2 }}>
                <RenderCard
                  {...{
                    course,
                    progress,
                    isBecomeAMemberWithVerified,
                    handleStartFree,
                    forContinueWatching,
                    handleContinueWatchingCourse,
                  }}
                />
              </Box>
            </SwiperSlide>
          ))
        ) : (
          <Grid2 size={{ xs: 12 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 2,
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  color: '#666',
                  textAlign: 'center',
                  mb: 1,
                }}
              >
                {t('no_courses_found')}
              </Typography>
            </Box>
          </Grid2>
        )}
      </Swiper>
    </Stack>
  );
};

export default CourseCard;
