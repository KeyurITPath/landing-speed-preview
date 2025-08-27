import { useMemo } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Grid2,
  Stack,
  accordionSummaryClasses,
  styled,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  useTheme,
  // LinearProgress
} from '@mui/material';
import { ICONS } from '@/assets/icons';
import CustomButton from '@/shared/button';
import VimeoPlayer from '../../vimeo-player';
import { getDeviceType, getVideoId } from '@/utils/helper';
import { useTranslations } from 'next-intl';
import Switch from '@/shared/inputs/switch';
import { useSelector } from 'react-redux';
import { primaryNew } from '../../../theme/color';

const Accordion = styled(props => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  [`&.${accordionSummaryClasses.expanded}`]: {
    border: `1px solid ${theme.palette.primaryNew.main}`,
  },
  borderRadius: 12,
  '&::before': {
    display: 'none',
  },
  backgroundColor: '#f5f6fd',
  marginBottom: theme.spacing(0.5),
  overflowY: 'auto',
}));

const AccordionSummary = styled(({ expanded, ...props }: any) => {
  return (
    <MuiAccordionSummary
      expandIcon={
        <Box
          sx={{
            bgcolor: expanded ? 'primaryNew.main' : 'secondary.main',
            borderRadius: '4px',
            minWidth: 0,
            p: 0.4,
            fontSize: 15,
            color: 'common.white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stack
            sx={{
              transition: 'transform 0.2s ease-in-out',
              ...(expanded && {
                transform: 'rotate(180deg)',
              }),
            }}
          >
            <ICONS.AngleDown />
          </Stack>
        </Box>
      }
      {...props}
    />
  );
})(({ theme }) => ({
  minHeight: 55,
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(0deg)',
    },
  [`&.${accordionSummaryClasses.expanded}`]: {
    color: theme.palette.primaryNew.main,
  },
  gap: theme.spacing(1),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const VideoContainer = ({ courseDetailsData }: any) => {
  const {
    courseModuleData,
    selectedModuleId,
    selectedLesson,
    handleModuleChange,
    handleVideoSelect,
    videoContainerRef,
    closePipMode,
    handleTimeUpdate,
    videoEnded,
    user,
    playerStarted,
    handleNextLesson,
    videoAutoplay,
    handleChangeVideoAutoPlay,
    domainDetails,
  } = courseDetailsData || {};
  const t = useTranslations();

  const currentLessonVideoId = useMemo(() => {
    if (selectedLesson?.type === 'video' && selectedLesson?.video) {
      const videoId = getVideoId(selectedLesson?.video);
      return videoId;
    }
    return null;
  }, [selectedLesson]);

  const BRAND = useMemo(() => {
    return domainDetails?.data?.domain_detail?.brand_name || '';
  }, [domainDetails]);

  const disclaimer = useMemo(() => t('disclaimer', { BRAND }), [t, BRAND]);

  const findLessonWatchedTime = useMemo(() => {
    const watchedTimeInSeconds =
      selectedLesson?.user_watch_time_histories?.find(
        (item: any) =>
          !item?.is_completed &&
          item?.customer_id === user?.id &&
          item?.lesson_id === selectedLesson?.id
      )?.watch_time || 0;

    return watchedTimeInSeconds;
  }, [selectedLesson, user]);

  const isMobile = useMemo(() => getDeviceType() === 'mobile', []);

  return isMobile ? (
    <Box width={'100%'}>
      <Grid2
        container
        {...{ spacing: isMobile && selectedLesson?.type === 'text' ? 2 : 0 }}
        sx={{ width: '100%' }}
      >
        <Grid2 size={{ xs: 12 }}>
          {selectedLesson?.type === 'text' ? (
            <Box
              sx={{
                width: '100%',
                height: { xs: '100%', sm: '425px' },
                ...(isMobile && { minHeight: '248px' }),
                position: 'relative',
                borderRadius: isMobile ? 0 : '12px',
                overflowY: 'auto',
                padding: { xs: 2, sm: 4 },
                backgroundColor: '#f3f3f3',
                display: 'flex', // Use flexbox for layout
                flexDirection: 'column',
              }}
            >
              <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <Typography
                  fontWeight={400}
                  fontSize={16}
                  color='primary.typography'
                  dangerouslySetInnerHTML={{
                    __html: selectedLesson?.lesson_text || '',
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
                  }}
                />
              </Box>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <CustomButton
                  size='small'
                  sx={{
                    maxWidth: 280,
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                  variant='gradient'
                  onClick={handleNextLesson}
                >
                  {t('next')}
                </CustomButton>
              </Box>
            </Box>
          ) : (
            <Box
              ref={videoContainerRef}
              sx={{
                width: '100%',
                height: { xs: '100%' },
                position: 'relative',
                borderRadius: 0,
                overflow: 'hidden',
              }}
            >
              {currentLessonVideoId && (
                <VimeoPlayer
                  autoplay={videoAutoplay}
                  lessonId={selectedLesson?.id}
                  videoUrl={currentLessonVideoId}
                  pipMode={false}
                  closePipMode={closePipMode}
                  options={{
                    loop: false,
                    watchedTime: findLessonWatchedTime,
                  }}
                  videoEnded={videoEnded}
                  onTimeUpdate={(formattedTime: any, lessonId: any) =>
                    handleTimeUpdate(formattedTime, lessonId)
                  }
                  playerStarted={playerStarted}
                />
              )}
              {currentLessonVideoId && (
                <Stack
                  p={1}
                  direction='row'
                  justifyContent='flex-end'
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <Typography>Autoplay</Typography>
                  <Switch
                    checked={videoAutoplay}
                    handleChange={handleChangeVideoAutoPlay}
                    inputProps={{ 'aria-label': 'ant design' }}
                  />
                </Stack>
              )}
            </Box>
          )}
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box
            sx={{
              overflowY: 'auto',
              paddingX: 2,
            }}
          >
            {courseModuleData?.map((module: any, index: number) => {
              const isExpanded = module.id === selectedModuleId;
              return (
                <Accordion
                  key={index}
                  expanded={isExpanded}
                  onChange={handleModuleChange(module.id)}
                >
                  <AccordionSummary expanded={isExpanded}>
                    <Stack spacing={0.5}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: '16px',
                          color: isExpanded ? '#0E0E0E' : '#747474',
                        }}
                      >
                        {module.name}
                      </Typography>
                      {/* <Typography variant="caption" color="text.secondary">
                                                {module?.lessions?.length || 0}{' '}
                                                {module?.lessions?.length === 1
                                                    ? t('Lesson')
                                                    : t('Lessons')}
                                            </Typography> */}
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense disablePadding>
                      {module?.lessions?.length > 0 ? (
                        module?.lessions?.map((lesson: any, idx: any) => {
                          const activeLesson = selectedLesson?.id === lesson.id;

                          // const completedWatchedLesson =
                          //     lesson?.user_watch_time_histories?.find(
                          //         (item) =>
                          //             item?.customer_id === user?.id &&
                          //             item?.lesson_id === lesson?.id
                          //     )?.is_completed;

                          const isChecked =
                            lesson?.user_watch_time_histories?.find(
                              (item: any) =>
                                item?.customer_id === user?.id &&
                                item?.lesson_id === lesson?.id
                            )?.is_started_to_watch;

                          return (
                            <ListItem
                              key={idx}
                              disablePadding
                              sx={{
                                px: 0,
                                py: 0.5,
                              }}
                            >
                              <ListItemButton
                                onClick={e => {
                                  e.stopPropagation();
                                  if (!activeLesson) {
                                    handleVideoSelect(lesson);
                                  }
                                }}
                                selected={activeLesson}
                                sx={{
                                  borderRadius: 1,
                                  '&.Mui-selected': {
                                    backgroundColor: 'action.selected',
                                  },
                                  paddingY: 1.5,
                                }}
                              >
                                <Box sx={{ width: '100%' }}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'flex-start',
                                      gap: 2,
                                    }}
                                  >
                                    {isChecked && (
                                      <Box width={24} height={24}>
                                        <ICONS.CircleCheck
                                          style={{
                                            color: primaryNew.main,
                                          }}
                                        />
                                      </Box>
                                    )}
                                    <ListItemText
                                      primary={lesson?.title}
                                      sx={{
                                        fontSize: 16,
                                        fontWeight: 400,
                                        color: activeLesson
                                          ? primaryNew.main
                                          : 'text.primary',
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </ListItemButton>
                            </ListItem>
                          );
                        })
                      ) : (
                        <Typography variant='body2' color='text.secondary'>
                          {t('no_lessons_available')}
                        </Typography>
                      )}
                    </List>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
          <Stack
            pt={2}
            px={2}
            pb={0}
            direction='row'
            justifyContent='flex-start'
            spacing={1}
            alignItems='center'
          >
            <Typography variant='body2'>{disclaimer}</Typography>
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  ) : (
    <Box px={{ xs: 2, sm: 0 }} width={'100%'}>
      <Grid2 container spacing={{ xs: 2, sm: 4 }} sx={{ width: '100%' }}>
        <Grid2 size={{ xs: 12, lg: 8 }}>
          {selectedLesson?.type === 'text' ? (
            <Box
              sx={{
                width: '100%',
                height: { xs: '100%', sm: '425px' },
                position: 'relative',
                borderRadius: '12px',
                overflowY: 'auto',
                padding: { xs: 2, sm: 4 },
                backgroundColor: '#f3f3f3',
                display: 'flex', // Use flexbox for layout
                flexDirection: 'column',
              }}
            >
              <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <Typography
                  fontWeight={400}
                  fontSize={16}
                  color='primary.typography'
                  dangerouslySetInnerHTML={{
                    __html: selectedLesson?.lesson_text || '',
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
                  }}
                />
              </Box>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <CustomButton
                  size='small'
                  sx={{
                    maxWidth: 280,
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                  variant='gradient'
                  onClick={handleNextLesson}
                >
                  {t('next')}
                </CustomButton>
              </Box>
            </Box>
          ) : (
            <Box
              ref={videoContainerRef}
              sx={{
                width: '100%',
                height: { xs: '100%' },
                position: 'relative',
                borderRadius: 0,
                overflow: 'hidden',
              }}
            >
              {currentLessonVideoId && (
                <VimeoPlayer
                  autoplay={videoAutoplay}
                  lessonId={selectedLesson?.id}
                  videoUrl={currentLessonVideoId}
                  pipMode={false}
                  closePipMode={closePipMode}
                  options={{
                    loop: false,
                    watchedTime: findLessonWatchedTime,
                  }}
                  videoEnded={videoEnded}
                  onTimeUpdate={(formattedTime: any, lessonId: any) =>
                    handleTimeUpdate(formattedTime, lessonId)
                  }
                  playerStarted={playerStarted}
                />
              )}
              {currentLessonVideoId && (
                <Stack
                  py={1}
                  direction='row'
                  justifyContent='space-between'
                  spacing={1}
                  alignItems='center'
                >
                  <Typography variant='body2'>{disclaimer}</Typography>
                  <Stack
                    p={1}
                    direction='row'
                    justifyContent='flex-end'
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                    minWidth={180}
                  >
                    <Typography>Autoplay</Typography>
                    <Switch
                      checked={videoAutoplay}
                      handleChange={handleChangeVideoAutoPlay}
                      inputProps={{ 'aria-label': 'ant design' }}
                    />
                  </Stack>
                </Stack>
              )}
            </Box>
          )}
        </Grid2>

        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Box
            sx={{
              maxHeight: '425px',
              height: '100%',
              overflowY: 'auto',
              paddingBottom: 1,
            }}
          >
            {courseModuleData?.map((module: any, index: number) => {
              const isExpanded = module.id === selectedModuleId;
              return (
                <Accordion
                  key={index}
                  expanded={isExpanded}
                  onChange={handleModuleChange(module.id)}
                >
                  <AccordionSummary expanded={isExpanded}>
                    <Stack spacing={0.5}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: '16px',
                          color: isExpanded ? '#0E0E0E' : '#747474',
                        }}
                      >
                        {module.name}
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense disablePadding>
                      {module?.lessions?.length > 0 ? (
                        module?.lessions?.map((lesson: any, idx: number) => {
                          const activeLesson = selectedLesson?.id === lesson.id;

                          const isChecked =
                            lesson?.user_watch_time_histories?.find(
                              (item: any) =>
                                item?.customer_id === user?.id &&
                                item?.lesson_id === lesson?.id
                            )?.is_started_to_watch;

                          return (
                            <ListItem
                              key={idx}
                              disablePadding
                              sx={{
                                px: 0,
                                py: 0.5,
                              }}
                            >
                              <ListItemButton
                                onClick={e => {
                                  e.stopPropagation();
                                  if (!activeLesson) {
                                    handleVideoSelect(lesson);
                                  }
                                }}
                                selected={activeLesson}
                                sx={{
                                  borderRadius: 1,
                                  '&.Mui-selected': {
                                    backgroundColor: 'action.selected',
                                  },
                                  paddingY: 1.5,
                                }}
                              >
                                <Box sx={{ width: '100%' }}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'flex-start',
                                      gap: 2,
                                    }}
                                  >
                                    {isChecked && (
                                      <Box width={24} height={24}>
                                        <ICONS.CircleCheck
                                          style={{
                                            color: primaryNew.main,
                                          }}
                                        />
                                      </Box>
                                    )}
                                    <ListItemText
                                      primary={lesson?.title}
                                      sx={{
                                        fontSize: 16,
                                        fontWeight: 400,
                                        color: activeLesson
                                          ? primaryNew.main
                                          : 'text.primary',
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </ListItemButton>
                            </ListItem>
                          );
                        })
                      ) : (
                        <Typography variant='body2' color='text.secondary'>
                          {t('no_lessons_available')}
                        </Typography>
                      )}
                    </List>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default VideoContainer;
