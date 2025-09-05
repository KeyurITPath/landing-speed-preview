'use client';
import { useCallback, useMemo, useState, useRef, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '@/api';
import { SERVER_URL } from '@utils/constants';
import { loginValidation } from '@utils/validations';
import { decodeToken } from '@/utils/helper';
import { setActiveUI, updateUser } from '@store/features/auth.slice';
import { useRouter } from 'next/navigation';
import { routes } from '@/utils/constants/routes';
import { useDomain } from '@/context/domain-provider';
import useToast from '@/hooks/use-snackbar';
import { AuthContext } from '@/context/auth-provider';
import useSocket from '@/hooks/use-socket';
import cookies from 'js-cookie';

const useLogin = () => {
  const { setToken } = useContext(AuthContext);
  const { updateSocketOnLogin } = useSocket();

  const { handleToast } = useToast();
  const router = useRouter();
  const domainDetails = useDomain();

  const { user }: any = useSelector(({ auth }: any) => auth);
  const { logo, logo_width, logo_height } =
    domainDetails?.data?.domain_detail || {};

  const LOGO_URL = useMemo(() => {
    return logo ? SERVER_URL + logo : null;
  }, [logo]);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isValid,
    errors,
    handleSubmit,
    values,
    touched,
    setFieldValue,
    handleBlur,
    validateField,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidation,
    validateOnChange: false,
    validateOnBlur: true,
    validateOnMount: false,
    onSubmit: async values => {
      await handleLoginApi(values);
    },
  });

  const handleChange = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      setFieldValue(name, value);

      // Only validate email field with debouncing for better UX
      if (name === 'email') {
        // Clear previous timeout
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        // Set new timeout for validation
        debounceTimeoutRef.current = setTimeout(() => {
          validateField(name);
        }, 500); // Increased to 500ms for better performance
      }
    },
    [setFieldValue, validateField]
  );

  const handleRedirect = useCallback(
    (path = '') => {
      dispatch(setActiveUI(''));
      router.push(path);
    },
    [router, dispatch]
  );

  const handleLoginApi = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await api.auth.login({
          auth: {
            username: email,
            password,
          },
        });
        if (response?.data) {
          const token = response?.data?.data?.token;
          const responseMessage = response?.data?.message;
          if (token) {
            const decodeData = decodeToken(token);
            setToken(token);
            updateSocketOnLogin(token);
            cookies.set('is_cancellation_request', decodeData?.is_cancellation_request ? 'true' : 'false');
            dispatch(
              updateUser({
                token,
                activeUI: '',
                isLoggedIn: true,
                ...user,
                ...decodeData,
              })
            );

            if (decodeData.is_verified) {
              router.push(routes.private.dashboard);
            } else {
              router.push(routes.public.home);
            }
            handleToast({ message: responseMessage, variant: 'success' });
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
    [dispatch, handleToast, isLoading, router, setToken, user]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Memoize form data objects to prevent recreating on every render
  const emailFormData = useMemo(
    () => ({
      id: 'email',
      name: 'email',
      value: values.email,
      placeholder: 'Enter your email address',
      handleChange,
      onBlur: handleBlur,
      label: 'Email Address',
      error: touched.email && errors.email,
      type: 'email',
      size: 'large',
    }),
    [values.email, handleChange, handleBlur, touched.email, errors.email]
  );

  const passwordFormData = useMemo(
    () => ({
      id: 'password',
      name: 'password',
      value: values.password,
      placeholder: 'Enter your password',
      handleChange,
      onBlur: handleBlur,
      error: touched.password && errors.password,
      label: 'Password',
      type: 'password',
      position: 'end',
      size: 'large',
    }),
    [
      values.password,
      handleChange,
      handleBlur,
      touched.password,
      errors.password,
    ]
  );

  return {
    emailFormData,
    passwordFormData,
    handleSubmit,
    isValid,
    isLoading,
    handleRedirect,
    LOGO_URL,
    logo_width,
    logo_height,
    router,
  };
};

export default useLogin;
