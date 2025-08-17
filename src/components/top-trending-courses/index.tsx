import { Container, Stack, Typography, useMediaQuery } from '@mui/material';
import CustomButton from '@shared/button';
import CourseCard from '@components/course-card';
import { scrollToSection } from '@utils/helper';
import { useTranslations } from 'next-intl';

const TopTrendingCourses = ({ useHomeDetails }) => {

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const t = useTranslations();

    return (
        <>
            <Container maxWidth="lg" sx={{ my: 6 }} id="courses">
                <Stack spacing={{ xs: 2, sm: 6 }}>
                    <Stack sx={{ gap: { xs: 2, sm: 2.5 } }}>
                        <Stack spacing={2}>
                            <Typography
                                fontSize={{ xs: 28, sm: 32 }}
                                sx={{ fontWeight: 500, color: '#0E0E0E' }}
                            >
                                {t('top_trending_courses')}
                            </Typography>
                            <Typography fontSize={{ xs: 12, sm: 16 }} sx={{ color: '#303030' }}>
                                {t('top_courses')}
                            </Typography>
                        </Stack>
                    </Stack>

                    <CourseCard {...{ useHomeDetails }} />

                    <Stack
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <CustomButton
                            variant="gradient"
                            size={isMobile ? 'medium' : 'large'}
                            sx={{
                                borderRadius: '8px',
                                fontSize: { xs: '14px', sm: '16px' }
                            }}
                            onClick={() => scrollToSection('courses-by-category')}
                        >
                            {t('see_all_courses')}
                        </CustomButton>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
};

export default TopTrendingCourses;
