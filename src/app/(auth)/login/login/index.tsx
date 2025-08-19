import { Stack, styled, Typography } from '@mui/material';
import React from 'react';
import { initial, primaryNew } from '../../../../theme/color';
import { OVERRIDE } from '../../../../theme/basic';
import useLogin from './useLogin';
import { routes } from '../../../../utils/constants/routes';
import Link from 'next/link';
import CustomButton from '../../../../shared/button';
import FormControl from '../../../../shared/inputs/form-control';
import Form from '../../../../shared/forms';
import Image from 'next/image';

const LogoImage = styled(Image)(({ theme }) => ({
  objectFit: 'contain',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const Login = () => {
  const {
    handleSubmit,
    router,
    isLoading,
    emailFormData,
    passwordFormData,
    LOGO_URL,
    logo_width,
    logo_height,
  } = useLogin();

  return (
    <Stack
      sx={{
        gap: 4,
      }}
    >
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
            Login
          </Typography>
        </Stack>
      </Stack>
      <Form
        {...{ handleSubmit }}
        sx={{
          ...OVERRIDE({}).FLEX,
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Stack sx={{ width: '100%', gap: 4 }}>
          <Stack sx={{ width: '100%', gap: 2 }}>
            <FormControl
              fullWidth
              mainSx={{ width: '100%' }}
              {...emailFormData}
            />
            <FormControl
              fullWidth
              mainSx={{ width: '100%' }}
              {...passwordFormData}
            />
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 3,
                width: '100%',
              }}
            >
              <Typography
                component={Link}
                href={routes.public.home}
                variant='body2'
                sx={{
                  textDecoration: 'none',
                  color: primaryNew.main,
                  '&:hover': {
                    color: '#192b93',
                  },
                }}
              >
                Back to Home
              </Typography>
              <Typography
                component={Link}
                href={routes.auth.forgot_password}
                variant='body2'
                sx={{
                  textDecoration: 'none',
                  color: primaryNew.main,
                  '&:hover': {
                    color: '#192b93',
                  },
                }}
              >
                Forgot Password?
              </Typography>
            </Stack>
          </Stack>
          <CustomButton
            variant='gradient'
            type='submit'
            size='large'
            loading={isLoading}
          >
            Login
          </CustomButton>
        </Stack>
      </Form>
    </Stack>
  );
};

Login.displayName = 'Login';

export default Login;
