import { Box, Stack, Typography, keyframes } from '@mui/material';
import { useTranslations } from 'next-intl';
import CustomButton from '@/shared/button';
import { SIDE_BANNER_IMAGE } from '@/assets/images';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const scrollAnimation = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(calc(-50%)); }
`;

const TrialSideBanner = ({ dashboardData }: any) => {
    const {
        transformDataForTrialSideBanner,
        startTrialSubmitForSideBanner,
        isStartTrialSubmitForSideBannerLoading: loading,
        BRAND_NAME: brand_name,
        isBecomeAMemberWithVerified
    } = dashboardData;

    const t = useTranslations();
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [startAnimation, setStartAnimation] = useState(false);
    const loadedImagesCount = useRef(0);
    const totalExpectedImages = useRef(0);

    const { title, description } = transformDataForTrialSideBanner || {};

    const SIDE_BANNER_IMAGES = [
        SIDE_BANNER_IMAGE.sideBanner1,
        SIDE_BANNER_IMAGE.sideBanner2,
        SIDE_BANNER_IMAGE.sideBanner3,
        SIDE_BANNER_IMAGE.sideBanner4,
        SIDE_BANNER_IMAGE.sideBanner5,
        SIDE_BANNER_IMAGE.sideBanner6,
        SIDE_BANNER_IMAGE.sideBanner7,
        SIDE_BANNER_IMAGE.sideBanner8,
        SIDE_BANNER_IMAGE.sideBanner9
    ];

    const quadruplicatedImages = [
        ...SIDE_BANNER_IMAGES,
        ...SIDE_BANNER_IMAGES,
        ...SIDE_BANNER_IMAGES,
        ...SIDE_BANNER_IMAGES
    ];

    const leftColumnImages = quadruplicatedImages.filter((_, i) => i % 2 === 0);
    const rightColumnImages = quadruplicatedImages.filter((_, i) => i % 2 !== 0);

    useEffect(() => {
        totalExpectedImages.current = leftColumnImages.length + rightColumnImages.length;
    }, [leftColumnImages.length, rightColumnImages.length]);

    const handleImageLoad = () => {
        loadedImagesCount.current += 1;
        if (loadedImagesCount.current >= Math.min(4, totalExpectedImages.current)) {
            setImagesLoaded(true);
        }
    };

    useEffect(() => {
        if (imagesLoaded) {
            const timer = setTimeout(() => {
                setStartAnimation(true);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [imagesLoaded]);

    const animationDuration = Math.max(40, SIDE_BANNER_IMAGES.length * 5);

    return (
        <Box px={{ xs: 2, sm: 0 }}>
            <Box
                sx={{
                    width: '100%',
                    background: 'linear-gradient(to bottom, #B14EFE, #6CC2FF, #304BE0)',
                    px: 2,
                    py: { xs: 2 },
                    borderRadius: '14px'
                }}
            >
                <Stack alignItems="center" spacing={{ xs: 2, sm: 5 }}>
                    <Typography
                        sx={{
                            fontSize: { xs: 28, sm: 24 },
                            fontWeight: 600,
                            color: 'white',
                            lineHeight: 1.2
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{ __html: description }}
                        sx={{
                            fontSize: 16,
                            fontWeight: 400,
                            color: 'white'
                        }}
                    />

                    <CustomButton
                        color="common.black"
                        sx={{
                            width: { xs: '100%', sm: 'auto' },
                            background: 'rgba(255, 255, 255, 1)',
                            borderRadius: '8px',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.14)',
                            fontSize: 18,
                            fontWeight: 500,
                            textAlign: 'center',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.8)'
                            },
                            '&:disabled': {
                                background: 'rgba(255, 255, 255, 0.5)'
                            }
                        }}
                        {...{ loading, disabled: !isBecomeAMemberWithVerified || loading }}
                        onClick={startTrialSubmitForSideBanner}
                    >
                        {t('try_brand_name_courses', { brand_name })}
                    </CustomButton>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            overflow: 'hidden',
                            height: '300px',
                            width: '100%',
                            opacity: imagesLoaded ? 1 : 0.1,
                            transition: 'opacity 0.8s ease-in',
                            position: 'relative'
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                overflow: 'hidden',
                                position: 'relative',
                                willChange: 'transform',
                                perspective: 1000,
                                backfaceVisibility: 'hidden'
                            }}
                        >
                            <Box
                                sx={{
                                    animation: startAnimation
                                        ? `${scrollAnimation} ${animationDuration}s linear infinite`
                                        : 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    position: 'absolute',
                                    width: '100%',
                                    willChange: 'transform',
                                    transform: 'translate3d(0,0,0)'
                                }}
                            >
                                {leftColumnImages.map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Image width={180} height={200}
                                            src={item}
                                            alt={`trial-banner-${index}`}
                                            loading={index < 4 ? 'eager' : 'lazy'}
                                            style={{
                                                borderRadius: '14px',
                                                width: '100%',
                                                maxWidth: 180,
                                                maxHeight: 200,
                                                objectFit: 'cover',
                                                display: 'block'
                                            }}
                                            onLoad={handleImageLoad}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                flex: 1,
                                overflow: 'hidden',
                                position: 'relative',
                                willChange: 'transform',
                                perspective: 1000,
                                backfaceVisibility: 'hidden'
                            }}
                        >
                            <Box
                                sx={{
                                    animation: startAnimation
                                        ? `${scrollAnimation} ${animationDuration + 5}s linear infinite`
                                        : 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    position: 'absolute',
                                    width: '100%',
                                    transform: 'translate3d(0, -10%, 0)',
                                    willChange: 'transform'
                                }}
                            >
                                {rightColumnImages.map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Image width={180} height={200}
                                            src={item}
                                            alt={`trial-banner-alt-${index}`}
                                            loading={index < 4 ? 'eager' : 'lazy'}
                                            style={{
                                                borderRadius: '14px',
                                                width: '100%',
                                                maxWidth: 180,
                                                maxHeight: 200,
                                                objectFit: 'cover',
                                                display: 'block'
                                            }}
                                            onLoad={handleImageLoad}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default TrialSideBanner;
