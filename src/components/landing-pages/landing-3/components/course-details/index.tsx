import { Box, CircularProgress, Grid2, Typography } from '@mui/material';
import VideoPlayer from '@shared/video-player';
import CoursePurchaseDetails from '../course-purchase-details';
import { videoURL } from '@utils/helper';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const CourseDetails = ({ vimeoSource, landingData }: any) => {
  const {
    data,
    course,
    videoContainerRef,
    videoPlayerOptions,
    pipMode,
    closePipMode,
    isMobile,
  } = landingData;

  const t = useTranslations();

  const { is_video_processed, intro_thumbnail, intro } = vimeoSource;

  return (
    <Grid2 size={{ xs: 12 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <Typography
            color='primary.typography'
            sx={{
              fontSize: { xs: 28, sm: 30 },
              fontWeight: 500,
            }}
          >
            {data?.header || ''}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Typography sx={{ fontSize: { xs: 14 } }} color='primary.typography'>
            {t('author')}:{' '}
            <span style={{ fontWeight: 500 }}>{course?.user?.name || '-'}</span>
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box
            ref={videoContainerRef}
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {/* Only render VideoPlayer when video is processed AND has valid video source */}
            {intro && (
              <VideoPlayer
                {...{ intro, intro_thumbnail, is_video_processed }}
                {...{ pipMode, closePipMode }}
              />
            )}
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Typography
            fontWeight={400}
            fontSize={{ xs: 16 }}
            color='primary.typography'
            dangerouslySetInnerHTML={{
              __html: data?.description || '',
            }}
            sx={{
              '& ul': {
                listStyleType: 'disc',
                marginLeft: 2,
                paddingLeft: 2,
              },
              '& li': {
                display: 'list-item',
              },
              whiteSpace: 'break-spaces',
            }}
          />
        </Grid2>
        {Boolean(isMobile) && (
          <Grid2 size={{ xs: 12 }}>
            <CoursePurchaseDetails {...{ landingData }} />
          </Grid2>
        )}
      </Grid2>
    </Grid2>
  );
};

export default CourseDetails;
