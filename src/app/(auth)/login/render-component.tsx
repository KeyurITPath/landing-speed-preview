'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import Login from './login';
import OTPVerification from './OTP';

const RenderComponent = () => {
  const { activeUI } = useSelector(({ auth }: any) => auth);
  return activeUI === '2FA' ? <OTPVerification /> : <Login />;
};

export default RenderComponent;
