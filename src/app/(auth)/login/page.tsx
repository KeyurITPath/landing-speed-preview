"use client"
import React, { useCallback } from 'react'
import { Container, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
// import Login from './login';
// import OTPVerification from './OTP';
import { AUTH_SIDE_IMAGE } from '@assets/images';
import Image from 'next/image';

const LoginWith2FA = () => {
    const { activeUI } = useSelector(({ auth }) => auth);

    // const renderContent = useCallback(() => {
    //     switch (activeUI) {
    //         case '2FA':
    //             return <OTPVerification />;
    //         default:
    //             return <Login />;
    //     }
    // }, [activeUI]);

    return (
        <React.Fragment>
            <Grid
                container
                spacing={2}
                sx={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Grid size={{ xs: 12, md: 5 }}>
                      { }
                    <Image loading="eager"
                        alt="login-visual"
                        src={AUTH_SIDE_IMAGE}
                        style={{ width: '100%', objectFit: 'cover' }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                    {/* <Container maxWidth="sm">{renderContent()}</Container> */}
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default LoginWith2FA;
