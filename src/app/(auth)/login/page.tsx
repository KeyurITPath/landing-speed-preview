import React from 'react';
import { Container, Grid } from '@mui/material';
import { AUTH_SIDE_IMAGE } from '@assets/images';
import Image from 'next/image';
import RenderComponent from './render-component';

const LoginWith2FA = () => {
  return (
    <React.Fragment>
      <Grid
        container
        spacing={2}
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid size={{ xs: 12, md: 5 }}>
          <Image
            loading='eager'
            alt='login-visual'
            src={AUTH_SIDE_IMAGE}
            width={0}
            height={0}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Container maxWidth='sm'>
            <RenderComponent />
          </Container>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default LoginWith2FA;
