import { useMemo } from 'react';
import { Box, Chip, Grid2, Stack, Typography } from '@mui/material';
import { ICONS } from '@assets/icons';
import CustomButton from '@shared/button';
import { formatCurrency } from '@utils/helper';
import { getAccessOpen } from '@store/features/course.slice';
import { useTranslations } from 'next-intl';

const CoursePurchaseDetails = ({
        course,
        isMobile,
        data,
        // dispatch,
        isBecomeAMemberWithVerified,
        handleStartFree,
        isBecomeVerifiedAndSubscribed,
        isUserPurchasedCourse,
        handleProceedToWatch
    }) => {


    const  t = useTranslations();
    const shouldShowPriceDetails =
        !isBecomeVerifiedAndSubscribed && !isBecomeAMemberWithVerified && !isUserPurchasedCourse;
    const shouldExpandGrid =
        isUserPurchasedCourse || isBecomeAMemberWithVerified || isBecomeVerifiedAndSubscribed;

    const prices = useMemo(() => {
        const clone = { ...course };
        if (clone?.course_prices?.length) {
            const currentDefaultPrice = clone?.course_prices?.[0];
            return {
                price: currentDefaultPrice?.price || 0,
                currency: currentDefaultPrice?.currency?.name || 'USD'
            };
        } else
            return {
                price: 0,
                currency: 'USD'
            };
    }, [course]);

    const actualPrice = useMemo(() => {
        const calculatedDiscount = 100 - course?.discount;
        const actualPrice = (prices.price / calculatedDiscount) * 100 || 0;

        return formatCurrency(actualPrice, prices.currency);
    }, [course?.discount, prices.currency, prices.price]);

    const details = useMemo(() => {
        return [
            {
                id: 1,
                icon: ICONS.Users,
                label: `${data?.participants || 0} ${t('users')}`
            },
            {
                id: 2,
                icon: ICONS.BigFillStar,
                label: `${Number(data?.rating).toFixed(1) || 0} / ${data?.amount_of_review || 0} ${t('positive_reviews')}`
            },
            {
                id: 3,
                icon: ICONS.PLAY_CIRCLE,
                label: `${data?.feature_1}`
            },
            {
                id: 4,
                icon: ICONS.UnClockBold,
                label: `${data?.feature_2}`
            }
        ];
    }, [data, t]);

    return (
        <Grid2
            container
            spacing={2}
            sx={!isMobile && { position: 'sticky', top: 48, left: 0, zIndex: 9 }}
        >
            <Grid2 size={{ xs: 12 }}>
                <Box
                    sx={{
                        border: '1px solid var(--Blue, #304BE0)',
                        borderRadius: '10px',
                        boxShadow: '0px 0px 15px 0px #0000001A',
                        backgroundColor: '#F5F7FF'
                    }}
                    p={3}
                >
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12 }}>
                            <Grid2
                                container
                                spacing={2}
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                {shouldShowPriceDetails && (
                                    <Grid2 size={{ xs: 8, md: 7 }}>
                                        <Box
                                            gap={2}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'start',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    fontSize={{ xs: 34, sm: 38 }}
                                                    fontWeight={500}
                                                    color="primary.typography"
                                                >
                                                    {formatCurrency(prices.price, prices.currency)}{' '}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={t('sale')}
                                                sx={{
                                                    bgcolor: '#304BE0',
                                                    color: 'initial.white',
                                                    fontSize: { xs: 12, sm: 14 },
                                                    fontWeight: 500,
                                                    height: '22px',
                                                    borderRadius: '6px',
                                                    '& .MuiChip-label': {
                                                        px: 1,
                                                        py: 0.5
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Typography
                                            fontSize={{ xs: 14, sm: 16 }}
                                            fontWeight={500}
                                            color="primary.typography"
                                        >
                                            {course?.discount && (
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        fontWeight: 400,
                                                        color: '#808080',
                                                        textDecoration: 'line-through'
                                                    }}
                                                >
                                                    {actualPrice || 0}
                                                </Box>
                                            )}{' '}
                                            {course?.discount && (
                                                <Box component="span" sx={{ fontWeight: 400 }}>
                                                    - {t('discount')} {course?.discount || 0}%
                                                </Box>
                                            )}
                                        </Typography>
                                    </Grid2>
                                )}
                                <Grid2
                                    size={{
                                        xs: shouldExpandGrid ? 12 : 4,
                                        md: shouldExpandGrid ? 12 : 5
                                    }}
                                >
                                    <CustomButton
                                        sx={{
                                            borderRadius: '5px',
                                            minHeight: '44px',
                                            width: { xs: '100%', sm: '-webkit-fill-available' },
                                            display: 'flex',
                                            flexDirection: 'column',
                                            fontSize: { xs: 14, sm: 18 },
                                            fontWeight: 600,
                                            px: 4
                                        }}
                                        onClick={() => {
                                            if (
                                                isUserPurchasedCourse ||
                                                isBecomeVerifiedAndSubscribed
                                            ) {
                                                handleProceedToWatch();
                                            } else if (isBecomeAMemberWithVerified) {
                                                handleStartFree(course?.id, data?.header);
                                            } else {
                                                // dispatch(getAccessOpen());
                                            }
                                        }}
                                        variant="gradient"
                                    >
                                        {isUserPurchasedCourse || isBecomeVerifiedAndSubscribed
                                            ? t('proceed_to_watch')
                                            : isBecomeAMemberWithVerified
                                              ? t('try_for_free')
                                              : t('buy')}
                                    </CustomButton>
                                </Grid2>
                            </Grid2>
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                            <Typography fontSize={12} color="primary.typography">
                                {/* <Trans
                                    i18nKey="enjoy_course"
                                    components={{ span: <span style={{ fontWeight: 500 }} /> }}
                                /> */}
                                {/* {t("enjoy_course")} */}
                            </Typography>
                        </Grid2>
                    </Grid2>
                </Box>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
                <Stack spacing={2} mt={1}>
                    {details?.map((item, index) => {
                        return (
                            <Box gap={2} key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                <item.icon style={{ color: '#304BE0', width: 22, height: 22 }} />
                                <Typography fontSize={14} color="primary.typography">
                                    {item?.label}
                                </Typography>
                            </Box>
                        );
                    })}
                </Stack>
            </Grid2>
        </Grid2>
    );
};

export default CoursePurchaseDetails;
