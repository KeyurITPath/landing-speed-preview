import React from 'react';
import { Container, Grid2 } from '@mui/material';
import { AUTH_SIDE_IMAGE } from '@assets/images';
import Image from 'next/image';
import ForgotPasswordProvider from './provider';

const ForgotPasswordWithReset = () => {
  return (
    <React.Fragment>
      <Grid2
        container
        spacing={2}
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid2 size={{ xs: 12, md: 5 }}>
          <Image
            loading='eager'
            alt='login-visual'
            src={AUTH_SIDE_IMAGE}
            width={0}
            height={0}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Container maxWidth='sm'>
            <ForgotPasswordProvider />
          </Container>
        </Grid2>
      </Grid2>
    </React.Fragment>
  );
};

export default ForgotPasswordWithReset;
