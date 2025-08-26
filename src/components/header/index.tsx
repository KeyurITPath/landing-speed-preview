'use client';
import { ICONS } from '@/assets/icons';
import useToggleState from '@/hooks/use-toggle-state';
import CustomButton from '@/shared/button';
import { neutral } from '@/theme/color';
import { SERVER_URL } from '@/utils/constants';
import { routes } from '@/utils/constants/routes';
import { toCapitalCase } from '@/utils/helper';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useContext, useState } from 'react';
import ConfirmationPopup from '@components/confirmation-popup';
import { api } from '@/api';
import { logout } from '@/store/features/auth.slice';
import { AuthContext } from '@/context/auth-provider';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../public-sidebar';

const Header = ({ domainDetails }: any) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const { removeToken } = useContext(AuthContext);
  const { logo, brand_name, email, logo_width, logo_height } =
    domainDetails?.data?.domain_detail || {};

  const LOGO_URL = logo ? SERVER_URL + logo : null;
  const BRAND_NAME = brand_name || '';
  const SUPPORT_MAIL = email || '';
  const LOGO_WIDTH = logo_width || null;
  const LOGO_HEIGHT = logo_height || null;

  const { user, isLoggedIn } = useSelector(({ auth }: any) => auth);
  const router = useRouter();
  const pathname = usePathname();

  const [logoutState, logoutOpen, logoutClose] = useToggleState();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavClick = (sectionId = '') => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await api.auth.logout({});
    localStorage.clear();
    sessionStorage.clear();
    dispatch(logout());
    dispatch({ type: 'RESET' });
    removeToken();
    if (typeof logoutClose === 'function') {
      logoutClose(false);
    }
    router.refresh();
  };

  return (
    <>
      <Stack
        sx={{ position: 'relative', boxShadow: '0px 4px 20px 0px #75757512' }}
      >
        <Container maxWidth='lg' sx={{ width: '100%' }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: { xs: 1, sm: 2 },
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
                {LOGO_URL ? (
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
                  !LOGO_URL &&
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
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: {
                    xs: 1,
                    md: 4,
                  },
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <IconButton
                  sx={{
                    display: { xs: 'block', sm: 'none' }
                  }}
                  onClick={() => router.push(routes.public.search)}
                >
                  <ICONS.SEARCH size={22} />
                </IconButton>
                <Button variant='contained'
                  onClick={() => router.push(routes.public.search)}
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    width: { xs: '100%', sm: 400 },
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    borderRadius: '33px',
                    boxShadow: 'none',
                    bgcolor: '#f5f5f5',
                    border: 'none',
                    px: 2,
                    py: '6px',
                    '&:hover': {
                      bgcolor: '#f5f5f5!important',
                      border: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      color: '#808080',
                      fontSize: 16,
                      textAlign: 'left',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontWeight: 400,
                    }}
                  >
                    {t('search')}
                  </Box>

                  <InputAdornment
                    position='end'
                    sx={{ ml: 1, color: '#808080', fontSize: 20 }}
                  >
                    <ICONS.SEARCH size={22} />
                  </InputAdornment>
                </Button>

                <IconButton
                  sx={{ display: { xs: 'block', md: 'none' } }}
                  onClick={() => setDrawerOpen(true)}
                >
                  <ICONS.Menu size={22} />
                </IconButton>
                <>
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    ml={0.5}
                    gap={{ xs: 1, sm: 1, md: 3 }}
                    spacing={{ xs: 1, sm: 1, md: 3 }}
                    display={{ xs: 'none', md: 'flex' }}
                  >
                    <Link
                      href='#'
                      style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: neutral[900],
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                      onClick={() => handleNavClick('courses-by-category')}
                    >
                      {toCapitalCase(t(`nav.courses`))}
                    </Link>
                  </Stack>
                  <Box
                    sx={{
                      alignItems: 'center',
                      gap: 2,
                      display: { xs: 'none', sm: 'flex' },
                    }}
                  >
                    {isLoggedIn ? (
                      <>
                        <Box
                          sx={{
                            gap: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {user?.is_verified &&
                            pathname !== routes.public.home && (
                              <CustomButton
                                sx={{
                                  ml: { xs: 0, sm: 2 }
                                }}
                                variant='gradient'
                                onClick={() =>
                                  router.push(routes.private.dashboard)
                                }
                              >
                                {t('dashboard')}
                              </CustomButton>
                            )}

                          <CustomButton
                            sx={{ ml: { xs: 0, sm: 2 } }}
                            variant='gradient'
                            onClick={() =>
                              typeof logoutOpen === 'function' &&
                              logoutOpen(true)
                            }
                          >
                            {t('logout')}
                          </CustomButton>
                        </Box>
                      </>
                    ) : (
                        <CustomButton
                          sx={{ ml: { xs: 0, sm: 2 } }}
                          variant='gradient'
                          onClick={() => router.push(routes.auth.login)}
                        >
                          {t('login')}
                        </CustomButton>
                    )}
                  </Box>
                </>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Stack>

      {logoutState ? (
        <ConfirmationPopup
          {...{
            open: logoutState,
            onClose: logoutClose,
            handleSubmit: handleLogout,
            modelTitle: t('sidebar.logout_confirmation_title'),
            confirmationText: t('sidebar.logout_confirmation_text'),
            actionLabel: t('sidebar.logout'),
            closeLabel: t('sidebar.cancel'),
            maxWidth: 'xs',
          }}
        />
      ) : null}

      <Sidebar
        {...{
          drawerOpen,
          setDrawerOpen,
          isLoggedIn,
          user,
          logoutOpen,
          SUPPORT_MAIL,
          handleNavClick,
        }}
      />
    </>
  );
};

export default Header;
