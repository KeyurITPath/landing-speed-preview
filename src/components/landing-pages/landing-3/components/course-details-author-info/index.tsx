import { Avatar, Box, Grid2, Stack, Typography } from '@mui/material';
import { SERVER_URL } from '@utils/constants';
import { useTranslations } from 'next-intl';

const CourseDetailsForAuthorInfo = ({ data, course }) => {
    const t = useTranslations();
    return (
        <Grid2 size={{ xs: 12 }}>
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12 }}>
                    <Typography
                        color="primary.typography"
                        fontWeight={500}
                        fontSize={{ xs: 22, sm: 24 }}
                    >
                        {t('about_author')}
                    </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 4,
                            alignItems: { xs: 'start', sm: 'center' },
                            flexDirection: { xs: 'column', sm: 'row' }
                        }}
                    >
                        <Avatar loading="lazy" alt={data?.author_name}
                            src={data?.author_image ? SERVER_URL + data?.author_image : ''}
                            sx={{ width: { xs: 100, sm: 150 }, height: { xs: 100, sm: 150 } }}
                        />
                        <Stack spacing={2}>
                            <Typography
                                color="primary.typography"
                                fontWeight={500}
                                fontSize={{ xs: 16, sm: 18 }}
                            >
                                {course?.user?.name || '-'}
                            </Typography>
                            <Typography
                                fontWeight={400}
                                fontSize={16}
                                color="primary.typography"
                                dangerouslySetInnerHTML={{
                                    __html: data?.author_bio || ''
                                }}
                                sx={{
                                    '& ul': {
                                        listStyleType: 'disc',
                                        marginLeft: 2,
                                        paddingLeft: 2
                                    },
                                    '& li': {
                                        display: 'list-item'
                                    },
                                    whiteSpace: 'break-spaces'
                                }}
                            />
                        </Stack>
                    </Box>
                </Grid2>
            </Grid2>
        </Grid2>
    );
};

export default CourseDetailsForAuthorInfo;
