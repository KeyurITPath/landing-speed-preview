"use client"
import { Stack, Typography } from '@mui/material';
import CustomButton from '@/shared/button';
import { useRouter } from 'next/navigation';
import { routes } from '@/utils/constants/routes';

const NoData = () => {
    const router = useRouter()
    return (
        <Stack
            sx={{
                minHeight: 'calc(100vh - 72.5px)',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                p: 3
            }}
        >
            <Typography variant="h5" color="initial" sx={{ textAlign: 'center' }}>
                Sorry, the page you&apos;re looking for doesn&apos;t exist.
            </Typography>
            <CustomButton size="large" variant="gradient" onClick={() => router.push(routes.public.home)}>
                GO TO HOMEPAGE
            </CustomButton>
        </Stack>
    );
};

export default NoData;
