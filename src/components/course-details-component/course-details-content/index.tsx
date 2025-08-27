import { useCallback, useState, useEffect } from 'react';
import { Typography, Stack, Card, CardContent, Box, Rating } from '@mui/material';
import CustomButton from '@/shared/button';
import { ICONS } from '@/assets/icons';
import { useTranslations } from 'next-intl';
import TolstoyWidget from '../../tolstoy-widget';
import { videoURL } from '@/utils/helper';
import { primaryNew } from '@/theme/color';

const CourseDetailsContent = ({ courseDetailsData }: any) => {
    const t = useTranslations();

    const [rating, setRating] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { selectedLesson, course, data, widgetScriptData } = courseDetailsData || {};
    const {
        title,
        description,
        link_1,
        link_2,
        lession_files,
        link_1_label,
        link_2_label,
        download_files_label
    } = selectedLesson || {};

    const courseId = course?.id;

    const courseDescription =
        course?.course_translations?.[0]?.description || t('no_description_available');

    // Effect to load rating from localStorage when courseId changes
    useEffect(() => {
        if (courseId) {
            const storedRatingData = localStorage.getItem(`courseRating_${courseId}`);
            if (storedRatingData) {
                const { rating: storedRating, submitted } = JSON.parse(storedRatingData);
                setRating(storedRating || 0);
                setIsSubmitted(submitted || false);
            } else {
                setRating(0);
                setIsSubmitted(false);
            }
        }
    }, [courseId]);

    const handleDownloadFiles = useCallback(() => {
        lession_files.forEach((file: any) => {
            const fileUrl = videoURL(file.additional_files);
            const fileName = decodeURIComponent(file.additional_files.split('/').pop());

            fetch(fileUrl)
                .then((response) => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.blob();
                })
                .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                })
                .catch((error) => {
                    console.error('File download error:', error);
                });
        });
    }, [lession_files]);

    const handleRatingChange = (event: any, newValue: any) => {
        setRating(newValue);
        if (isSubmitted) {
            setIsSubmitted(false);
        }
    };

    const handleRatingSubmit = () => {
        setIsSubmitted(true);
        if (courseId) {
            localStorage.setItem(
                `courseRating_${courseId}`,
                JSON.stringify({ rating, submitted: true })
            );
        }
    };

    useEffect(() => {
        if (courseId && isSubmitted) {
            localStorage.setItem(
                `courseRating_${courseId}`,
                JSON.stringify({ rating, submitted: true })
            );
        }
    }, [rating, courseId, isSubmitted]);

    return (
        <Box>
            <Stack spacing={4}>
                <Stack spacing={2}>
                    <Typography
                        sx={{
                            fontSize: { xs: 24, sm: 24 },
                            fontWeight: 500
                        }}
                        color="primary.typography"
                    >
                        {title || t('select_a_lesson')}
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: 400,
                            fontSize: { xs: 16 }
                        }}
                        color="primary.typography"
                    >
                        {description || t('no_description_available')}
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        {link_1 && (
                            <CustomButton
                                variant="gradient"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                endIcon={<ICONS.ArrowTopRight />}
                                onClick={() => {
                                    window.open(link_1, '_blank', 'noopener,noreferrer');
                                }}
                            >
                                {link_1_label ? link_1_label : `${t('Link')}1`}
                            </CustomButton>
                        )}
                        {link_2 && (
                            <CustomButton
                                variant="gradient"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                endIcon={<ICONS.ArrowTopRight />}
                                onClick={() => {
                                    window.open(link_2, '_blank', 'noopener,noreferrer');
                                }}
                            >
                                {link_2_label ? link_2_label : `${t('Link')} 2`}
                            </CustomButton>
                        )}

                        {Boolean(lession_files?.length) && (
                            <CustomButton
                                variant="gradient"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                endIcon={<ICONS.DownloadLine />}
                                onClick={handleDownloadFiles}
                            >
                                {download_files_label
                                    ? download_files_label
                                    : `${t('download_files')}`}
                            </CustomButton>
                        )}
                    </Stack>
                </Stack>
                <Stack spacing={2}>
                    <Stack spacing={2}>
                        <Card
                            variant="outlined"
                            sx={{
                                width: '100%',
                                borderRadius: '12px',
                                backgroundColor: '#f5f6fd',
                                border: `1px solid ${primaryNew.main}`
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    alignItems: { xs: 'center' },
                                    justifyContent: 'space-between',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 2
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: { xs: 20, sm: 20 },
                                        fontWeight: 500
                                    }}
                                    color="primary.typography"
                                >
                                    {t('please_rate_this_lesson')}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 4 }}>
                                    <Rating
                                        precision={0.5}
                                        value={rating}
                                        onChange={handleRatingChange}
                                        aria-label="Star Rating"
                                    />
                                    <CustomButton
                                        variant="gradient"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        {...{ loading: false }}
                                        disabled={!rating || isSubmitted}
                                        onClick={handleRatingSubmit}
                                    >
                                        {isSubmitted ? t('submitted') : t('submit')}
                                    </CustomButton>
                                </Box>
                            </CardContent>
                        </Card>
                        {widgetScriptData?.id && widgetScriptData?.script && (
                            <TolstoyWidget
                                widgetType="full"
                                commentClass="tolstoycomments-cc"
                                miniWidget={false}
                                dynamicScript={widgetScriptData?.script || ''}
                                courseLandingData={data}
                            />
                        )}
                        <Stack spacing={2}>
                            <Typography
                                sx={{
                                    fontSize: { xs: 24, sm: 24 },
                                    fontWeight: 500
                                }}
                                color="primary.typography"
                            >
                                {t('about_this_course')}
                            </Typography>
                            <Typography
                                sx={{
                                    fontWeight: 400,
                                    fontSize: { xs: 16 }
                                }}
                                color="primary.typography"
                            >
                                {courseDescription || t('no_course_description_available')}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
}

export default CourseDetailsContent;
