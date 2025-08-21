import {
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import React from 'react';
import { ICONS } from '@/assets/icons';
import { toCapitalCase } from '../../utils/helper';
import { useTranslations } from 'next-intl';
import { routes } from '../../utils/constants/routes';
import { useRouter } from 'next/navigation';

const Sidebar = ({
  drawerOpen,
  setDrawerOpen,
  isLoggedIn,
  user,
  logoutOpen,
  SUPPORT_MAIL,
  handleNavClick,
}: any) => {
  const t = useTranslations();

  const router = useRouter();
  return (
    <Drawer
      anchor={'right'}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: '80%',
          height: {
            xs: '100%',
            sm: '100vh',
          },
          boxSizing: 'border-box',
        },
        display: { xs: 'block', sm: 'none' },
      }}
    >
      <Stack
        direction='row'
        justifyContent='end'
        alignItems='center'
        padding='7px 16px'
        borderBottom='1px solid #80808045'
      >
        <IconButton onClick={() => setDrawerOpen(false)}>
          <ICONS.CLOSE />
        </IconButton>
      </Stack>
      <Stack
        spacing={2}
        borderBottom='1px solid #80808045'
        sx={{
          flex: 1,
        }}
      >
        <List>
          <ListItem
            onClick={() => {
              setDrawerOpen(false);
              handleNavClick('courses-by-category');
            }}
          >
            <ListItemText primary={toCapitalCase(t(`nav.courses`))} />
          </ListItem>
        </List>
      </Stack>
      <Stack borderBottom='1px solid #80808045'>
        {isLoggedIn ? (
          <>
            {user?.is_verified && (
              <ListItem onClick={() => router.push(routes.private.dashboard)}>
                <ListItemText primary={toCapitalCase(t('dashboard'))} />
              </ListItem>
            )}

            <ListItem onClick={logoutOpen}>
              <ListItemText primary={toCapitalCase(t('logout'))} />
            </ListItem>
          </>
        ) : (
            <>
              <ListItem sx={{display: {xs: 'block', md: 'none'}}} onClick={() => router.push(routes.auth.login)}>
                <ListItemText primary={toCapitalCase(t('login'))} />
              </ListItem>
            </>
        )}
      </Stack>
      <Stack p={2} spacing={1}>
        <Typography variant='body2' color='text.secondary'>
          {t('contact_us')}:{' '}
        </Typography>
        <Link
          sx={{
            fontSize: 18,
            mt: {
              xs: '0px !important',
              sm: 'unset',
            },
            color: '#333',
            lineHeight: '28px',
          }}
          href={`mailto:${SUPPORT_MAIL}`}
          underline='hover'
        >
          {SUPPORT_MAIL}
        </Link>
      </Stack>
    </Drawer>
  );
};

export default Sidebar;
