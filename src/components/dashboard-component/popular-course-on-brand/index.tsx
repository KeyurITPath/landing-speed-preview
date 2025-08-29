import { Box, Grid2, Stack, Typography } from '@mui/material';
import CourseCard from '../../dashboard-card';
import { ICONS } from '@/assets/icons';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import RenderCard from '../../dashboard-card/components/course-card';

const PopularCourseOnBrand = ({ dashboardData, progress, className }: any) => {
  const {
    BRAND_NAME,
    POPULAR_BRAND_COURSES_DATA = [],
    isPopularBrandCoursesDataLoading,
  } = dashboardData;
  const t = useTranslations();

  // State to track if the component has mounted on the client-side
  const [isMounted, setIsMounted] = useState(false);

  // This effect will run only on the client-side (after SSR)
  useEffect(() => {
    setIsMounted(true); // Set to true after mounting
  }, []);

  return (
    <Grid2 size={{ xs: 12 }} className={className}>
      <Box px={{ xs: 2, sm: 0 }} mb={{ xs: 2, sm: 6 }}>
        <Grid2 container spacing={{ xs: 2, sm: 4 }}>
          <Grid2 size={{ xs: 12 }}>
            <Stack
              direction='row'
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '28px', sm: '32px', fontWeight: 500 },
                  color: '#0E0E0E',
                }}
              >
                {t('popular_on')} {BRAND_NAME}
              </Typography>
              <Box
                className='navigation-wrapper'
                sx={{
                  display: {
                    xs: 'none',
                    sm:
                      POPULAR_BRAND_COURSES_DATA?.length > 3 ? 'flex' : 'none',
                  },
                  gap: 2,
                }}
              >
                <div
                  className='swiper-button-prev user-popular-course-on-branch-slider-swiper-button-prev'
                  style={{ position: 'relative', top: '0px' }}
                >
                  <ICONS.KeyboardArrowLeft size={32} />
                </div>
                <div
                  className='swiper-button-next user-popular-course-on-branch-slider-swiper-button-next'
                  style={{ position: 'relative', top: '0px' }}
                >
                  <ICONS.KeyboardArrowRight size={32} />
                </div>
              </Box>
            </Stack>
          </Grid2>
          {Boolean(POPULAR_BRAND_COURSES_DATA?.length) ? (
            <Grid2 size={{ xs: 12 }}>
              <Box sx={{ position: 'relative' }}>
                {!isMounted ? (
                  <Grid2 container spacing={2} >
                    {[...POPULAR_BRAND_COURSES_DATA]?.splice(0, 3)?.map(
                      (item: any, index: number) => {
                        return (
                          <Grid2 size={{xs: 12, md: 4 }} key={index}>
                            <RenderCard
                              {...{
                                course: item,
                                isBecomeAMemberWithVerified:
                                  dashboardData?.isBecomeAMemberWithVerified,
                                handleStartFree: dashboardData?.handleStartFree,
                              }}
                            />
                          </Grid2>
                        );
                      }
                    )}
                  </Grid2>
                ) : (
                  <CourseCard
                    {...{
                      dashboardData,
                      nextEl:
                        '.user-popular-course-on-branch-slider-swiper-button-next',
                      prevEl:
                        '.user-popular-course-on-branch-slider-swiper-button-prev',
                      progress,
                      COURSES_DATA: POPULAR_BRAND_COURSES_DATA,
                      isLoading: isPopularBrandCoursesDataLoading,
                    }}
                  />
                )}
              </Box>
            </Grid2>
          ) : null}
        </Grid2>
      </Box>
    </Grid2>
  );
};

export default PopularCourseOnBrand;
