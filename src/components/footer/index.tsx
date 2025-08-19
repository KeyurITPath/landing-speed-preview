"use client"
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Link, Stack, styled, Typography, useMediaQuery } from '@mui/material';
import moment from 'moment';
// import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { SERVER_URL } from '@utils/constants';
// import FormControl from '../../../shared/inputs/form-control';
// import { toCapitalCase } from '../../../assets/utils/function';
import { setCountry, setLanguage } from '@store/features/defaults.slice';
// import { URLS } from '../../../constant/urls';
// import i18n from '../../../i18n';
import { IMAGES } from '@assets/images';
import { useTranslations } from 'next-intl';

const Logo = styled(Typography)(({ theme }) => ({
    [`${theme.breakpoints.down('md')}`]: {
        fontSize: 16
    },
    [`${theme.breakpoints.down('sm')}`]: {
        fontSize: 14
    },
    textWrap: 'nowrap',
    cursor: 'pointer'
}));

const LogoImage = styled('img')(({ theme, logoWidth, logHeight }) => ({
    width: logoWidth ? `${logoWidth}px` : '100%',
    maxWidth: logoWidth ? `${logoWidth}px` : 'auto',
    height: logHeight ? `${logHeight}px` : '100%',
    maxHeight: logHeight ? `${logHeight}px` : 'auto',
    objectFit: 'contain',
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
        width: '100%'
    }
}));

