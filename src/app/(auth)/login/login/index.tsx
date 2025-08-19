import React from 'react';
import { Stack, styled, Typography, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useLogin from './useLogin';
import Form from '../../../../shared/forms';
import { OVERRIDE } from '../../../../theme/basic';
import FormControl from '../../../../shared/inputs/form-control';
import { URLS as PAGES, URLS } from '../../../../constant/urls';
import CustomButton from '../../../../shared/button';
import { primaryNew } from '../../../../theme/color';

const LogoImage = styled('img')(({ theme }) => ({
    objectFit: 'contain',
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
        width: '100%'
    }
}));

const Login = React.memo(() => {
    const { handleSubmit, isLoading, emailFormData, passwordFormData, LOGO_URL, logo_width, logo_height } =
        useLogin();

    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Stack
            sx={{
                gap: 4
            }}
        >
            <Stack sx={{ alignItems: 'center', gap: 5 }}>
                {LOGO_URL ? (
                    <LogoImage
                        src={LOGO_URL}
                        alt="logo"
                        logoWidth={logo_width}
                        logoHeight={logo_height}
                        sx={{
                            width: logo_width ? `${logo_width}px` : '100%',
                            maxWidth: logo_width ? `${logo_width}px` : 'auto',
                            height: logo_height ? `${logo_height}px` : '100%',
                            maxHeight: logo_height ? `${logo_height}px` : 'auto',
                        }}
                        onClick={() =>
                            navigate(URLS.HOME_PAGE.path)
                        }
                    />
                ) : null}
                <Stack sx={{ alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4" sx={{ color: theme.palette.common.black }}>
                        Login
                    </Typography>
                </Stack>
            </Stack>
            <Form
                {...{ handleSubmit }}
                sx={{
                    ...OVERRIDE().FLEX,
                    flexDirection: 'column',
                    justifyContent: 'center'
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
                                width: '100%'
                            }}
                        >
                            <Typography
                                component={Link}
                                to={PAGES.HOME_PAGE.path}
                                variant="body2"
                                sx={{
                                    textDecoration: 'none',
                                    color: primaryNew.main,
                                    '&:hover': {
                                        color: '#192b93'
                                    }
                                }}
                            >
                                Back to Home
                            </Typography>
                            <Typography
                                component={Link}
                                to={PAGES.FORGOT_PASSWORD.path}
                                variant="body2"
                                sx={{
                                    textDecoration: 'none',
                                    color: primaryNew.main,
                                    '&:hover': {
                                        color: '#192b93'
                                    }
                                }}
                            >
                                Forgot Password?
                            </Typography>
                        </Stack>
                    </Stack>
                    <CustomButton variant="gradient" type="submit" size="large" loading={isLoading}>
                        Login
                    </CustomButton>
                </Stack>
            </Form>
        </Stack>
    );
});

Login.displayName = 'Login';

export default Login;
