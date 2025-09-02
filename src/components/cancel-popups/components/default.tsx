import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { IMAGES } from '@/assets/images';
import CustomButton from '@/shared/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const Default = ({
  handleCancel,
  title,
  description,
  image,
  onCancelPopupCancelLoading: loading,
}: any) => {
  const t = useTranslations();

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  return (
    <>
      <Stack
        sx={{
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
            aspectRatio: '16/6',
          }}
        >
          <Image
            fill
            sizes='100vw'
            src={encodeURI(image)}
            style={{
              aspectRatio: '16/6',
              borderRadius: 0,
            }}
            alt='defaultBanner'
          />
        </Box>
        <Image
          width={isMobile ? 45 : 80}
          height={isMobile ? 45 : 80}
          src={IMAGES.byeEmoji}
          alt='byeEmoji'
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </Stack>
      <Stack
        sx={{
          p: { xs: 3, sm: 4 },
          gap: { xs: 2, sm: 3 },
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <Stack sx={{ gap: { xs: 2, sm: 3 } }}>
          <Typography variant='h5'>{title}</Typography>
          <Typography
            variant='body1'
            dangerouslySetInnerHTML={{ __html: description }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxHeight: {
                xs: 'calc(100vh - 510px)',
                sm: 'none',
              },
              overflowY: {
                xs: 'auto',
                sm: 'unset',
              },
            }}
          />
        </Stack>
        <CustomButton
          sx={{ textTransform: 'capitalize' }}
          color='secondary'
          onClick={handleCancel}
          {...{ loading }}
        >
          {t('confirm_cancellation')}
        </CustomButton>
      </Stack>
    </>
  );
};

export default Default;