const Footer = () => {
    const dispatch = useDispatch();
    // // const history = useNavigate();
    const t = useTranslations();
    const {
        domainDetails,
        language,
        country,
        languages: { data: languages }
    } = useSelector((state) => state.defaults);

    const {
        countries: { data: countries }
    } = useSelector(({ countries }) => countries);

    const { country_code } = country || {};
    const { isLoggedIn } = useSelector(({ auth }) => auth);

    const { logo, email, legal_name, brand_name, logo_width, logo_height } =
        domainDetails?.data?.domain_detail || {};

    const [activeLanguage, setActiveLanguage] = useState(null);
    const [activeCountry, setActiveCountry] = useState('');

    // // const { pathname } = useLocation();
    // // const isCoursePage = useMatch(URLS.COURSE.path);

    const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const LOGO_URL = useMemo(() => {
        return logo ? SERVER_URL + logo : null;
    }, [logo]);

    const BRAND_NAME = useMemo(() => {
        return brand_name || '';
    }, [brand_name]);

    const SUPPORT_MAIL = useMemo(() => {
        return email || '';
    }, [email]);

    const LEGAL_NAME = useMemo(() => {
        return legal_name || '';
    }, [legal_name]);

    const COUNTRY_CODE = useMemo(() => {
        return country_code || '';
    }, [country_code]);

    const LOGO_WIDTH = useMemo(() => {
        return logo_width || null;
    }, [logo_width]);

    const LOGO_HEIGHT = useMemo(() => {
        return logo_height || null;
    }, [logo_height]);

    const chooseCountryHandler = useCallback(
        (event) => {
            const { value } = event.target;
            setActiveCountry(value);
            if (value) {
                dispatch(setCountry({ country_code: value }));
                window.location.reload();
            }
        },
        [dispatch]
    );

    const handleRedirect = useCallback(
        (path) => {
            // history(path);
        },
        // [history]
        []
    );

    useEffect(() => {
        setActiveLanguage(language?.id || languages?.[0]?.id);
    }, [language, languages]);

    useEffect(() => {
        if (COUNTRY_CODE) {
            setActiveCountry(COUNTRY_CODE);
        }
    }, [countries, COUNTRY_CODE]);

    const chooseLanguageHandler = useCallback(
        (event) => {
            const selectedLanguageId = event.target?.value;
            const selectedLanguage = languages?.find((lang) => lang.id === selectedLanguageId);

            if (selectedLanguage) {
                const selectedLanguageCode = selectedLanguage?.code;
                setActiveLanguage(selectedLanguageId);
                // i18n.changeLanguage(selectedLanguageCode);
                dispatch(setLanguage({ id: selectedLanguageId }));
            }
        },
        [languages, setActiveLanguage, dispatch]
    );

    const FOOTER_LINKS = [
        { href: '/refund-policies', label: t('refundPolicies') },
        { href: '/terms-of-service', label: t('termsOfService') },
        { href: '/privacy-policy', label: t('privacyPolicy') }
    ];

    const getLanguageFlag = useCallback((languageCode) => {
        const lowerName = (languageCode || '').toLowerCase();
        if (lowerName.includes('en')) {
            return IMAGES.englishFlag;
        } else if (lowerName.includes('es')) {
            return IMAGES.spanishFlag;
        } else if (lowerName.includes('fr')) {
            return IMAGES.frenchFlag;
        }
        return null;
    }, []);

    // const ALLOWED_LANGUAGE_PATHS = [
    //     URLS.HOME_PAGE.path,
    //     URLS.DASHBOARD.path,
    //     URLS.SETTINGS_AND_SUBSCRIPTION.path
    // ];
    // const EXCLUDED_PATHS = [
    //     URLS.DASHBOARD.path,
    //     URLS.SETTINGS_AND_SUBSCRIPTION.path,
    //     URLS.EMAIL_VERIFICATION.path,
    //     URLS.COMPLETE_PROFILE.path,
    //     URLS.TRIALS_ACTIVATION.path,
    //     URLS.SEARCH.path,
    //     URLS.COURSE_DETAILS.path,
    //     URLS.REDIRECTING_PAGE.path
    // ];

    // const shouldShowCountryDropdown = useMemo(() => {
    //     const isHomePage = pathname === URLS.HOME_PAGE.path;
    //     const isAllowedCoursePage = !!isCoursePage && !EXCLUDED_PATHS.includes(pathname);

    //     return isHomePage || isAllowedCoursePage;
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [pathname, isCoursePage]);

    return (
        <>
            <Stack
                id="footer"
                sx={{ borderTop: '1px solid #0000001A', bgcolor: 'rgba(255, 255, 255, 1)' }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: { xs: 0, sm: 2 },
                        px: { xs: 0, sm: 4 }
                    }}
                >
                    <Grid size={{ xs: 12 }}>
                        <Grid
                            container
                            spacing={{ xs: 2, sm: 6 }}
                            pt={{ xs: 2, sm: 6 }}
                            pb={{ xs: 2 }}
                            pr={{ xs: 2, sm: 0 }}
                            pl={{ xs: 2, sm: 0 }}
                        >
                            <Grid size={{ xs: 12 }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-start',
                                                        width: 'fit-content'
                                                    }}
                                                >
                                                    {LOGO_URL ? (
                                                        <LogoImage
                                                            src={LOGO_URL}
                                                            alt="logo"
                                                            logoWidth={LOGO_WIDTH}
                                                            logHeight={LOGO_HEIGHT}
                                                            // onClick={() =>
                                                            //     handleRedirect(
                                                            //         isLoggedIn
                                                            //             ? URLS.DASHBOARD.path
                                                            //             : URLS.HOME_PAGE.path
                                                            //     )
                                                            // }
                                                        />
                                                    ) : (
                                                        BRAND_NAME && (
                                                            <Logo
                                                                // onClick={() =>
                                                                //     handleRedirect(
                                                                //         isLoggedIn
                                                                //             ? URLS.DASHBOARD.path
                                                                //             : URLS.HOME_PAGE.path
                                                                //     )
                                                                // }
                                                            >
                                                                {BRAND_NAME.toUpperCase()}
                                                            </Logo>
                                                        )
                                                    )}
                                                </Box>
                                            </Grid>

                                            {/* {ALLOWED_LANGUAGE_PATHS.includes(location.pathname) && (
                                                <Grid size={{ xs: 12 }}>
                                                    <FormControl
                                                        label={t('languageLabel')}
                                                        placeholder={t('enterLanguage')}
                                                        name="language"
                                                        handleChange={chooseLanguageHandler}
                                                        value={toCapitalCase(
                                                            languages?.find(
                                                                (language) =>
                                                                    language?.id === activeLanguage
                                                            )?.name || ''
                                                        )}
                                                        renderSelectedValue={(selected) => (
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 1
                                                                }}
                                                            >
                                                                <img
                                                                    src={getLanguageFlag(
                                                                        languages?.find(
                                                                            (language) =>
                                                                                language?.id ===
                                                                                activeLanguage
                                                                        )?.code
                                                                    )}
                                                                    alt="language_flag"
                                                                    style={{
                                                                        width: 20,
                                                                        height: 20
                                                                    }}
                                                                />
                                                                {selected}
                                                            </Box>
                                                        )}
                                                        options={languages
                                                            ?.map((language) => ({
                                                                label:
                                                                    toCapitalCase(language?.name) ||
                                                                    '',
                                                                value: language?.id,
                                                                icon: (
                                                                    <img
                                                                        src={getLanguageFlag(
                                                                            language?.code
                                                                        )}
                                                                        alt="language_flag"
                                                                        style={{
                                                                            width: 20,
                                                                            height: 20
                                                                        }}
                                                                    />
                                                                )
                                                            }))
                                                            ?.filter(
                                                                (item) =>
                                                                    item.value !== activeLanguage
                                                            )}
                                                        size="small"
                                                        type="select"
                                                        sx={{
                                                            zIndex: '1 !important',
                                                            width: { xs: 200, sm: 220 }
                                                        }}
                                                    />
                                                </Grid>
                                            )} */}
                                            {/* {shouldShowCountryDropdown && (
                                                <Grid size={{ xs: 12 }}>
                                                    <FormControl
                                                        sx={{
                                                            zIndex: '1 !important',
                                                            width: { xs: 200, sm: 220 }
                                                        }}
                                                        {...{
                                                            label: t('Country'),
                                                            placeholder: t('enterCountry'),
                                                            name: 'country',
                                                            handleChange: chooseCountryHandler,
                                                            value: activeCountry || '',
                                                            options: countries?.map((country) => ({
                                                                label:
                                                                    toCapitalCase(country?.name) ||
                                                                    '',
                                                                value: country?.iso_code,
                                                                id: country?.iso_code
                                                            })),
                                                            size: 'small',
                                                            type: 'autocomplete'
                                                        }}
                                                    />
                                                </Grid>
                                            )} */}
                                            {COUNTRY_CODE && (
                                                <Grid size={{ xs: 12 }}>
                                                    <Typography
                                                        sx={{
                                                            color: '#304BE0',
                                                            fontSize: { xs: 16 }
                                                        }}
                                                    >
                                                        {`${t('country_code_label')}: `}
                                                        <span style={{ color: '#0E0E0E' }}>
                                                            {COUNTRY_CODE}
                                                        </span>
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Box
                                            width={'100%'}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: { xs: 'row', sm: 'column' },
                                                alignItems: { xs: 'center', sm: 'flex-end' }
                                            }}
                                            gap={{ xs: 2, sm: 0 }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: '#304BE0',
                                                    fontSize: 16,
                                                    mb: isMobile ? 0 : 2
                                                }}
                                            >
                                                {t('contact_us')}:{' '}
                                            </Typography>
                                            <Link
                                                sx={{
                                                    fontSize: { xs: 16, sm: 20 },
                                                    mt: {
                                                        xs: '0px!important',
                                                        sm: 'unset'
                                                    },
                                                    color: '#0E0E0E',
                                                    lineHeight: '28px'
                                                }}
                                                href={`mailto:${SUPPORT_MAIL}`}
                                                underline="hover"
                                            >
                                                {SUPPORT_MAIL}
                                            </Link>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Grid
                                    container
                                    spacing={{ xs: 6, sm: 12 }}
                                    sx={{ flexDirection: { xs: 'column-reverse', sm: 'row' } }}
                                >
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Stack
                                            width={mdDown ? '100%' : 'auto'}
                                            direction={'row'}
                                            spacing={{ xs: 0.5, sm: 1 }}
                                            alignItems={mdDown ? 'center' : 'flex-start'}
                                            sx={{
                                                '& > a': {
                                                    fontSize: { xs: 13, sm: 16 },
                                                    color: 'text.secondary'
                                                },
                                                flexFlow: 'wrap',
                                                justifyContent: {
                                                    xs: 'space-evenly',
                                                    sm: 'flex-start'
                                                }
                                            }}
                                        >
                                            {/* {FOOTER_LINKS?.map((link, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1
                                                    }}
                                                >
                                                    {index > 0 && (
                                                        <Typography color="text.secondary">
                                                            •
                                                        </Typography>
                                                    )}
                                                    <Link
                                                        sx={{
                                                            fontSize: { xs: 13, sm: 16 },
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                        href={link.href}
                                                        underline="hover"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </Box>
                                            ))} */}
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography
                                            fontSize={{ xs: 13, sm: 16 }}
                                            mt={{ xs: 1, sm: 0 }}
                                            color="text.secondary"
                                            textAlign={mdDown ? 'flex-start' : 'right'}
                                        >
                                            {/* {t('copyright', {
                                                year: moment().format('YYYY'),
                                                name: LEGAL_NAME
                                            })} */}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Stack>
        </>
    );
};
export default Footer;
