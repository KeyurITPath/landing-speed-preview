import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import VideoPlayer from '@shared/video-player';
import CoursePurchaseDetails from '../course-purchase-details';
import { videoURL } from '@utils/helper';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const CourseDetails = ({ data, course, videoContainerRef, videoPlayerOptions, pipMode, closePipMode, isMobile }) => {
    const { is_video_processed } = data;
    const t  = useTranslations();

    return (
        <Grid size={{ xs: 12 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography
                        color="primary.typography"
                        sx={{
                            fontSize: { xs: 28, sm: 30 },
                            fontWeight: 500
                        }}
                    >
                        {data?.header || ''}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: { xs: 14 } }} color="primary.typography">
                        {t('author')}:{' '}
                        <span style={{ fontWeight: 500 }}>{course?.user?.name || '-'}</span>
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    {!is_video_processed ? (
                        <Typography
                            variant="body1"
                            fontWeight={500}
                            sx={{
                                textAlign: 'right',
                                animation: 'pulse 1.5s infinite',
                                '@keyframes pulse': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.6 },
                                    '100%': { opacity: 1 }
                                },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                gap: 1
                            }}
                        >
                            <CircularProgress size={16} thickness={6} />
                            {t('video_processing')}
                        </Typography>
                    ) : null}
                    <Box
                        ref={videoContainerRef}
                        sx={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            borderRadius: '12px',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Show poster when video is not processed OR data is still loading */}
                        {(!is_video_processed || !videoPlayerOptions?.sources?.[0]?.src) && data?.intro_thumbnail && (
                            <div
                                style={{
                                    width: '100%',
                                    height: '375px',
                                    position: 'relative',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    backgroundColor: '#000'
                                }}
                            >
                                { }
                                {/* <Image loading="eager"
                                    src={videoURL(data?.intro_thumbnail)}
                                    alt="Video processing poster"
                                    height={"100%"}
                                    width={"100%"}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                /> */}
                            </div>
                        )}

                        {/* Only render VideoPlayer when video is processed AND has valid video source */}
                        {is_video_processed && videoPlayerOptions?.sources?.[0]?.src && (
                            <VideoPlayer
                                options={{
                                    ...videoPlayerOptions,
                                    poster: data?.intro_thumbnail
                                        ? videoURL(data?.intro_thumbnail)
                                        : ''
                                }}
                                isVideoProcessed={is_video_processed}
                                {...{ pipMode, closePipMode }}
                            />
                        )}
                    </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography
                        fontWeight={400}
                        fontSize={{ xs: 16 }}
                        color="primary.typography"
                        dangerouslySetInnerHTML={{
                            __html: data?.description || ''
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
                </Grid>
                {Boolean(isMobile) && (
                    <Grid size={{ xs: 12 }}>
                        <CoursePurchaseDetails {...{ landingData }} />
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
};

export default CourseDetails;
