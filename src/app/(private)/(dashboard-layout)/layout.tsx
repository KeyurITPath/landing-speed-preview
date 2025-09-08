import { Box } from '@mui/material';
import { themeColors } from '@/theme/color';
import MainLayoutContainer from './MainLayoutContainer';
import { cookies } from 'next/headers';
import { decodeToken, isTokenActive } from '@/utils/helper';
import { api } from '@/api';
import {
  fetchAllCountries,
  fetchCountryCodeHandler,
} from '@/services/course-service';
import { LanguageService } from '@/services/language-service';
import { fetchIP, getDomain } from '@/utils/domain';

const layoutStyle = {
  width: '100%',
  position: 'relative',
  background: themeColors.bodyBg,
};

export const metadata = {
  title: 'Dashboard',
  description: '',
};
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value
  const domain_value = await getDomain()
  const IP = await fetchIP()

  let isLoggedIn;
  let userData = {}

  if(token){
    userData = decodeToken(token);
    isLoggedIn = isTokenActive(token) && userData?.is_verified
  }

  // IP address with country code
  const country_code = await fetchCountryCodeHandler(IP);

  // Get language_id and languages using the simple service
  const language_id = await LanguageService.getEffectiveLanguageId();
  const languages = await LanguageService.getLanguages();

  // countries
  const countriesResponse = await fetchAllCountries();
  const countries = countriesResponse?.data?.result || [];

  // domain details
  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });
  const domain = (await response?.data) || {};

  return (
    <Box sx={layoutStyle}>
      <MainLayoutContainer
        {...{
          domain,
          country_code,
          languages,
          countries,
          language_id,
          user: userData,
          isLoggedIn
        }}
      >
        {children}
      </MainLayoutContainer>
    </Box>
  );
};

export default DashboardLayout;
