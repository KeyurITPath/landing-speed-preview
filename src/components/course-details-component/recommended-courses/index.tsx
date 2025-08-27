import { Box, Grid2, Stack, Typography } from '@mui/material';
import CourseCard from '../../dashboard-card';
import { ICONS } from '@/assets/icons';
import { useTranslations } from 'next-intl';

const RecommendedCourses = ({ dashboardData, progress }: any) => {
    const { recommendedCoursesData: COURSES_DATA, recommendedCoursesDataLoading: isLoading } =
        dashboardData;
    const t = useTranslations();

    if (!COURSES_DATA?.length) return null;

    return (
        <Grid2 size={{ xs: 12 }}>
            <Box px={{ xs: 2, sm: 0 }}>
                <Grid2 container spacing={{ xs: 2, sm: 4 }}>
                    <Grid2 size={{ xs: 12 }}>
                        <Stack
                            direction="row"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    fontSize: { xs: '28px', sm: '32px', fontWeight: 500 },
                                    color: '#0E0E0E'
                                }}
                            >
                                {t('we_recommend_it_for_you')}
                            </Typography>
                            <Box
                                className="navigation-wrapper"
                                sx={{
                                    display: {
                                        xs: 'none',
                                        sm: COURSES_DATA?.length > 4 ? 'flex' : 'none'
                                    },
                                    gap: 2
                                }}
                            >
                                <div
                                    className="swiper-button-prev user-recommended-courses-slider-swiper-button-prev"
                                    style={{ position: 'relative', top: '0px' }}
                                >
                                    <ICONS.KeyboardArrowLeft size={32} />
                                </div>
                                <div
                                    className="swiper-button-next user-recommended-courses-slider-swiper-button-next"
                                    style={{ position: 'relative', top: '0px' }}
                                >
                                    <ICONS.KeyboardArrowRight size={32} />
                                </div>
                            </Box>
                        </Stack>
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        <Box sx={{ position: 'relative' }}>
                            <CourseCard
                                {...{
                                    dashboardData,
                                    nextEl: '.user-recommended-courses-slider-swiper-button-next',
                                    prevEl: '.user-recommended-courses-slider-swiper-button-prev',
                                    progress,
                                    COURSES_DATA,
                                    isLoading
                                }}
                            />
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>
        </Grid2>
    );
};

export default RecommendedCourses;
