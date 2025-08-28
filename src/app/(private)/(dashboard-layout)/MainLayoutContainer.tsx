'use client';
import { Box, styled, useMediaQuery } from '@mui/material';
import { SIDE_NAV_WIDTH, TOP_NAV_HEIGHT } from '@/utils/constants';
import Header from '@/layouts/header';
import Sidebar from '@/layouts/sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { toggleSidebar } from '@/store/features/sidebar-slice';
import Footer from '@/components/footer';

const LayoutRoot = styled('div')(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: SIDE_NAV_WIDTH,
    paddingRight: 0,
  },
}));

const LayoutContainer = styled(Box)(() => ({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  minHeight: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
  width: '100%',
}));

const MainLayoutContainer = ({
  children,
  domain,
  country_code,
  languages,
  countries,
  language_id,
  user,
}: any) => {
  const dispatch = useDispatch();
  const lgUp = useMediaQuery(theme => theme.breakpoints.up('lg'));
  const isSidebarOpen = useSelector(
    (state: any) => state.sidebar.isSidebarOpen
  );

  const handleToggle = useCallback(() => {
    if (!lgUp) dispatch(toggleSidebar());
    return;
  }, [lgUp, dispatch]);

  return (
    <>
      <Header id='header' {...{ onNavOpen: handleToggle, lgUp, user, domainDetails: domain, country_code, languages, countries, language_id }} />
      <Sidebar
        id='sidebar'
        {...{
          open: isSidebarOpen || lgUp,
          onClose: handleToggle,
          lgUp,
          isCollapse: lgUp,
          user,
          domainDetails: domain,
        }}
      />
      <LayoutRoot>
        <LayoutContainer sx={{ p: { xs: 0, sm: 1, md: 3 } }}>
          {children}
          <Footer isHidePadding
            domainDetails={domain}
            {...{ country_code, languages, countries, language_id }}
          />
        </LayoutContainer>
      </LayoutRoot>
    </>
  );
};

export default MainLayoutContainer;
