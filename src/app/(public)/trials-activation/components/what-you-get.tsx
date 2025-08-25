import { Stack, Typography } from '@mui/material';
import { IMAGES } from '@/assets/images';
import Image from 'next/image';
import { linearGradients } from '@/theme/color';
import { useTranslations, useMessages } from 'next-intl';

const WhatYouGet = ({ BRAND_NAME }: any) => {
    const t = useTranslations();
    const messages = useMessages()

    const CATEGORIES_BADGE = messages['categoriesBadge']

    return   <Stack sx={{ gap: { xs: 2.5, sm: 4 } }}>
            <Typography variant="h4" sx={{ fontWeight: 500 }}>
                {t('whatYouGetTitle')}
            </Typography>

            <Stack>
                <Image
                    src={IMAGES.whatYouGetBanner}
                    alt="coursesBanner"
                    width={900}
                    height={398}
                    style={{
                        objectFit: 'cover',
                        aspectRatio: '16 / 8',
                        borderRadius: '12px'
                    }}
                />
                <Stack
                    sx={{
                        bgcolor: 'common.white',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: 'primaryNew.main',
                        borderRadius: 1.5,
                        p: { xs: 2, sm: 2.5 },
                        mx: { xs: 2, sm: 3 },
                        gap: { xs: 2, sm: 2.5 },
                        mt: { xs: '-15%', sm: '-6%' }
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, textAlign: { xs: 'center', sm: 'left' } }}
                    >
                        {t('programsTitle')}
                    </Typography>
                    <Stack
                        sx={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: { xs: 'center', sm: 'start' },
                            gap: 1
                        }}
                    >
                        {CATEGORIES_BADGE?.map((text: any, index: number) => (
                            <Stack
                                key={index}
                                sx={{
                                    px: { xs: 2, sm: 2 },
                                    py: { xs: 0.5 },
                                    borderRadius: 0.5,
                                    background: linearGradients.primary
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        textTransform: 'uppercase',
                                        // fontWeight: 500,
                                        textAlign: 'center',
                                        color: 'common.white'
                                    }}
                                >
                                    {text}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </Stack>
            <Stack>
                <Image
                    src={IMAGES.communityBannerNew}
                    alt="coursesBanner"
                    width={900}
                    height={398}
                    style={{
                        objectFit: 'cover',
                        aspectRatio: '16 / 8',
                        borderRadius: '12px'
                    }}
                />
                <Stack
                    sx={{
                        bgcolor: 'common.white',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: 'primaryNew.main',
                        borderRadius: 1.5,
                        p: { xs: 2, sm: 2.5 },
                        mx: { xs: 2, sm: 3 },
                        gap: { xs: 2, sm: 2.5 },
                        mt: { xs: '-15%', sm: '-6%' }
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, textAlign: { xs: 'center', sm: 'left' } }}
                    >
                        {t('communityTitle')}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                        {t('communityDescription', { brand_name: BRAND_NAME })}
                    </Typography>
                </Stack>
            </Stack>

            <Typography variant="h5" sx={{ fontWeight: 500 }}>
                {t('brandValuesTitle', { brand_name: BRAND_NAME })}
            </Typography>
            <Typography variant="body1">{t('brandValuesDescription')}</Typography>
        </Stack>

}
export default WhatYouGet;
