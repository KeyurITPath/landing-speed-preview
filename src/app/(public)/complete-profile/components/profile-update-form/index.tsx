import { Link, Stack, Typography } from '@mui/material';
import useProfileUpdateForm from './use-profile-update-form';
import FormControl from '@/shared/inputs/form-control';
import CustomButton from '@/shared/button';
import { useTranslations } from 'next-intl';

const ProfileUpdateForm = ({ userData }: any) => {
  const { handleSubmit, formData, loading } = useProfileUpdateForm({ userData })
  const t = useTranslations();

  return (
    <>
      <Typography variant='h4' sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
        {t('thank_you_message')}
      </Typography>
      <Stack
        component='form'
        onSubmit={handleSubmit}
        sx={{
          bgcolor: '#F5F5F5',
          borderRadius: 1.5,
          p: { xs: 2.5, sm: 4, md: 8 },
          gap: { xs: 2, sm: 3 },
        }}
      >
        {formData.map(({ id, ...input }) => {
          return <FormControl key={id} {...input} />;
        })}
        <CustomButton
          disabled={loading}
          size='large'
          variant='gradient'
          {...{ loading }}
          type='submit'
          sx={{
            width: '100%',
            maxWidth: { sm: '320px' },
          }}
        >
          {t('continue')}
        </CustomButton>
        <Typography variant='caption' sx={{ color: '#808080' }}>
          {t.rich('terms_confirmation', {
            a: chunks => (
              <Link
                href='/privacy-policy'
                sx={{ color: 'inherit', textDecorationColor: 'inherit' }}
                target='_blank'
                rel='noopener noreferrer'
              >
                {chunks}
              </Link>
            ),
          })}
        </Typography>
      </Stack>
    </>
  );
};
export default ProfileUpdateForm;
