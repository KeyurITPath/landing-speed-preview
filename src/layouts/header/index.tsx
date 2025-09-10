import { ICONS } from '@/assets/icons';
import useToggleState from '@/hooks/use-toggle-state';
import CustomButton from '@/shared/button';
import {
  NAV_ITEMS,
  SERVER_URL,
  SIDE_NAV_WIDTH,
  TIMEZONE,
  TOP_NAV_HEIGHT,
  USER_ROLE,
} from '@/utils/constants';
import { routes } from '@/utils/constants/routes';
import { shouldOfferTrial, toCapitalCase } from '@/utils/helper';
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormControl from '@/shared/inputs/form-control';
import { setLanguage } from '@/store/features/defaults.slice';
import { changeLanguageAction } from '@/app/actions/language';
import { setLanguageCookie } from '@/utils/cookies';
import { IMAGES } from '@/assets/images';
import momentTimezone from 'moment-timezone';
import SearchDrawer from '@/components/search-drawer';
import CustomInput from '@/shared/inputs/text-field';

const Header = ({
  onNavOpen,
  isCollapse,
  user,
  domainDetails,
  languages,
  language_id,
  isLoggedIn
}: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { logo, brand_name, email, logo_width, logo_height } =
    domainDetails?.data?.domain_detail || {};

  const smDown = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const LOGO_URL = logo ? SERVER_URL + logo : null;
  const BRAND_NAME = brand_name || '';
  const LOGO_WIDTH = smDown ? logo_width / 1.5 : logo_width || null;
  const LOGO_HEIGHT = smDown ? logo_height / 1.5 : logo_height || null;

  const mdDown = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [activeLanguage, setActiveLanguage] = useState(language_id);

  const queryParam = searchParams.get('query') ?? '';
  const [searchTerm, setSearchTerm] = useState(['All', 'all'].includes(queryParam) ? '' : queryParam);
  const [openSearch, handleOpenSearch, handleCloseSearch] =
    useToggleState(false);

  const handleSearchChange = useCallback((e: any) => {
    const { value } = e.target;
    setSearchTerm(value);
  }, []);

  const sx = useMemo(
    () => ({
      backdropFilter: 'blur(6px)',
      position: 'sticky',
      left: {
        lg: `${isCollapse ? 80 : SIDE_NAV_WIDTH}px`,
      },
      top: 0,
      width: {
        lg: `calc(100% - ${isCollapse ? 80 : SIDE_NAV_WIDTH}px)`,
      },
      zIndex: 997,
    }),
    [isCollapse]
  );

  const handleIconClick = useCallback(() => {
    if (!searchTerm && inputRef.current) {
      inputRef.current.focus();
    } else {
      router.push(
        routes.public.search + '?query=' + encodeURIComponent(searchTerm.trim() + '&page=1&limit=10')
      );
    }
  }, [router, searchTerm]);

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

  // Memoize current language for better performance
  const currentLanguage = useMemo(() => {
    if (mdDown) {
      const currentLanguageData = languages?.find(
        (language: any) => language?.id === activeLanguage
      );
      return currentLanguageData
        ? {
            ...currentLanguageData,
            name: currentLanguageData?.name?.slice(0, 2)?.toUpperCase() || '',
          }
        : null;
    } else {
      return languages?.find(
        (language: any) => language?.id === activeLanguage
      );
    }
  }, [mdDown, languages, activeLanguage]);

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

  const NAVBAR_NAVIGATION_ITEMS = useMemo(() => {
    if (pathname !== routes.public.home) {
      return NAV_ITEMS.filter(item => item.key !== 'courses');
    } else return NAV_ITEMS;
  }, [pathname]);

  const isBecomeAMemberWithVerified = useMemo(() => {
    if (!user) return false;

    if (
      ![USER_ROLE.CUSTOMER, USER_ROLE.AUTHOR].includes(user.role) ||
      !user.is_verified
    ) {
      return false;
    }

    const currentTime = momentTimezone().tz(TIMEZONE);
    const subscriptionEndDate = user?.subscription_end_date
      ? momentTimezone(user.subscription_end_date).tz(TIMEZONE)
      : null;

    return (
      !user.is_subscribed ||
      (subscriptionEndDate && !subscriptionEndDate.isAfter(currentTime))
    );
  }, [user]);

  const shouldOfferTrials = useMemo(() => {
    return shouldOfferTrial(user);
  }, [user]);

  return (
    <>
      <Box component='header' {...{ sx }}>
        <Stack
          alignItems='center'
          direction='row'
          justifyContent='center'
          sx={{
            position: 'relative',
            boxShadow: '0px 4px 20px 0px #75757512',
            bgcolor: 'rgba(255, 255, 255, 1)',
            minHeight: TOP_NAV_HEIGHT,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: { xs: 1, sm: 2 },
              px: 3,
            }}
          >
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: 'fit-content',
                }}
              >
                {smDown ? (
                  LOGO_URL ? (
                    <Image
                      style={{ cursor: 'pointer', objectFit: 'contain' }}
                      onClick={() =>
                        router.push(
                          isLoggedIn
                            ? routes.private.dashboard
                            : routes.public.home
                        )
                      }
                      src={LOGO_URL}
                      alt={BRAND_NAME}
                      width={LOGO_WIDTH}
                      height={LOGO_HEIGHT}
                    />
                  ) : (
                    BRAND_NAME && (
                      <Typography
                        sx={{
                          textWrap: 'nowrap',
                          cursor: 'pointer',
                          fontSize: {
                            md: 16, // applies below 'md'
                            sm: 14, // applies below 'sm'
                          },
                        }}
                        onClick={() =>
                          router.push(
                            isLoggedIn
                              ? routes.private.dashboard
                              : routes.public.home
                          )
                        }
                      >
                        {BRAND_NAME.toUpperCase()}
                      </Typography>
                    )
                  )
                ) : (
                  user?.name && (
                    <Typography
                      sx={{
                        color: 'rgba(25, 25, 25, 1)',
                        fontSize: 20,
                        fontWeight: 600,
                      }}
                    >
                      {t('hello')} {user?.name}!
                    </Typography>
                  )
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: mdDown ? 1 : 3,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                {smDown ? (
                  <IconButton onClick={() => handleOpenSearch(true)}>
                    <ICONS.SEARCH size={22} />
                  </IconButton>
                ) : (
                  <CustomInput
                    inputRef={inputRef}
                    placeholder={t('search')}
                    size='small'
                    value={searchTerm}
                    handleChange={handleSearchChange}
                    slotProps={{
                      input: {
                        onKeyDown: (
                          e: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                          if (e.key === 'Enter') {
                            e.preventDefault(); // prevent default form submit
                            handleIconClick();
                          }
                        },
                        endAdornment: (
                          <InputAdornment
                            onClick={handleIconClick}
                            position='end'
                            sx={{
                              color: '#808080',
                              fontSize: 20,
                              cursor: 'pointer',
                            }}
                          >
                            <ICONS.SEARCH />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      width: { xs: '100%', sm: 400 },
                      '.MuiInputBase-root': {
                        bgcolor: '#F5F5F5',
                        borderRadius: '33px',
                        border: 'none',
                      },
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      input: {
                        pl: 2,
                        pr: 0,
                        py: 0.8,
                      },
                    }}
                  />
                )}
                <FormControl
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
                    width: { xs: 100, md: 160 },
                  }}
                />
                {mdDown ? (
                  <IconButton onClick={onNavOpen} id='mobile-menu-icon'>
                    <ICONS.Menu size={22} />
                  </IconButton>
                ) : (
                  <>
                    <Stack
                      direction='row'
                      justifyContent='space-between'
                      alignItems='center'
                      ml={0.5}
                      gap={{ xs: 1, sm: 1, md: 3 }}
                      spacing={{ xs: 1, sm: 1, md: 3 }}
                    >
                      {NAVBAR_NAVIGATION_ITEMS.map(item => (
                        <Link href={item.path} key={item.path}>
                          {toCapitalCase(t(`nav.${item.key}`))}
                        </Link>
                      ))}
                    </Stack>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      {!user?.is_verified && (
                        <CustomButton
                          sx={{ ml: { xs: 0, sm: 2 } }}
                          variant='gradient'
                          onClick={() => router.push(routes.public.home)}
                        >
                          {t('home')}
                        </CustomButton>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <SearchDrawer forDashboard
        {...{
          open: openSearch,
          handleClose: handleCloseSearch,
          inputRef,
          searchTerm,
          handleSearchChange,
          handleIconClick,
        }}
      />
    </>
  );
};

export default Header;
