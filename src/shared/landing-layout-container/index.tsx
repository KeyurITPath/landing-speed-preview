import { Container, Stack } from '@mui/material';

const LandingLayoutContainer = ({
  children,
  sx,
  containerSx,
  ...props
}: any) => {
  return (
    <Stack sx={{ bgcolor: '#f5f2f0' }}>
      <Container
        maxWidth='lg'
        sx={{
          bgcolor: 'common.white',
          pt: { xs: 3, sm: 5 },
          pb: { xs: 6, sm: 7 },
          display: 'flex',
          justifyContent: 'center',
          ...containerSx,
        }}
      >
        <Stack
          sx={{
            gap: { xs: 2.5, sm: 4 },
            maxWidth: '1000px',
            width: '100%',
            ...sx,
          }}
          {...props}
        >
          {children}
        </Stack>
      </Container>
    </Stack>
  );
};

export default LandingLayoutContainer;
