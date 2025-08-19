import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

const RenderCardLoading = () => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: { xs: '10px', sm: '14px' },
        margin: '0',
        height: '100%',
        boxShadow: '2px 4px 8px rgba(0,0,0,0.5)',
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Skeleton
          variant='rectangular'
          height={120}
          width='100%'
          sx={{ borderRadius: { xs: '10px 10px 0 0px', sm: '14px 14px 0 0' } }}
        />

        <Skeleton
          variant='text'
          width={80}
          height={22}
          sx={{ position: 'absolute', top: 10, left: 10 }}
        />
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          padding: '0 15px 15px 15px !important',
        }}
      >
        <Skeleton variant='text' height={40} width='100%' />
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          width='100%'
        >
          <Stack direction='row' alignItems='center' spacing={1}>
            {' '}
            <>
              <Skeleton variant='circular' width={30} height={30} />
              <Skeleton variant='text' width={80} />
            </>
          </Stack>

          <Stack direction='row' alignItems='center' spacing={0.5}>
            <Skeleton variant='text' width={30} />
          </Stack>
        </Stack>
        <hr
          style={{
            margin: '14px -24px',
            opacity: 0.2,
          }}
        />
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Stack direction='row' alignItems='center' spacing={1}>
            <>
              <Skeleton variant='text' width={40} />
              <Skeleton variant='text' width={60} />
            </>
          </Stack>

          <Skeleton variant='circular' width={30} height={30} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RenderCardLoading;
