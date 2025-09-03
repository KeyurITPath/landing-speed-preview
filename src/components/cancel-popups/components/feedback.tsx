import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import CustomButton from '@/shared/button';
import FormControl from '@/shared/inputs/form-control';
import useFeedback from './use-feedback';

const Feedback = ({
  handleCancel,
  title,
  description,
  image,
  handleGoBack,
  options: feedbackOptions,
  handleSaveFeedbackFormData,
  saveFeedBackFormData,
}: any) => {
  const { formData, handleSubmit } = useFeedback({
    feedbackOptions,
    handleSaveFeedbackFormData,
    saveFeedBackFormData,
    handleCancel,
  });

  const t = useTranslations();

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
          position: 'relative'
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
        component='form'
        onSubmit={handleSubmit}
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
          {formData.map(({ id, ...input }) => {
            return <FormControl key={id} {...input} />;
          })}
        </Stack>
        <Stack
          sx={{ flexDirection: { sm: 'row' }, alignItems: 'center', gap: 2 }}
        >
          <CustomButton
            variant='gradient'
            fullWidth
            sx={{ textTransform: 'capitalize', borderRadius: 8 }}
            onClick={handleGoBack}
          >
            {t('go_back')}
          </CustomButton>
          <CustomButton
            fullWidth
            sx={{ textTransform: 'capitalize' }}
            color='secondary'
            type='submit'
          >
            {t('submit')}
          </CustomButton>
        </Stack>
      </Stack>
    </>
  );
};

export default Feedback;
