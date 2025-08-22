import { useMemo } from 'react';
import { Box, Grid2, Stack, Typography } from '@mui/material';
import { ICONS } from '@assets/icons';
import { useTranslations } from 'next-intl';

const CourseDetailsForContentInfo = ({ landingData }) => {
  const { data } = landingData;

  const t = useTranslations();

  const academicPlan = useMemo(() => {
    return data?.landing_page_lessons?.length
      ? data?.landing_page_lessons?.map(lesson => ({
          id: lesson?.id,
          title: lesson?.ap_title,
          description: lesson?.ap_description,
        }))
      : [];
  }, [data?.landing_page_lessons]);

  return (
    <Grid2 size={{ xs: 12 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <Grid2 size={{ xs: 12 }}>
            <Typography
              sx={{
                fontSize: { xs: 26, sm: 28 },
                fontWeight: 500,
              }}
              color='primary.typography'
            >
              {t('content')}
            </Typography>
          </Grid2>
        </Grid2>
        {Boolean(academicPlan?.length) && (
          <Grid2 size={{ xs: 12 }}>
            <Box
              sx={{
                border: '0.6px solid var(--Light-grey, #BBBBBB)',
                width: '100%',
                borderRadius: '10px',
                backgroundColor: '#F5F7FF',
              }}
            >
              <Grid2 container>
                {academicPlan?.map((module, index) => {
                  const isLast = index === academicPlan?.length - 1;

                  return (
                    <Grid2
                      size={{ xs: 12 }}
                      key={index}
                      sx={{
                        borderBottom: isLast
                          ? 'none'
                          : '0.6px solid var(--Light-grey, #BBBBBB)',
                      }}
                    >
                      <Grid2 container spacing={2} p={4}>
                        <Grid2 size={{ xs: 12, sm: 5 }}>
                          <Typography
                            fontWeight={500}
                            fontSize={16}
                            sx={{ color: '#304BE0' }}
                          >
                            {module?.title}
                          </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 7 }}>
                          <Box>
                            {module?.description
                              .split('\n')
                              .map((line, lineIndex) => (
                                <Stack
                                  gap={1}
                                  key={lineIndex}
                                  flexDirection='row'
                                  alignItems='flex-start'
                                >
                                  <Box
                                    sx={{
                                      fontSize: {
                                        xs: 22,
                                        sm: 24,
                                      },
                                    }}
                                  >
                                    <ICONS.VideoCam
                                      style={{
                                        width: '1em',
                                        height: '1em',
                                      }}
                                      color='black'
                                    />
                                  </Box>
                                  <Typography
                                    color='primary.typography'
                                    fontSize={16}
                                  >
                                    {line}
                                  </Typography>
                                </Stack>
                              ))}
                          </Box>
                        </Grid2>
                      </Grid2>
                    </Grid2>
                  );
                })}
              </Grid2>
            </Box>
          </Grid2>
        )}
      </Grid2>
    </Grid2>
  );
};

export default CourseDetailsForContentInfo;
