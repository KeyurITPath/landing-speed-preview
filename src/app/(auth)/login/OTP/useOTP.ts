import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import useToast from '@/hooks/use-snackbar';
import { api } from '@/api';
import { DOMAIN } from '@/utils/constants';
import { otpValidationSchema } from '@/utils/validations';
import { useRouter } from 'next/navigation';
import { resetOTPKey, setActiveUI } from '@/store/features/auth.slice';
import { routes } from '@/utils/constants/routes';

const useOTP = () => {
  const [remainingTime, setRemainingTime] = useState(45);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { handleToast } = useToast();
  const { user, redirect } = useSelector(({ auth }: any) => auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const { values, errors, setValues, handleSubmit } = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: otpValidationSchema,
    onSubmit: async value => {
      await handleSubmitOTP(value);
    },
  });

  useEffect(() => {
    if (remainingTime > 0) {
      setIsResendDisabled(true);
      const timerId = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      setIsResendDisabled(false);
    }
  }, [remainingTime]);

  const handleSubmitOTP = useCallback(
    async ({ otp }: any) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        if (redirect === 'new-password') {
          const response = await api.auth.verifyOtp({
            data: { otp, email: user?.email },
          });
          if (response?.data?.data?.resetKey) {
            dispatch(resetOTPKey({ resetKey: response?.data?.data?.resetKey }));
            dispatch(setActiveUI('RESET_PASSWORD'));
            router.push(routes.auth.forgot_password);
            handleToast({
              message: response?.data?.message,
              variant: 'success',
            });
          }
        }
      } catch (error) {
        handleToast({
          message:
            (error as any)?.data?.message || (error as any)?.message || 'Something went wrong.',
          variant: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, handleToast, isLoading, redirect, router, user?.email]
  );

  const handleChange = useCallback(
    async (e: any) => {
      const { name, value } = e.target;
      setValues({
        ...values,
        [name]: value,
      });
    },
    [setValues, values]
  );

  useEffect(() => {
    if (values.otp.length === 6 && !errors.otp) {
      handleSubmit();
    }
  }, [values.otp, errors.otp, handleSubmit]);

  const handleResendClick = useCallback(async () => {
    if (isLoading) return;
    try {
      const response = await api.auth.resend({
        data: { email: user?.email, domain: DOMAIN },
      });
      if (response?.data) {
        handleToast({ message: response?.data?.message, variant: 'success' });
        setRemainingTime(45);
      }
    } catch (error) {
      handleToast({
        message: (error as any)?.data?.message || 'Something went wrong.',
        variant: 'error',
      });
    }
  }, [handleToast, isLoading, user?.email]);

  return {
    values,
    handleResendClick,
    user,
    errors,
    handleSubmit,
    handleChange,
    isLoading,
    remainingTime,
    isResendDisabled,
  };
};

export default useOTP;
