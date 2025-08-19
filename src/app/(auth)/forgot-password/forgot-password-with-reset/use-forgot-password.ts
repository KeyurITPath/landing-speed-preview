'use client';
import { useMemo, useCallback, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPasswordValidation } from '@/utils/validations';
import { routes } from '@/utils/constants/routes';
import { api } from '@/api';
import { updateEmail, updateUser } from '@/store/features/auth.slice';
import { SERVER_URL, DOMAIN } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import { useDomain } from '@/context/domain-provider';
import useToast from '@/hooks/use-snackbar';

const useForgotPassword = () => {
  const router = useRouter();
  const domainDetails = useDomain();

  const { user }: any = useSelector(({ auth }: any) => auth);
  const { logo, logo_width, logo_height } =
    domainDetails?.data?.domain_detail || {};

  const dispatch = useDispatch();

  const { handleToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { errors, handleSubmit, values, setValues, handleBlur } = useFormik({
    initialValues: {
      EmailAddress: '',
    },
    validationSchema: forgotPasswordValidation,
    onSubmit: async values => {
      await handleForgotPasswordApi(values);
    },
  });

  const LOGO_URL = useMemo(() => {
    return logo ? SERVER_URL + logo : null;
  }, [logo]);

  const handleChange = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
    },
    [setValues, values]
  );

  const handleRedirect = useCallback(
    (path = '') => {
      router.push(path || routes.auth.login);
    },
    [router]
  );

  const handleRenderUI = useCallback(
    (EmailAddress: string) => {
      dispatch(
        updateUser({
          ...user,
          activeUI: '2FA',
          email: EmailAddress,
          redirect: 'new-password',
        })
      );
      handleRedirect(routes.auth.login);
    },
    [dispatch, handleRedirect, user]
  );

  const handleForgotPasswordApi = useCallback(
    async ({ EmailAddress }: any) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await api.auth.forgotPassword({
          auth: {
            email: EmailAddress,
            domain: DOMAIN,
          },
        });

        if (response?.data) {
          handleRenderUI({ email: EmailAddress } as any);
          dispatch(updateEmail({ email: EmailAddress }));
        }
      } catch (error: any) {
        if (!error.response?.errors?.EmailAddress?.[0]) {
          handleToast({
            message:
                error?.data?.message ||
                error?.message ||
                error.response?.errors?.EmailAddress?.[0] ||
                'Something went wrong.',
            variant: 'error'
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, handleRenderUI, handleToast, isLoading]
  );

  const forgotPasswordData = useMemo(
    () => [
      {
        id: 'email',
        name: 'EmailAddress',
        value: values.EmailAddress,
        placeholder: 'Enter Email',
        handleChange,
        onBlur: handleBlur,
        label: 'Email',
        error: errors.EmailAddress,
        type: 'email',
        size: 'large',
      },
    ],
    [errors, handleBlur, handleChange, values]
  );

  return {
    LOGO_URL,
    router,
    forgotPasswordData,
    handleSubmit,
    isLoading,
    logo_height,
    logo_width,
  };
};

export default useForgotPassword;
