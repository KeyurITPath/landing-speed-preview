import { Stack, Typography } from '@mui/material';
import CourseCard from './course-card';
import { useTranslations } from 'next-intl';

const PersonalGrowthPath = ({ COURSE_TITLE }: any) => {
    const t = useTranslations();
    return (
        <Stack sx={{ gap: { xs: 2.5, sm: 3 } }}>
            <Typography variant="h4" sx={{ fontWeight: 500 }}>
                {t('growthPathMessage')}
            </Typography>
            <Typography variant="subtitle1">
                {t('unlockMessage', { courseTitle: COURSE_TITLE })}
            </Typography>
            {Array.from({ length: 3 }).map((_, index) => {
                const no = `0${index + 1}`;
                const isLast = index + 1 === 3;
                return <CourseCard key={index} {...{ no, isLast }} />;
            })}
        </Stack>
    );
};

export default PersonalGrowthPath;
