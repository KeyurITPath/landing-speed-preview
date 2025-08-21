'use client';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid2,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import moment from 'moment';
import { SERVER_URL } from '@utils/constants';
import { setCountry, setLanguage } from '@store/features/defaults.slice';
import { IMAGES } from '@assets/images';
import { useTranslations } from 'next-intl';
import { routes } from '@/utils/constants/routes';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { toCapitalCase } from '@/utils/helper';
import FormControl from '@/shared/inputs/form-control';
import Link from 'next/link';
import { setLanguageCookie, setCountryCookie } from '@/utils/cookies';
import {
  changeLanguageAction,
  changeCountryAction,
} from '@/app/actions/language';

const Logo = styled(Typography)(({ theme }) => ({
  [`${theme.breakpoints.down('md')}`]: {
    fontSize: 16,
  },
  [`${theme.breakpoints.down('sm')}`]: {
    fontSize: 14,
  },
  textWrap: 'nowrap',
  cursor: 'pointer',
}));

const LogoImage = styled(Image)(({ theme }) => ({
  objectFit: 'contain',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const Footer = ({
  domainDetails,
  country_code,
  languages,
  countries,
  language_id,
}: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslations();

  const { isLoggedIn } = useSelector(({ auth }: any) => auth);

  const { logo, email, legal_name, brand_name, logo_width, logo_height } =
    domainDetails?.data?.domain_detail || {};

  // Initialize with first available language to ensure SSR compatibility
  const [activeLanguage, setActiveLanguage] = useState(language_id);
  const [activeCountry, setActiveCountry] = useState(country_code);

  const pathname = usePathname();
  const isCoursePage = pathname === routes.public.search;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'), {
      noSsr: true,
    });

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

  const getLanguageFlag = useCallback((languageCode: any) => {
    const lowerName = (languageCode || '').toLowerCase();
    if (lowerName.includes('en')) {
      return IMAGES.englishFlag;
    } else if (lowerName.includes('es')) {
      return IMAGES.spanishFlag;
    } else if (lowerName.includes('fr')) {
      return IMAGES.frenchFlag;
    } else return '';
  }, []);

  // Memoize current language for better performance
  const currentLanguage = useMemo(() => {
    return languages?.find((language: any) => language?.id === activeLanguage);
  }, [languages, activeLanguage]);

  // Memoize language options for better performance
  const languageOptions = useMemo(() => {
    return languages
      ?.map((language: any) => ({
        label: toCapitalCase(language?.name) || '',
        value: language?.id,
        icon: (
          <Image
            src={getLanguageFlag(language?.code)}
            alt='language_flag'
            width={20}
            height={20}
          />
        ),
      }))
      ?.filter((item: any) => item.value !== activeLanguage);
  }, [languages, activeLanguage, getLanguageFlag]);

  const ALLOWED_LANGUAGE_PATHS = [
    routes.public.home,
    routes.private.dashboard,
    routes.private.settings_and_subscription,
  ];

  // Memoize whether to show language selector based on pathname
  const shouldShowLanguageSelector = useMemo(() => {
    return ALLOWED_LANGUAGE_PATHS.includes(pathname);
  }, [pathname]);

  const chooseCountryHandler = useCallback(
    async (event: any) => {
      const { value } = event.target;
      setActiveCountry(value);
      if (value) {
        // Set in Redux store for immediate UI feedback
        dispatch(setCountry({ country_code: value }));

        // Use server action to set cookie properly
        const formData = new FormData();
        formData.append('countryCode', value);
        formData.append('currentPath', pathname);

        try {
          await changeCountryAction(formData);
        } catch (error) {
          // Fallback: set cookie on client-side and reload
          setCountryCookie(value);
          setTimeout(() => {
            window.location.replace(window.location.href);
          }, 50);
        }
      }
    },
    [dispatch, pathname]
  );

  const handleRedirect = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const chooseLanguageHandler = useCallback(
    async (event: any) => {
      const selectedLanguageId = event.target?.value;
      const selectedLanguage = languages?.find(
        (lang: any) => lang.id === selectedLanguageId
      );

      if (selectedLanguage) {
        setActiveLanguage(selectedLanguageId);

        // Set in Redux store for immediate UI feedback
        dispatch(setLanguage({ id: selectedLanguageId }));

        // Use server action to set cookie properly
        const formData = new FormData();
        formData.append('languageId', String(selectedLanguageId));
        formData.append('currentPath', pathname);

        try {
          await changeLanguageAction(formData);
        } catch (error) {
          setLanguageCookie(selectedLanguageId);
          setTimeout(() => {
            window.location.replace(window.location.href);
          }, 50);
        }
      }
    },
    [languages, setActiveLanguage, dispatch, pathname]
  );

  const FOOTER_LINKS = [
    { href: '/refund-policies', label: t('refundPolicies') },
    { href: '/terms-of-service', label: t('termsOfService') },
    { href: '/privacy-policy', label: t('privacyPolicy') },
  ];

  const EXCLUDED_PATHS = [
    routes.private.dashboard,
    routes.private.settings_and_subscription,
    routes.public.email_verification,
    routes.public.complete_profile,
    routes.public.trial_activation,
    routes.public.search,
    routes.private.course_details,
    routes.public.redirecting_page,
  ];

  const shouldShowCountryDropdown = useMemo(() => {
    const isHomePage = pathname === routes.public.home;
    const isAllowedCoursePage =
      !!isCoursePage && !EXCLUDED_PATHS.includes(pathname);

    return isHomePage || isAllowedCoursePage;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isCoursePage]);

  return (
    <Container maxWidth='lg' sx={{ width: '100%' }}>
      <Stack
        id='footer'
        sx={{
          borderTop: '1px solid #0000001A',
          bgcolor: 'rgba(255, 255, 255, 1)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: { xs: 0, sm: 2 },
            px: { xs: 0, sm: 4 },
          }}
        >
          <Grid2 size={{ xs: 12 }}>
            <Grid2
              container
              spacing={{ xs: 2, sm: 6 }}
              pt={{ xs: 2, sm: 6 }}
              pb={{ xs: 2 }}
              pr={{ xs: 2, sm: 0 }}
              pl={{ xs: 2, sm: 0 }}
            >
              <Grid2 size={{ xs: 12 }}>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Grid2 container spacing={2}>
                      <Grid2 size={{ xs: 12 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: 'fit-content',
                          }}
                        >
                          {LOGO_URL ? (
                            <LogoImage
                              src={LOGO_URL}
                              alt='logo'
                              width={logo_width}
                              height={logo_height}
                              sx={{
                                width: logo_width ? `${logo_width}px` : '100%',
                                maxWidth: logo_width
                                  ? `${logo_width}px`
                                  : 'auto',
                                height: logo_height
                                  ? `${logo_height}px`
                                  : '100%',
                                maxHeight: logo_height
                                  ? `${logo_height}px`
                                  : 'auto',
                              }}
                              onClick={() => router.push(routes.public.home)}
                            />
                          ) : (
                            BRAND_NAME && (
                              <Logo
                                onClick={() =>
                                  handleRedirect(
                                    isLoggedIn
                                      ? routes.private.dashboard
                                      : routes.public.home
                                  )
                                }
                              >
                                {BRAND_NAME.toUpperCase()}
                              </Logo>
                            )
                          )}
                        </Box>
                      </Grid2>

                      {shouldShowLanguageSelector && (
                        <Grid2 size={{ xs: 12 }}>
                          <FormControl
                            label={t('languageLabel')}
                            placeholder={t('enterLanguage')}
                            name='language'
                            handleChange={chooseLanguageHandler}
                            value={toCapitalCase(currentLanguage?.name || '')}
                            renderSelectedValue={(selected: any) => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Image
                                  width={20}
                                  height={20}
                                  src={getLanguageFlag(currentLanguage?.code)}
                                  alt='language_flag'
                                />
                                {selected}
                              </Box>
                            )}
                            options={languageOptions}
                            size='small'
                            type='select'
                            sx={{
                              zIndex: '1 !important',
                              width: { xs: 200, sm: 220 },
                            }}
                          />
                        </Grid2>
                      )}
                      {shouldShowCountryDropdown && (
                        <Grid2 size={{ xs: 12 }}>
                          <FormControl
                            sx={{
                              zIndex: '1 !important',
                              width: { xs: 200, sm: 220 },
                            }}
                            {...{
                              label: t('Country'),
                              placeholder: t('enterCountry'),
                              name: 'country',
                              handleChange: chooseCountryHandler,
                              value: activeCountry || '',
                              options: countries?.map((country: any) => ({
                                label: toCapitalCase(country?.name) || '',
                                value: country?.iso_code,
                                id: country?.iso_code,
                              })),
                              size: 'small',
                              type: 'autocomplete',
                            }}
                          />
                        </Grid2>
                      )}
                      {COUNTRY_CODE && (
                        <Grid2 size={{ xs: 12 }}>
                          <Typography
                            sx={{
                              color: '#304BE0',
                              fontSize: { xs: 16 },
                            }}
                          >
                            {`${t('country_code_label')}: `}
                            <span style={{ color: '#0E0E0E' }}>
                              {COUNTRY_CODE}
                            </span>
                          </Typography>
                        </Grid2>
                      )}
                    </Grid2>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box
                      width={'100%'}
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'row', sm: 'column' },
                        alignItems: { xs: 'center', sm: 'flex-end' },
                      }}
                      gap={{ xs: 2, sm: 0 }}
                    >
                      <Typography
                        sx={{
                          color: '#304BE0',
                          fontSize: 16,
                          mb: isMobile ? 0 : 2,
                        }}
                      >
                        {t('contact_us')}:{' '}
                      </Typography>
                      <NavLink
                        sx={{
                          fontSize: { xs: 16, sm: 20 },
                          mt: {
                            xs: '0px!important',
                            sm: 'unset',
                          },
                          color: '#0E0E0E',
                          lineHeight: '28px',
                        }}
                        href={`mailto:${SUPPORT_MAIL}`}
                      >
                        {SUPPORT_MAIL}
                      </NavLink>
                    </Box>
                  </Grid2>
                </Grid2>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Grid2
                  container
                  spacing={{ xs: 6, sm: 12 }}
                  sx={{ flexDirection: { xs: 'column-reverse', sm: 'row' } }}
                >
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Stack
                      width={{ xs: '100%', md: 'auto' }}
                      direction={'row'}
                      spacing={{ xs: 0.5, sm: 1 }}
                      alignItems={{ xs: 'center', md: 'flex-start' }}
                      sx={{
                        '& > a': {
                          fontSize: { xs: 13, sm: 16 },
                          color: 'text.secondary',
                        },
                        flexFlow: 'wrap',
                        justifyContent: {
                          xs: 'space-evenly',
                          sm: 'flex-start',
                        },
                      }}
                    >
                      {FOOTER_LINKS?.map((link, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          {index > 0 && (
                            <Typography color='text.secondary'>•</Typography>
                          )}
                          <NavLink
                            sx={{
                              fontSize: { xs: 13, sm: 16 },
                              whiteSpace: 'nowrap',
                            }}
                            href={link.href}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {link.label}
                          </NavLink>
                        </Box>
                      ))}
                    </Stack>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography
                      fontSize={{ xs: 13, sm: 16 }}
                      mt={{ xs: 1, sm: 0 }}
                      color='text.secondary'
                      textAlign={{ xs: 'left', md: 'right' }}
                    >
                      {t('copyright', {
                        year: moment().format('YYYY'),
                        name: LEGAL_NAME,
                      })}
                    </Typography>
                  </Grid2>
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        </Box>
      </Stack>
    </Container>
  );
};
export default Footer;
