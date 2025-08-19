import {
  useCallback,
  useContext,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { loginValidation } from '../../../../assets/utils/validations';
import { api } from '../../../../api';
import useToast from '../../../../hooks/useToast';
import { decodeToken } from '../../../../assets/utils/function';
import { setActiveUI, updateUser } from '../../../../redux/slices/auth.slice';
import { URLS as PAGES } from '../../../../constant/urls';
import { AuthContext } from '../../../../contexts/AuthContext';
import useSocket from '../../../../hooks/use-socket';
import { SERVER_URL } from '@utils/constants';

const useLogin = () => {
  const { setToken } = useContext(AuthContext);
  const { updateSocketOnLogin } = useSocket();

  const { domainDetails } = useSelector(state => state.defaults);
  const { user } = useSelector(({ auth }) => auth);
  const { logo, logo_width, logo_height } =
    domainDetails?.data?.domain_detail || {};

  const LOGO_URL = useMemo(() => {
    return logo ? SERVER_URL + logo : null;
  }, [logo]);

  const dispatch = useDispatch();
  const history = useNavigate();
  const { handleToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);

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
    e => {
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
      history(path);
    },
    [history, dispatch]
  );

  const handleLoginApi = useCallback(
    async ({ email, password }) => {
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
            dispatch(
              updateUser({
                token,
                activeUI: '',
                isLoggedIn: true,
                ...user,
                ...decodeData,
              })
            );

            setToken(token);

            if (decodeData?.is_verified) {
              history(PAGES.DASHBOARD.path);
            } else {
              history(PAGES.HOME_PAGE.path);
            }
            handleToast({ message: responseMessage, variant: 'success' });
          }
        }
      } catch (error) {
        handleToast({
          message:
            error?.data?.message || error?.message || 'Something went wrong.',
          variant: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [
      dispatch,
      handleToast,
      history,
      isLoading,
      setToken,
      updateSocketOnLogin,
      user,
    ]
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
  };
};

export default useLogin;
