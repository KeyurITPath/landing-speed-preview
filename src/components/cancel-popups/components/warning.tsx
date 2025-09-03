import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Stack, Typography } from '@mui/material';
import CustomButton from '@/shared/button';
import { IMAGES } from '@/assets/images';
import Image from 'next/image';

const Warning = ({
  handleCancel,
  title,
  description,
  image,
  handleWarningSuccess,
}: any) => {
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const onSuccess = async () => {
    setLoading(true);
    await handleWarningSuccess();
    setLoading(false);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: {xs: 240, sm: '100%'},
          overflow: 'hidden',
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
          aspectRatio: '16/6',
          position: 'relative',
        }}
      >
        <Image
          fill
          sizes='100vw'
          src={encodeURI(image)}
          style={{
            objectFit: 'cover',
            aspectRatio: '16/6',
            borderRadius: 0,
          }}
          alt='coursesBanner'
        />
      </Box>
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
              ul: {
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                listStyle: 'none',
              },
              li: {
                position: 'relative',
                paddingLeft: '28px',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: 18,
                  height: 18,
                  backgroundImage: `url(${IMAGES.checkEmoji})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  top: 2,
                  left: 0,
                },
              },
            }}
          />
        </Stack>
        <Stack
          sx={{ flexDirection: { sm: 'row' }, alignItems: 'center', gap: 2 }}
        >
          <CustomButton
            variant='gradient'
            {...{ loading }}
            fullWidth
            sx={{ textTransform: 'capitalize', borderRadius: 8 }}
            onClick={onSuccess}
          >
            {t('keep_subscription')}
          </CustomButton>
          <CustomButton
            fullWidth
            sx={{ textTransform: 'capitalize' }}
            color='secondary'
            onClick={handleCancel}
          >
            {t('cancel_subscription')}
          </CustomButton>
        </Stack>
      </Stack>
    </>
  );
};

export default Warning;
