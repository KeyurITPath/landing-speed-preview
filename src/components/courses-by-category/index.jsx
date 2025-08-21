import { Container, Stack, Typography, Box, Grid, styled } from '@mui/material';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ICONS } from '@assets/icons';
import { linearGradients } from '../../theme/color';
import RenderCard from '@components/course-card/components/render-card';
import RenderCardLoading from '@components/course-card/components/render-card-loading';
import { arrayToKeyValueObject } from '@utils/helper';
import { useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';

const CustomStack = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    ':hover': {
      background: linearGradients.primary,
      border: `1px solid ${linearGradients.primary}`,
      '& .category-text': {
        color: 'white',
      },
    },
  },
}));

const CoursesByCategory = ({
  homeData,
  handleStartFree,
  filterCategoryHandler,
}) => {
  const {
    COURSES_DATA,
    CATEGORIES_BADGE,
    filterCategory,
    isCoursesDataLoading,
    isBecomeAMemberWithVerified,
  } = homeData;

  const skeletonArray = Array.from({ length: 8 });
  const t = useTranslations();
  const { isLoggedIn } = useSelector(({ auth }) => auth);

  return (
    <Container maxWidth='lg' id='courses-by-category'>
      <Stack
        spacing={{ xs: 2, sm: 3 }}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          textAlign: { sm: 'flex-start' },
        }}
      >
        <Typography variant='h4' sx={{ fontWeight: 500 }}>
          {t('see_all_courses_by_categories')}
        </Typography>
        <Stack
          sx={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.5,
          }}
        >
          {CATEGORIES_BADGE.map((category, index) => {
            return (
              <CustomStack
                key={index}
                sx={{
                  px: { xs: 1, sm: 2 },
                  py: 1,
                  borderRadius: 1,
                  border: arrayToKeyValueObject(filterCategory)?.[category?.id]
                    ? '1px solid #304BE0'
                    : '1px solid #BBBBBB80',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                }}
                onClick={() => filterCategoryHandler(category?.id)}
              >
                <Typography
                  className='category-text'
                  sx={{
                    fontWeight: { xs: 400, sm: 500 },
                    fontSize: { xs: 12, sm: 16 },
                    textAlign: 'center',
                    color: arrayToKeyValueObject(filterCategory)?.[category?.id]
                      ? '#304BE0'
                      : '#BBBBBB',
                    transition: 'color 0.2s ease-in-out',
                  }}
                >
                  {category?.name || ''}
                </Typography>
              </CustomStack>
            );
          })}
        </Stack>
        <Stack
          sx={{
            mx: { xs: 1, sm: 0 },
            position: 'relative',
            width: '100%',
          }}
          spacing={{ xs: 0, sm: 1 }}
        >
          <Stack
            direction='row'
            sx={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              display: { xs: 'none', sm: 'flex' },
            }}
          >
            <Box
              className='navigation-wrapper'
              sx={{
                display: 'flex',
                gap: 2,
              }}
            >
              <div
                className='swiper-button-prev categories-courses-slider-swiper-button-prev'
                style={{ position: 'relative', top: '0px' }}
              >
                <ICONS.KeyboardArrowLeft size={32} />
              </div>
              <div
                className='swiper-button-next categories-courses-slider-swiper-button-next'
                style={{ position: 'relative', top: '0px' }}
              >
                <ICONS.KeyboardArrowRight size={32} />
              </div>
            </Box>
          </Stack>
          <Box sx={{ position: 'relative' }}>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={4}
              style={{ width: '100%' }}
              pagination={{
                clickable: true,
              }}
              navigation={{
                nextEl: '.categories-courses-slider-swiper-button-next',
                prevEl: '.categories-courses-slider-swiper-button-prev',
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1.3,
                },
                600: {
                  slidesPerView: 2,
                },
                900: {
                  slidesPerView: 4,
                },
                1200: {
                  slidesPerView: 4,
                },
              }}
            >
              {isCoursesDataLoading ? (
                skeletonArray?.map((_, index) => (
                  <SwiperSlide key={index}>
                    <Box pb={{ xs: 4, sm: 4 }}>
                      <RenderCardLoading />
                    </Box>
                  </SwiperSlide>
                ))
              ) : COURSES_DATA?.length ? (
                COURSES_DATA?.map((course, index) => (
                  <SwiperSlide key={index}>
                    <Box pb={{ xs: 4, sm: 3 }}>
                      <RenderCard
                        {...{
                          course,
                          isBecomeAMemberWithVerified,
                          handleStartFree,
                          isLoggedIn,
                        }}
                      />
                    </Box>
                  </SwiperSlide>
                ))
              ) : (
                <Grid size={{ xs: 12 }}>
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
                </Grid>
              )}
            </Swiper>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

export default CoursesByCategory;
