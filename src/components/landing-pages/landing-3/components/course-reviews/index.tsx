import { useMemo } from 'react';
import { Avatar, Box, Grid, Typography, styled } from '@mui/material';
import { ICONS } from '@assets/icons';
import { warning } from '../../../../../theme/color';
import { videoURL } from '@utils/helper';
import { useTranslations } from 'next-intl';

const StarRating = styled(Box)({
    display: 'flex',
    alignItems: 'center'
});

const CourseReviews = ({ data }) => {
    console.log("CourseReviews data", data);
    const t = useTranslations();
    const reviewDetails = useMemo(() => {
        return [
            {
                id: 1,
                icon: ICONS.Users,
                label: `${data?.participants || 0} ${t('users')}`,
                mainSx: { xs: 12, sm: 4 }
            },
            {
                id: 2,
                icon: ICONS.BigFillStar,
                label: `${Number(data?.rating).toFixed(1) || 0} / ${data?.amount_of_review || 0} ${t('positive_reviews')}`,
                mainSx: { xs: 12, sm: 8 }
            }
        ];
    }, [data, t]);

    return (
        <Grid size={{ xs: 12 }}>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Typography
                                sx={{
                                    fontSize: { xs: 26, sm: 28 },
                                    fontWeight: 500
                                }}
                                color="primary.typography"
                            >
                                {t('reviews_landing_3')}
                            </Typography>
                        </Grid>
                        {reviewDetails?.map((item, index) => {
                            return (
                                <Grid size={item?.mainSx || { xs: 12, sm: 6 }} key={index}>
                                    <Box gap={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <item.icon
                                            style={{ color: '#304BE0', width: 22, height: 22 }}
                                        />
                                        <Typography
                                            fontSize={{ xs: 16, sm: 18 }}
                                            color="primary.typography"
                                        >
                                            {item?.label}
                                        </Typography>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Grid>
                {Boolean(data?.comments?.length) && (
                    <Grid size={{ xs: 12 }}>
                        <Box
                            sx={{
                                border: '0.6px solid var(--Light-grey, #BBBBBB)',
                                width: '100%',
                                borderRadius: '10px',
                                backgroundColor: '#F5F7FF'
                            }}
                        >
                            <Grid container>
                                {data?.comments?.map((review, index) => {
                                    const isLast = index === data.comments.length - 1;
                                    return (
                                        <Grid
                                            size={{ xs: 12 }}
                                            key={index}
                                            sx={{
                                                borderBottom: isLast
                                                    ? 'none'
                                                    : '0.6px solid var(--Light-grey, #BBBBBB)'
                                            }}
                                        >
                                            <Grid container spacing={2} p={4}>
                                                <Grid size={{ xs: 12 }}>
                                                    <StarRating>
                                                        {[...Array(5)].map((_, index) => (
                                                            <ICONS.STAR
                                                                key={index}
                                                                style={{ width: 18, height: 18 }}
                                                                color={
                                                                    index < 5
                                                                        ? warning.main
                                                                        : 'disabled'
                                                                }
                                                            />
                                                        ))}
                                                    </StarRating>
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <Typography
                                                        color="primary.typography"
                                                        sx={{ fontSize: 16, color: '#0E0E0E' }}
                                                    >
                                                        {review.comment_text}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    size={{ xs: 12 }}
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Avatar loading="lazy"
                                                        sx={{ width: 50, height: 50 }}
                                                        alt="Reviewer"
                                                        src={videoURL(review?.pic || '')}
                                                    />
                                                    <Typography
                                                        color="primary.typography"
                                                        size={{
                                                            fontWeight: 500,
                                                            fontSize: 14
                                                        }}
                                                    >
                                                        {review.name}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
};

export default CourseReviews;
