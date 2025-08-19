import { Stack, styled, Typography } from '@mui/material';
import Image from 'next/image';
import { routes } from '@/utils/constants/routes';
import { initial, primaryNew } from '@/theme/color';
import { OVERRIDE } from '@/theme/basic';
import Form from '@/shared/forms';
import FormControl from '@/shared/inputs/form-control';
import Link from 'next/link';
import CustomButton from '@/shared/button';
import useForgotPassword from './use-forgot-password'

const LogoImage = styled(Image)(({ theme }) => ({
  objectFit: 'contain',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const ForgotPassword = () => {
  const {
    LOGO_URL,
    router,
    forgotPasswordData,
    handleSubmit,
    isLoading,
    logo_height,
    logo_width,
  } = useForgotPassword();

  return (
    <Stack sx={{ gap: 4 }}>
      <Stack sx={{ alignItems: 'center', gap: 5 }}>
        {LOGO_URL ? (
          <LogoImage
            src={LOGO_URL}
            alt='logo'
            width={logo_width}
            height={logo_height}
            sx={{
              width: logo_width ? `${logo_width}px` : '100%',
              maxWidth: logo_width ? `${logo_width}px` : 'auto',
              height: logo_height ? `${logo_height}px` : '100%',
              maxHeight: logo_height ? `${logo_height}px` : 'auto',
            }}
            onClick={() => router.push(routes.public.home)}
          />
        ) : null}
        <Stack sx={{ alignItems: 'center', gap: 1 }}>
          <Typography variant='h4' sx={{ color: initial.black }}>
            Forgot password?
          </Typography>
        </Stack>
      </Stack>
      <Form
        {...{ handleSubmit }}
        sx={{
          ...OVERRIDE({}).FLEX,
          flexDirection: 'column',
          justifyContent: 'start',
        }}
      >
        <Stack sx={{ width: '100%', gap: 4 }}>
          <Stack sx={{ width: '100%', gap: 2 }}>
            {forgotPasswordData.map(({ id, ...data }) => (
              <FormControl
                fullWidth
                key={id}
                mainSx={{ width: '100%' }}
                {...data}
              />
            ))}

            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Typography
                component={Link}
                href={routes.auth.login}
                variant='body2'
                sx={{
                  textDecoration: 'none',
                  color: primaryNew.main,
                  '&:hover': {
                    color: '#2339B3',
                  },
                }}
              >
                Go back to login?
              </Typography>
            </Stack>
          </Stack>

          <CustomButton
            variant='gradient'
            type='submit'
            size='large'
            loading={isLoading}
          >
            Reset Password
          </CustomButton>
        </Stack>
      </Form>
    </Stack>
  );
};

export default ForgotPassword;
