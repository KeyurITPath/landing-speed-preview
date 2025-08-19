'use client';
import React from 'react';
import NewPassword from './new-password';
import ForgotPassword from './forgot-password-with-reset';
import { useSelector } from 'react-redux';

const ForgotPasswordProvider = () => {
  const { activeUI } = useSelector(({ auth }: any) => auth);
  return activeUI === 'RESET_PASSWORD' ? <NewPassword /> : <ForgotPassword />;
};

export default ForgotPasswordProvider;
