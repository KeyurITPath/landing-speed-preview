import { Box, Grid2, Stack, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import RenderCard from './components/render-card';
import RenderCardLoading from './components/render-card-loading';
import { isEmptyArray } from '@utils/helper';
import { useTranslations } from 'next-intl';

const CourseCard = ({
  POPULAR_BRAND_COURSES_DATA,
  isPopularBrandCoursesDataLoading,
  isBecomeAMemberWithVerified,
  handleStartFree,
  isLoggedIn,
  forSearchPage = false,
}: any) => {
  const skeletonArray = Array.from({ length: 8 });
  const t = useTranslations();

  const showSkeleton =
    isPopularBrandCoursesDataLoading ||
    (!POPULAR_BRAND_COURSES_DATA && !isPopularBrandCoursesDataLoading);

  const hasCourses =
    !isEmptyArray(POPULAR_BRAND_COURSES_DATA) &&
    Array.isArray(POPULAR_BRAND_COURSES_DATA);

  const NoCourses = (
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
  );

  return (
    <Stack width='100%'>
      {!forSearchPage ? (
        <Stack sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={1.3}
            spaceBetween={20}
            loop={true}
            style={{ width: '100%' }}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
          >
            {showSkeleton
              ? skeletonArray.map((_, index) => (
                  <SwiperSlide key={index}>
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                      <RenderCardLoading />
                    </Grid2>
                  </SwiperSlide>
                ))
              : hasCourses
                ? POPULAR_BRAND_COURSES_DATA.map((course, index) => (
                    <SwiperSlide key={index}>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }} sx={{ pb: 4 }}>
                        <RenderCard
                          course={course}
                          isBecomeAMemberWithVerified={
                            isBecomeAMemberWithVerified
                          }
                          handleStartFree={handleStartFree}
                          isLoggedIn={isLoggedIn}
                        />
                      </Grid2>
                    </SwiperSlide>
                  ))
                : NoCourses}
          </Swiper>
        </Stack>
      ) : null}
      <Grid2
        sx={{ display: { xs: forSearchPage ? 'flex' : 'none', sm: 'flex' } }}
        container
        spacing={2.5}
      >
        {showSkeleton
          ? skeletonArray.map((_, index) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <RenderCardLoading />
              </Grid2>
            ))
          : hasCourses
            ? POPULAR_BRAND_COURSES_DATA.map((course, index) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <RenderCard
                    course={course}
                    isBecomeAMemberWithVerified={isBecomeAMemberWithVerified}
                    handleStartFree={handleStartFree}
                    isLoggedIn={isLoggedIn}
                  />
                </Grid2>
              ))
            : NoCourses}
      </Grid2>
    </Stack>
  );
};
export default CourseCard;
