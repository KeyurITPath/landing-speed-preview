import { Container, Skeleton, Stack, Grid2, Box } from '@mui/material';

const Loader = () => {
    return (
        <Container maxWidth="lg" sx={{ width: '100%', paddingY: { xs: 2, sm: 3 } }}>
            <Grid2 container spacing={{ xs: 2, sm: 6 }}>
                {/* Video and Lessons Section */}
                <Grid2 container spacing={{ xs: 2, sm: 4 }} sx={{ width: '100%' }}>
                    <Grid2 size={{ xs: 12, sm: 8 }}>
                        <Skeleton
                            variant="rounded"
                            sx={{
                                width: '100%',
                                height: { xs: '100%', sm: '425px' },
                                borderRadius: '12px'
                            }}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                        <Box sx={{ height: '425px' }}>
                            {[1, 2, 3].map((item) => (
                                <Skeleton
                                    key={item}
                                    variant="rounded"
                                    sx={{
                                        width: '100%',
                                        height: '120px',
                                        borderRadius: '12px',
                                        mb: 1
                                    }}
                                />
                            ))}
                        </Box>
                    </Grid2>
                </Grid2>

                {/* Course Content Section */}
                <Grid2 size={{ xs: 12 }}>
                    <Box px={{ xs: 2, sm: 0 }}>
                        <Stack spacing={3}>
                            <Skeleton variant="rounded" sx={{ height: '40px', width: '300px' }} />
                            <Stack spacing={2}>
                                <Skeleton
                                    variant="rounded"
                                    sx={{ height: '100px', width: '100%' }}
                                />
                                <Stack spacing={1}>
                                    {[1, 2, 3].map((item) => (
                                        <Skeleton
                                            key={item}
                                            variant="rounded"
                                            sx={{ height: '24px', width: '100%' }}
                                        />
                                    ))}
                                </Stack>
                            </Stack>

                            {/* Action Buttons */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                {[1, 2, 3].map((item) => (
                                    <Skeleton
                                        key={item}
                                        variant="rounded"
                                        sx={{
                                            height: '45px',
                                            width: { xs: '100%', sm: '150px' }
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Stack>
                    </Box>
                </Grid2>

                {/* Recommended Courses Section */}
                <Grid2 size={{ xs: 12 }}>
                    <Box px={{ xs: 2, sm: 0 }}>
                        <Stack spacing={3}>
                            <Skeleton variant="rounded" sx={{ height: '40px', width: '300px' }} />
                            <Grid2 container spacing={2}>
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <Grid2 key={item} size={{ xs: 12, sm: 6, md: 2.4 }}>
                                        <Skeleton
                                            variant="rounded"
                                            sx={{
                                                height: '280px',
                                                width: '100%',
                                                borderRadius: '14px'
                                            }}
                                        />
                                    </Grid2>
                                ))}
                            </Grid2>
                        </Stack>
                    </Box>
                </Grid2>
            </Grid2>
        </Container>
    );
};

export default Loader;
