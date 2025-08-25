import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import CustomButton from '@/shared/button';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

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
      <Image
        width={600}
        height={240}
        src={encodeURI(image)}
        alt='coursesBanner'
        style={{
          aspectRatio: '16/6',
          borderRadius: 0,
        }}
      />
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
                xs: 'calc(100vh - 445px)',
                sm: 'none',
              },
              overflowY: {
                xs: 'auto',
                sm: 'unset',
              },
            }}
          />
        </Stack>
        <Stack
          sx={{ flexDirection: { sm: 'row' }, alignItems: 'center', gap: 2 }}
        >
          <CustomButton
            {...{ loading }}
            fullWidth
            sx={{ textTransform: 'capitalize' }}
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
