'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Box,
  LinearProgress,
  linearProgressClasses,
  Stack,
  styled,
} from '@mui/material';
import CredentialsForm from './components/credentials-form';
import ProfileUpdateForm from './components/profile-update-form';
import LandingLayoutContainer from '@/shared/landing-layout-container';
import { useSearchParams } from 'next/navigation';
import SuccessPaymentPopup from '@/components/success-payment-popup';
import FailedPaymentPopup from '@/components/failed-payment-popup';
import { useSelector } from 'react-redux';
import cookies from 'js-cookie';
import { AuthContext } from '@/context/auth-provider';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchUser } from '@/store/features/user.slice';

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 20,
  borderRadius: 20,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#F5F2F0',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 20,
    background:
      'linear-gradient(90deg, rgba(242,243,188,1) 30%, rgba(255,153,102,1) 100%)',
  },
}));

const Tab = ({ id, value, children }: any) => {
  return (
    <Box hidden={id !== value} sx={{ width: '100%' }}>
      <Stack sx={{ gap: { xs: 2.5, sm: 5 } }}>{children}</Stack>
    </Box>
  );
};

const CompleteProfileComponent = ({ domainDetails, userData }: any) => {
  const queryParams = useSearchParams();
  const { user } = useContext(AuthContext);
  const { email } = domainDetails?.data?.domain_detail || {};

  const tabs = [
    { id: 1, Component: ProfileUpdateForm },
    { id: 2, Component: CredentialsForm },
  ];

  const [activeTab, setActiveTab] = useState(1);
  const { data: courseData } = useSelector(({ course }: any) => course);
  const [fetchUserData] = useDispatchWithAbort(fetchUser);

  const barValue = useMemo(() => {
    return (activeTab / tabs.length) * 100;
  }, [activeTab, tabs.length]);

  const isPaymentSuccess = useMemo(() => {
    return queryParams?.get('payment') === 'success';
  }, [queryParams]);

  const isPaymentFailed = useMemo(() => {
    return queryParams?.get('payment') === 'failed';
  }, [queryParams]);

  const SUPPORT_MAIL = useMemo(() => {
    return email || '';
  }, [email]);

  useEffect(() => {
    if (user?.id && fetchUserData) {
      const country_code = cookies.get('country_code') || '';
      fetchUserData({
        params: { user_id: user.id },
        headers: { 'req-from': country_code },
        cookieToken: cookies.get('token') || '',
      });
    }
  }, [user?.id, fetchUserData]);

  useEffect(() => {
    sessionStorage.removeItem('hasSalesFlowAccess');
  }, []);

  const landingPageName = useMemo(() => {
    try {
      // First try to get from Redux courseData
      if (courseData?.landing_page_name) {
        return courseData.landing_page_name;
      }
      // Then try from cookie
      const courseDataCookie = cookies.get('course_data');
      if (courseDataCookie) {
        const parsedData = JSON.parse(courseDataCookie);
        return parsedData?.landing_page_name?.name || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }, [courseData]);

  return (
    <>
      <LandingLayoutContainer>
        <BorderLinearProgress variant='determinate' value={barValue} />
        {tabs.map(({ id, Component }) => {
          return (
            <Tab key={id} {...{ id }} value={activeTab}>
              <Component {...{ setActiveTab, SUPPORT_MAIL, userData }} />
            </Tab>
          );
        })}
      </LandingLayoutContainer>
      {/* Payment popups */}
      <SuccessPaymentPopup open={isPaymentSuccess} landingPageName={landingPageName}/>
      <FailedPaymentPopup open={isPaymentFailed} />
    </>
  );
};

export default CompleteProfileComponent;
