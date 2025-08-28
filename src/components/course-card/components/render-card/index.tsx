import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import CustomButton from '@shared/button';
import IconButton from '@shared/button/IconButton';
import { ICONS } from '@assets/icons';
import { useTranslations } from 'next-intl';

const RenderCard = ({
  course,
  isBecomeAMemberWithVerified,
  handleStartFree,
  isLoggedIn,
}: any) => {
  const {
    title,
    id,
    redirectionUrl,
    instructor,
    rating,
    image,
    category,
    originalPrice,
    price,
  } = course || {};
  const { avatar, name } = instructor || {};
  const t = useTranslations();

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: { xs: '10px', sm: '14px' },
        margin: '0',
        height: '100%',
        cursor: redirectionUrl ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: redirectionUrl ? '0 4px 16px rgba(0,0,0,0.10)' : undefined,
        },
      }}
      onClick={() => {
        if (redirectionUrl) {
          window.location.href = redirectionUrl;
        }
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component='img'
          image={image}
          alt={title}
          sx={{
            borderRadius: { xs: '10px 10px 0 0px', sm: '14px 14px 0 0' },
            aspectRatio: '16 / 9',
            // height: { xs: 140, md: 160 },
            width: '100%',
            // maxHeight: { xs: 140, md: 160 },
            objectFit: 'cover',
          }}
        />

        <Chip
          label={category}
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            color: 'initial.black',
            fontSize: '12px',
            fontWeight: 500,
            height: '22px',
            maxWidth: '80%',
            borderRadius: { xs: '4px', sm: '6px' },
            '& .MuiChip-label': {
              px: 2,
              py: 1,
            },
          }}
        />
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          padding: '0 15px 15px 15px !important',
        }}
      >
        <Typography
          sx={{
            mb: 1.9,
            mt: 2,
            fontWeight: 500,
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontSize: { xs: '14px' },
            color: '#0E0E0E',
            height: 40,
          }}
        >
          {title}
        </Typography>

        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          width='100%'
        >
          <Stack direction='row' alignItems='center' spacing={1}>
            {' '}
            <Avatar
              alt={name}
              src={avatar}
              sx={{
                height: { xs: 20, sm: 30 },
                width: { xs: 20, sm: 30 },
              }}
            />
            <Typography
              variant='caption'
              sx={{
                fontSize: { xs: '11px', sm: '12px' },
                color: '#0E0E0E',
                height: '50px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                alignContent: 'center',
              }}
            >
              {name}
            </Typography>
          </Stack>

          <Stack direction='row' alignItems='center' spacing={0.5}>
            <Rating
              name='read-only'
              value={1}
              max={1}
              readOnly
              sx={{
                fontSize: '16px',
                color: '#FFC11E',
                mb: '3px !important',
                '& .MuiRating-icon': {
                  color: '#FFC11E',
                },
              }}
            />
            <Typography
              variant='caption'
              fontWeight={500}
              sx={{
                fontSize: { xs: '11px', sm: '12px' },
                color: '#0E0E0E',
              }}
            >
              {rating}
            </Typography>
          </Stack>
        </Stack>
        {!isBecomeAMemberWithVerified && isLoggedIn && (
          <>
            <hr
              style={{
                margin: '14px -24px',
                opacity: 0.2,
              }}
            />
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
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
              <Stack direction='row' alignItems='center' spacing={1}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: '14px' },
                    color: '#0E0E0E',
                  }}
                >
                  {t('go_to_course_redirect')}
                </Typography>
              </Stack>

              <IconButton>
                <ICONS.PLAY_CIRCLE size={22} color='#304BE0' />
              </IconButton>
            </Stack>
          </>
        )}

        {isBecomeAMemberWithVerified && isLoggedIn && (
          <>
            <hr
              style={{
                margin: '14px -24px',
                opacity: 0.2,
              }}
            />
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              sx={{ cursor: 'pointer' }}
              onClick={e => {
                e.stopPropagation();
                if (redirectionUrl) {
                  window.location.href = redirectionUrl;
                }
              }}
            >
              <Stack direction='row' alignItems='center' spacing={1}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: '14px' },
                    color: '#0E0E0E',
                  }}
                >
                  {t('read_more')}
                </Typography>
              </Stack>

              <IconButton>
                <ICONS.RightArrowIcon size={22} color='#0E0E0E' />
              </IconButton>
            </Stack>
            <hr
              style={{
                margin: '14px -24px',
                opacity: 0.2,
              }}
            />
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              sx={{
                cursor: 'pointer',
              }}
              onClick={e => {
                e.stopPropagation();
                handleStartFree(id, title);
              }}
            >
              <Stack direction='row' alignItems='center' spacing={1}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: '14px' },
                    color: '#0E0E0E',
                  }}
                >
                  {t('start_for_free')}
                </Typography>
              </Stack>

              <IconButton>
                <ICONS.PLAY_CIRCLE size={22} color='#304BE0' />
              </IconButton>
            </Stack>
          </>
        )}

        {!isLoggedIn && (
          <>
            <hr
              style={{
                margin: '14px -24px',
                opacity: 0.2,
              }}
            />
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
            >
              <Stack direction='row' alignItems='center' spacing={1}>
                <Typography
                  variant='h6'
                  sx={{
                    textDecoration: 'line-through',
                    color: '#747474',
                    fontWeight: 500,
                    fontSize: { xs: '14px', sm: '16px' },
                  }}
                >
                  {originalPrice}
                </Typography>
                <Typography
                  variant='h6'
                  sx={{
                    color: '#304BE0',
                    fontWeight: 500,
                    fontSize: { xs: '14px', sm: '16px' },
                  }}
                >
                  {price}
                </Typography>
              </Stack>
              <CustomButton
                size='small'
                sx={{
                  maxWidth: 280,
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
                variant='gradient'
                onClick={e => {
                  e.stopPropagation();
                  if (redirectionUrl) {
                    window.location.href = redirectionUrl;
                  }
                }}
              >
                {t('buy')}
              </CustomButton>
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RenderCard;
