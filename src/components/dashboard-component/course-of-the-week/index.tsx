import {
  Card,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { ICONS } from '@/assets/icons';
import IconButton from '@/shared/button/IconButton';

const CourseOfTheWeek = ({
  handleStartFree,
  COURSE_OF_THE_WEEK_DATA,
  isBecomeAMemberWithVerified,
}: any) => {
  const { id, image, title, description, redirectionUrl, instructor } =
    COURSE_OF_THE_WEEK_DATA;
  const { name } = instructor || {};
  const t = useTranslations();

  const isBetween900And1380 = useMediaQuery(
    '(min-width:900px) and (max-width:1380px)'
  );

  return (
    <Box sx={{ px: { xs: 2, sm: 0 } }}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          height: { xs: 'auto' },
          borderRadius: { xs: '10px', sm: '14px' },
          boxShadow: '2px 4px 8px rgba(0,0,0,0.5)',
          backgroundColor: { xs: 'white' },
          overflow: 'hidden',
          cursor: redirectionUrl ? 'pointer' : 'default',
          transition: 'box-shadow 0.2s',
          '&:hover': {
            boxShadow: redirectionUrl && '0 4px 16px rgba(0,0,0,0.10)',
          },
        }}
        onClick={() => {
          if (redirectionUrl) {
            window.location.href = redirectionUrl;
          }
        }}
      >
        <Stack
          sx={{
            position: 'relative',
          }}
        >
          <CardMedia
            component='img'
            image={image}
            alt={t('course_of_the_week_image')}
            sx={{
              height: '100%',
              objectPosition: 'center',
              objectFit: 'cover',
              borderRadius: { xs: '10px 10px 0 0', md: '14px 0 0 14px' },
              display: 'block',
            }}
          />

          <Chip
            label={t('course_of_the_week')}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'rgba(255, 255, 255, 0.85)',
              color: '#000000',
              fontSize: '12px',
              fontWeight: 500,
              height: '24px',
              borderRadius: '6px',
              '& .MuiChip-label': {
                px: 2,
              },
            }}
          />
        </Stack>
        <Stack
          sx={{ backgroundColor: 'white' }}
          width='fit-content'
          justifyContent='space-between'
          pt={{ xs: 3, md: 2, xxl: 4 }}
          pb={{ xs: 1, md: 1, xl: 1 }}
          px={{ xs: 3, md: 2, xxl: 4 }}
        >
          <Stack spacing={{ xs: 0.5, sm: 2, md: 0.5, xxl: 2 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: '20px', md: '18px', xl: '24px' },
                lineHeight: 1.2,
                color: '#0E0E0E',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
              variant='h5'
            >
              {title}
            </Typography>
            <Typography
              sx={{
                color: '#303030',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: 1.5,
                mt: { xs: 0.5, md: 0 },
              }}
            >
              {name}
            </Typography>
            <Typography
              sx={{
                color: '#505050',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: 1.6,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: isBetween900And1380 ? 2 : 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {description}
            </Typography>
          </Stack>
          <Divider
            sx={{
              marginTop: { xs: 2, md: 0 },
              marginBottom: { xs: 1, md: 0 },
              display: {
                xs: isBecomeAMemberWithVerified ? 'none' : 'block',
                sm: 'none',
              },
            }}
          />
          <Stack
            width='100%'
            direction='row'
            justifyContent={{
              xs: 'flex-start',
              md: 'flex-end',
            }}
            alignItems='center'
          >
            {!isBecomeAMemberWithVerified && (
              <Stack width='100%'>
                <Divider
                  flexItem
                  sx={{
                    marginTop: { xs: 2, md: 0 },
                    marginBottom: { xs: 1, md: 0 },
                    display: { xs: 'none', sm: 'block' },
                    borderColor: '#BBBBBB59',
                  }}
                />
                <Stack
                  mt={{ sm: 0, xxl: 1 }}
                  direction='row'
                  alignItems='center'
                  justifyContent={'space-between'}
                  sx={{
                    cursor: 'pointer',
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    if (redirectionUrl) {
                      window.location.href = redirectionUrl;
                    }
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: {
                        xs: '14px',
                      },
                      color: '#0E0E0E',
                    }}
                  >
                    {t('go_to_course_redirect')}
                  </Typography>
                  <IconButton>
                    <ICONS.PLAY_CIRCLE size={22} color='#304BE0' />
                  </IconButton>
                </Stack>
              </Stack>
            )}

            {isBecomeAMemberWithVerified && (
              <Stack direction='row' justifyContent='flex-end' gap={1}>
                <Stack
                  direction='row'
                  alignItems='center'
                  sx={{
                    cursor: 'pointer',
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    if (redirectionUrl) {
                      window.location.href = redirectionUrl;
                    }
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: {
                        xs: '14px',
                      },
                      color: '#0E0E0E',
                    }}
                  >
                    {t('read_more')}
                  </Typography>
                  <IconButton>
                    <ICONS.RightArrowIcon size={20} color='#0E0E0E' />
                  </IconButton>
                </Stack>
                <Divider
                  orientation='vertical'
                  flexItem
                  sx={{
                    borderColor: '#BBBBBB59',
                  }}
                />
                <Stack
                  direction='row'
                  alignItems='center'
                  sx={{
                    cursor: 'pointer',
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    handleStartFree(id, title);
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: {
                        xs: '14px',
                      },
                      color: '#0E0E0E',
                    }}
                  >
                    {t('start_for_free')}
                  </Typography>
                  <IconButton>
                    <ICONS.PLAY_CIRCLE size={22} color='#304BE0' />
                  </IconButton>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};

export default CourseOfTheWeek;
