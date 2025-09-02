import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import useSidebar from './use-sidebar';
import {
  Avatar,
  Backdrop,
  Box,
  List,
  Stack,
  styled,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  DOMAIN,
  SERVER_URL,
  SIDE_NAV_WIDTH,
  TOP_NAV_HEIGHT,
} from '@/utils/constants';
import { AuthContext } from '@/context/auth-provider';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import useToggleState from '@/hooks/use-toggle-state';
import { api } from '@/api';
import { logout } from '@/store/features/auth.slice';
import { Scrollbar } from '@/shared/scrollbar';
import Image from 'next/image';
import { routes } from '@/utils/constants/routes';
import NavItem from './nav-item';
import { ICONS } from '@/assets/icons';
import {
  capitalizeEachLetter,
  getAvatarInitials,
  videoURL,
} from '@/utils/helper';
import ConfirmationPopup from '@/components/confirmation-popup';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchUser } from '@/store/features/user.slice';
import cookies from 'js-cookie';

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

const SidebarContent = ({ sidebar, domainDetails, user }: any) => {
  const { removeToken } = useContext(AuthContext);
  const t = useTranslations();
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn } = useSelector(({ auth }: any) => auth);

  const [fetchUserData] = useDispatchWithAbort(fetchUser);

  const { data } = useSelector(({ user }: any) => user);

  const { logo, brand_name, logo_width, logo_height } =
    domainDetails?.data?.domain_detail || {};

  const [logoutState, logoutOpen, logoutClose] = useToggleState();

  const LOGO_URL = useMemo(() => {
    return logo ? SERVER_URL + logo : null;
  }, [logo]);

  const BRAND_NAME = useMemo(() => {
    return brand_name || '';
  }, [brand_name]);

  const LOGO_WIDTH = useMemo(() => {
    return logo_width || null;
  }, [logo_width]);

  const LOGO_HEIGHT = useMemo(() => {
    return logo_height || null;
  }, [logo_height]);

  const handleRedirect = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  useEffect(() => {
    if (user?.id && fetchUserData) {
      fetchUserData({
        params: {
          user_id: user?.id,
          language: cookies.get('language_id'),
          domain: DOMAIN,
        },
        headers: {
          'req-from': cookies.get('country_code'),
        },
        cookieToken: cookies.get('token'),
      });
    }
  }, [fetchUserData, user?.id]);

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
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
      <Scrollbar
        sx={{
          height: '100vh',
          '& .simplebar-content': {
            height: 'inherit',
          },
          '& .simplebar-scrollbar:before': {
            background: 'neutral.400',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            bgcolor: 'rgba(255, 255, 255, 1)',
          }}
        >
          <Stack>
            <Stack
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: `${TOP_NAV_HEIGHT}px`,
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
                  <LogoImage
                    src={LOGO_URL}
                    alt='logo'
                    width={LOGO_WIDTH}
                    height={LOGO_HEIGHT}
                    onClick={() =>
                      handleRedirect(
                        isLoggedIn
                          ? routes.private.dashboard
                          : routes.public.home
                      )
                    }
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
            </Stack>
            <Box
              sx={{
                height: '1px',
                width: 'calc(100% - 32px)',
                background:
                  'linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%)',
                mx: 2,
                mt: '-1px',
              }}
            />
            <Box
              component='nav'
              sx={{
                flexGrow: 1,
                py: 3,
                px: 3,
                height: 'calc(100vh - 280px)',
                overflow: 'auto',
              }}
            >
              <List
                sx={{
                  p: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
                component='nav'
              >
                {sidebar?.map((val: any) => (
                  <NavItem
                    key={val.id}
                    id={`sidebar-nav-${val.id}`}
                    title={val.name}
                    {...val}
                    mainIconSx={val.mainIconSx}
                  />
                ))}
              </List>
            </Box>
          </Stack>

          <Stack sx={{ px: 3, gap: 4 }}>
            <NavItem
              title={t('sidebar.logout')}
              icon={ICONS.LoginOutlined}
              sx={{ bgcolor: 'rgba(187, 187, 187, 0.1)' }}
              handleClick={logoutOpen}
            />
            <Stack
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTop: '1px solid rgba(14, 14, 14, 0.1)',
                padding: '18px 0 32px 0',
                gap: 1.5,
              }}
            >
              {data?.profile_image ? (
                <Image
                  style={{
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                  width={40}
                  height={40}
                  alt={'profile_image'}
                  loading='eager'
                  src={videoURL(data?.profile_image)}
                />
              ) : (
                <Avatar alt={'profile_image'}>
                  {data?.name && getAvatarInitials(data?.name)}
                </Avatar>
              )}

              <Stack>
                {user?.name && (
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: 16,
                      color: 'black',
                    }}
                  >
                    {capitalizeEachLetter(user?.name)}
                  </Typography>
                )}
                {user?.email && (
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: 12,
                      color: 'rgba(80, 179, 249, 1)',
                    }}
                  >
                    {user?.email}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Scrollbar>

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
    </>
  );
};

const Sidebar = ({ open, onClose, domainDetails, user }: any) => {
  const lgUp = useMediaQuery(theme => theme.breakpoints.up('lg'), {
    noSsr: true,
  });

  const { sidebar } = useSidebar({ onClose, user });

  // Track mount to avoid SSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Default behavior before hydration:
  // - Desktop → open
  // - Mobile  → closed
  const isVisible = mounted ? open || lgUp : true; // SSR fallback → assume open (desktop-like)

  return (
    <>
      {/* Backdrop only for mobile */}
      {mounted && !lgUp && (
        <Backdrop open={open} onClick={onClose} sx={{ zIndex: 997 }} />
      )}

      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 280, // SIDE_NAV_WIDTH
          bgcolor: 'background.paper',
          boxShadow: 1,
          zIndex: 998,
          transform: isVisible
            ? 'translateX(0)'
            : `translateX(-${SIDE_NAV_WIDTH}px)`,
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <SidebarContent {...{ sidebar, domainDetails, user }} />
      </Box>
    </>
  );
};

export default Sidebar;
