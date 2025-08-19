import React from 'react';
import { alpha, Box, Stack, styled, Tooltip, tooltipClasses, Typography } from '@mui/material';
import { primary, success } from '@/theme/color';
import Image from 'next/image';
import useNewPassword from './use-new-password';
import { routes } from '@/utils/constants/routes';
import CustomButton from '@/shared/button';
import FormControl from '@/shared/inputs/form-control';
import Form from '@/shared/forms';
import { OVERRIDE } from '@/theme/basic';
import { PASSWORD_VALIDATION_RULES } from '@/utils/constants';

const LightTooltip = styled(({ className, ...props }: any) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        boxShadow: theme.shadows[10]
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: alpha(theme.palette.common.white, 1),
        color: theme.palette.primary.main,
        boxShadow: theme.shadows[10],
        padding: 2,
        fontSize: 11
    }
}));

const LogoImage = styled(Image)(({ theme }) => ({
    objectFit: 'contain',
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
        width: '100%'
    }
}));

const NewPassword = () => {

    const { LOGO_URL, handleSubmit, logo_height, logo_width, router, passwordValidation, handleBlur, handleChange, isLoading, errors, showPasswordTooltip, setShowPasswordTooltip, touched, values } = useNewPassword()

    return <Stack sx={{ gap: 4 }}>
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
                <Typography variant="h4" sx={{ color: 'common.black' }}>
                    Create new password
                </Typography>
            </Stack>
        </Stack>
        <Form
            {...{ handleSubmit }}
            sx={{
                ...OVERRIDE({}).FLEX,
                flexDirection: 'column',
                justifyContent: 'start'
            }}
        >
            <Stack sx={{ width: '100%', gap: 4 }}>
                <Stack sx={{ width: '100%', gap: 2 }}>
                    <LightTooltip
                        title={
                            <Box
                                sx={{
                                    backgroundColor: 'white',
                                    borderRadius: '5px',
                                    py: 0.5,
                                    my: 0.5
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        my: 0.5,
                                        px: 1
                                    }}
                                >
                                    Password Must
                                </Typography>
                                {PASSWORD_VALIDATION_RULES.map((item) => {
                                    return (
                                        <Box
                                            key={item?.type}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                px: 1
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: 12,
                                                    width: 12,
                                                    backgroundColor: passwordValidation[
                                                        item?.type
                                                    ]
                                                        ? success.dark
                                                        : primary.alpha30,
                                                    mr: 1,
                                                    borderRadius: 5
                                                }}
                                            />
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ color: 'black' }}
                                            >
                                                {item?.label}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        }
                        placement="left"
                        arrow
                        open={showPasswordTooltip}
                    >
                        <FormControl
                            label="New Password"
                            placeholder="Enter New Password"
                            position="end"
                            type="password"
                            fullWidth
                            onFocus={() => setShowPasswordTooltip(true)}
                            name="new_password"
                            handleChange={handleChange}
                            error={touched.new_password && errors.new_password}
                            value={values.new_password}
                            onBlur={(e: any) => {
                                setShowPasswordTooltip(false);
                                handleBlur(e);
                            }}
                            size="large"
                        />
                    </LightTooltip>
                    <FormControl
                        label="Confirm Password"
                        placeholder="Re-enter new password"
                        position="end"
                        type="password"
                        fullWidth
                        name="confirm_password"
                        handleChange={handleChange}
                        error={touched.confirm_password && errors.confirm_password}
                        value={values.confirm_password}
                        onBlur={handleBlur}
                        size="large"
                    />
                </Stack>

                <CustomButton type="submit" loading={isLoading} variant="gradient" size="large">
                    Reset Password
                </CustomButton>
            </Stack>
        </Form>
    </Stack>;
};

export default NewPassword;
