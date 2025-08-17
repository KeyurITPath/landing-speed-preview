import { Box, Container, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import Image from '@shared/image';
import CustomButton from '@shared/button';
// import { AUTHOR_URL } from '@utils/constants';
// import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { BECOME_AUTHOR_IMAGES } from '@assets/images';
import { useTranslations } from 'next-intl';

const BecomeAuthor = () => {
    const t = useTranslations();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const BECOME_AUTHORS = [
        BECOME_AUTHOR_IMAGES.becomeAuthor1,
        BECOME_AUTHOR_IMAGES.becomeAuthor2,
        BECOME_AUTHOR_IMAGES.becomeAuthor3
    ];

    // const { domainDetails } = useSelector((state) => state.defaults);
    // const DOMAIN_DETAILS = useMemo(() => {
    //     const clone = { ...domainDetails };
    //     return {
    //         BRAND_NAME: clone?.data?.domain_detail?.brand_name || ''
    //     };
    // }, [domainDetails]);

    return (
        <Box
            sx={{
                width: '100%',
                ...( !isMobile && { backgroundColor: 'primary.background' } ),
                ...( !isMobile && { borderTopRightRadius: { sm: '200px', md: '400px' } } ),
                py: { xs: 2, md: 6 },
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                marginBottom: { xs: '32px !important', sm: '0px !important' }
            }}
            id="about"
        >
            <Container maxWidth="lg" component={Grid} container>
                <Grid size={{ xs: 12 }}>
                    <Grid
                        container
                        spacing={2}
                        sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' } }}
                    >
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 7 }}>
                                    <Image
                                        src={BECOME_AUTHORS[0].src}
                                        alt="Become Author"
                                        aspectRatio="5/6"
                                        containerSx={{
                                            width: '100%',
                                            height: '100%',
                                            maxWidth: '320px'
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 5 }}>
                                    <Stack spacing={2}>
                                        <Image
                                            src={BECOME_AUTHORS[1].src}
                                            alt="Become Author"
                                            aspectRatio="10/9"
                                            containerSx={{
                                                width: '100%',
                                                height: '100%',
                                                maxWidth: '200px'
                                            }}
                                        />
                                        <Image
                                            src={BECOME_AUTHORS[2].src}
                                            alt="Become Author"
                                            aspectRatio="10/9"
                                            containerSx={{
                                                width: '100%',
                                                height: '100%',
                                                maxWidth: '200px'
                                            }}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Stack
                                spacing={3}
                                pl={{ xs: 0, sm: 3, md: 5 }}
                                mt={{ xs: 2, md: 3 }}
                                maxWidth={{ xs: '100%', sm: '400px' }}
                                mx={{ xs: 'auto', sm: 0 }}
                            >
                                <Typography variant="h4" fontWeight={500}>
                                    {t('become_an_author')}
                                </Typography>
                                <Typography sx={{ xs: 14, sm: 16 }}>
                                    {/* <Trans
                                        i18nKey="join_brand"
                                        values={{ brand_name: DOMAIN_DETAILS.BRAND_NAME }}
                                        components={{
                                            span: <span style={{ color: '#304BE0' }} />
                                        }}
                                    /> */}
                                </Typography>
                                <Typography sx={{ xs: 14, sm: 16 }}>
                                    {/* <Trans
                                        i18nKey="learn_from_creatives"
                                        values={{ brand_name: DOMAIN_DETAILS.BRAND_NAME }}
                                    /> */}
                                </Typography>

                                <Stack
                                    sx={{
                                        display: 'flex',
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        flexDirection: { xs: 'column', sm: 'row' }
                                    }}
                                    gap={{ xs: 2, sm: 4 }}
                                >
                                    <CustomButton
                                        variant="gradient"
                                        size={isMobile ? 'medium' : 'large'}
                                        sx={{
                                            borderRadius: '8px',
                                            fontSize: { xs: '14px', sm: '16px' }
                                        }}
                                        onClick={() => {
                                            window.location.href = 'https://authors.edzen.org/';
                                        }}
                                    >
                                        {t('teach_course')}
                                    </CustomButton>
                                    <CustomButton
                                        variant="gradient"
                                        size={isMobile ? 'medium' : 'large'}
                                        sx={{
                                            borderRadius: '8px',
                                            fontSize: { xs: '14px', sm: '16px' }
                                        }}
                                        // onClick={() => {
                                        //     window.open(
                                        //         AUTHOR_URL,
                                        //         '_blank',
                                        //         'noopener,noreferrer'
                                        //     );
                                        // }}
                                    >
                                        {t('author_login')}
                                    </CustomButton>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default BecomeAuthor;
