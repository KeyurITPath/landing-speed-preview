import { useContext, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { countries } from 'countries-list';
import { profileUpdateValidation } from '@/utils/validations';
import { AGE_RANGE, GENDERS } from '@/utils/constants';
import { api } from '@/api';
import { AuthContext } from '@/context/auth-provider';
import useAsyncOperation from '@/hooks/use-async-operation';
import { routes } from '@/utils/constants/routes';
import { decodeToken, decrypt } from '@/utils/helper';
import { updateUser } from '@/store/features/auth.slice';
import { useTranslations } from 'next-intl';
import useSocket from '@/hooks/use-socket';
import { fetchUser } from '@/store/features/user.slice';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';

const useProfileUpdateForm = () => {
  const { user, setToken } = useContext(AuthContext);
  const { updateSocketOnLogin } = useSocket();

  const [fetchUserData] = useDispatchWithAbort(fetchUser);
  const { data: userData } = useSelector(({ user }: any) => user);
  const router = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations();

  const initialValues = {
    first_name: '',
    last_name: '',
    location: '',
    age: '',
    gender: 'male',
  };

  const { enqueueSnackbar } = useSnackbar();

  const plainPassword = useMemo(() => {
    return decrypt(userData?.passwordforUI);
  }, [userData?.passwordforUI]);


  useEffect(() => {
    if(fetchUserData){
        fetchUserData({
            params: { user_id: user?.id }
        });
    }
  }, [fetchUserData, user?.id]);

  const [onSubmit, loading] = useAsyncOperation(async (values: any) => {
    await api.user.update({ data: values, params: { user_id: user?.id } });
    const { first_name, last_name, age } = values;
    await api.getAccess.openAccess({
      data: { email: userData?.email, first_name, last_name, age },
    });

    const response = await api.auth.login({
      auth: {
        username: userData?.email,
        password: plainPassword,
      },
    });
    if (response?.data) {
      const token = response?.data?.data?.token;
      if (token) {
        setToken(token);
        updateSocketOnLogin(token);
      }
      const decodeData = decodeToken(token);
      dispatch(
        updateUser({
          token,
          activeUI: '',
          isLoggedIn: true,
          ...user,
          ...decodeData,
        })
      );
      enqueueSnackbar('Data submitted successfully.', { variant: 'success' });
      resetForm();

      if (decodeData?.is_verified) {
        router.push(routes.private.dashboard);
      } else {
        router.push(routes.public.home);
      }
    }
  });

  const {
    errors,
    values,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema: profileUpdateValidation(t),
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    setValues(prev => ({
      ...prev,
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
    }));
  }, [userData, setValues]);

  const countriesData = useMemo(() => {
    return Object.values(countries).map(({ name }) => ({
      label: name,
      value: name,
    }));
  }, []);

  const formData = useMemo(
    () => [
      {
        id: 'first_name',
        name: 'first_name',
        value: values.first_name,
        placeholder: t('your_first_name'),
        handleChange,
        handleBlur,
        error: touched.first_name && errors.first_name,
        type: 'text',
      },
      {
        id: 'last_name',
        name: 'last_name',
        value: values.last_name,
        placeholder: t('your_last_name'),
        handleChange,
        handleBlur,
        error: touched.last_name && errors.last_name,
        type: 'text',
      },
      {
        id: 'location',
        name: 'location',
        value: values.location,
        placeholder: t('country'),
        handleChange,
        handleBlur,
        error: touched.location && errors.location,
        type: 'autocomplete',
        options: countriesData,
      },
      {
        id: 'age',
        name: 'age',
        value: values.age,
        placeholder: t('your_age'),
        handleChange,
        handleBlur,
        error: touched.age && errors.age,
        type: 'autocomplete',
        options: [
          { value: 'under 18', label: t('age_range.label') },
          ...AGE_RANGE,
        ],
      },
      {
        id: 'gender',
        name: 'gender',
        value: values.gender,
        handleChange,
        handleBlur,
        error: touched.gender && errors.gender,
        type: 'radio',
        options: GENDERS.map(gender => ({
          ...gender,
          label: t(gender.label),
        })),
        row: true,
      },
    ],
    [countriesData, errors, handleBlur, handleChange, touched, values, t]
  );

  return { handleSubmit, formData, loading };
};

export default useProfileUpdateForm;
