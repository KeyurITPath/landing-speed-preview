import { Box, Grid2, Stack, Typography, useMediaQuery } from '@mui/material';
import CourseCard from '../../dashboard-card';
import { ICONS } from '@/assets/icons';
import { linearGradients } from '@/theme/color';
import { useTranslations } from 'next-intl';
import { arrayToKeyValueObject } from '@/utils/helper';
import { useEffect, useMemo, useState } from 'react';
import RenderCardLoading from '../../dashboard-card/components/course-card-loading';

const PopularCourseByCategories = ({
  dashboardData,
  progress,
  className,
}: any) => {
  const {
    CATEGORIES_BADGE,
    filterCategory,
    filterCategoryHandler,
    COURSES_DATA = [],
    isCoursesDataLoading,
  } = dashboardData;
  const t = useTranslations();
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  // State to track if the component has mounted on the client-side
  const [isMounted, setIsMounted] = useState(false);

  // This effect will run only on the client-side (after SSR)
  useEffect(() => {
    setIsMounted(true); // Set to true after mounting
  }, []);

  const hoverStyles = useMemo(() => {
    return isMobile
      ? {}
      : {
          ':hover': {
            background: linearGradients.primary,
            border: `1px solid ${linearGradients.primary}`,
            '& .category-text': {
              color: 'white',
            },
          },
        };
  }, [isMobile]);
  return (
    <Grid2 size={{ xs: 12 }} className={className}>
      <Box px={{ xs: 2, sm: 0 }}>
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
                {t('popular_courses_by_categories')}
              </Typography>
              <Box
                className='navigation-wrapper'
                sx={{
                  display: {
                    xs: 'none',
                    sm: COURSES_DATA?.length > 3 ? 'flex' : 'none',
                  },
                  gap: 2,
                }}
              >
                <div
                  className='swiper-button-prev user-popular-course-by-category-slider-swiper-button-prev'
                  style={{ position: 'relative', top: '0px' }}
                >
                  <ICONS.KeyboardArrowLeft size={32} />
                </div>
                <div
                  className='swiper-button-next user-popular-course-by-category-slider-swiper-button-next'
                  style={{ position: 'relative', top: '0px' }}
                >
                  <ICONS.KeyboardArrowRight size={32} />
                </div>
              </Box>
            </Stack>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Stack
              sx={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 1.5,
              }}
            >
              {CATEGORIES_BADGE?.map((category: any, index: number) => {
                return (
                  <Stack
                    key={index}
                    sx={{
                      px: { xs: 1, sm: 2 },
                      py: 1,
                      borderRadius: 1,
                      border: (
                        arrayToKeyValueObject(filterCategory) as {
                          [key: string]: any;
                        }
                      )?.[category?.id]
                        ? '1px solid #304BE0'
                        : '1px solid #BBBBBB80',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      ...hoverStyles,
                    }}
                    onClick={() => filterCategoryHandler(category?.id)}
                  >
                    <Typography
                      className='category-text'
                      sx={{
                        fontWeight: { xs: 400, sm: 500 },
                        fontSize: { xs: 12, sm: 16 },
                        textAlign: 'center',
                        color: (
                          arrayToKeyValueObject(filterCategory) as {
                            [key: string]: any;
                          }
                        )?.[category?.id]
                          ? '#304BE0'
                          : '#BBBBBB',
                        transition: 'color 0.2s ease-in-out',
                      }}
                    >
                      {category?.name || ''}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Grid2>
          {!isMounted ? (
            <Grid2 size={{ xs: 12 }}>
              <Grid2 container spacing={2}>
                {[0, 1, 2].map(item => (
                  <Grid2 size={{ xs: 12, md: 4 }} key={item}>
                    <RenderCardLoading />
                  </Grid2>
                ))}
              </Grid2>
            </Grid2>
          ) : Boolean(COURSES_DATA?.length) || isCoursesDataLoading ? (
            <Grid2 size={{ xs: 12 }}>
              <Box sx={{ position: 'relative' }}>
                <CourseCard
                  {...{
                    dashboardData,
                    nextEl:
                      '.user-popular-course-by-category-slider-swiper-button-next',
                    prevEl:
                      '.user-popular-course-by-category-slider-swiper-button-prev',
                    progress,
                    COURSES_DATA,
                    isLoading: isCoursesDataLoading,
                  }}
                />
              </Box>
            </Grid2>
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
        </Grid2>
      </Box>
    </Grid2>
  );
};

export default PopularCourseByCategories;
