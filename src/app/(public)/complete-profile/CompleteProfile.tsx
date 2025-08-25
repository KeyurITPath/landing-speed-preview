'use client';
import React, { useEffect, useMemo, useState } from 'react';
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

const CompleteProfileComponent = ({ domainDetails }: any) => {
  const queryParams = useSearchParams();

  const { email } = domainDetails?.data?.domain_detail || {};

  const tabs = [
    { id: 1, Component: CredentialsForm },
    { id: 2, Component: ProfileUpdateForm },
  ];

  const [activeTab, setActiveTab] = useState(1);

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
    sessionStorage.removeItem('hasSalesFlowAccess', false);
  }, []);

  return (
    <>
      <LandingLayoutContainer>
        <BorderLinearProgress variant='determinate' value={barValue} />
        {tabs.map(({ id, Component }) => {
          return (
            <Tab key={id} {...{ id }} value={activeTab}>
              <Component {...{ setActiveTab, SUPPORT_MAIL }} />
            </Tab>
          );
        })}
      </LandingLayoutContainer>
      {/* Payment popups */}
      <SuccessPaymentPopup open={isPaymentSuccess} />
      <FailedPaymentPopup open={isPaymentFailed} />
    </>
  );
};

export default CompleteProfileComponent;
