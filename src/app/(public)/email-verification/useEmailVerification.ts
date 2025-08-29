import { useContext, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import { emailVerificationValidation } from '@/utils/validations';
import { routes } from '@/utils/constants/routes';
import { api } from '@/api';
import { AuthContext } from '@/context/auth-provider';
import useToggleState from '@/hooks/use-toggle-state';
import useAsyncOperation from '@/hooks/use-async-operation';
import { useTranslations } from 'next-intl';
import { DOMAIN } from '@/utils/constants';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchTrialActivation } from '@/store/features/trials-activation.slice';
import { useSelector } from 'react-redux';
import cookies from 'js-cookie';

const useEmailVerification = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const t = useTranslations();
  const queryParams = useSearchParams();
  const [fetchTrialActivationData] = useDispatchWithAbort(fetchTrialActivation);
  const [validationState, validationOpen, validationClose] =
    useToggleState(false);
  const { data: trialActivationData } = useSelector(
    ({ trialsActivation }: any) => trialsActivation.trialsActivation
  );
  const initialValues = useMemo(
    () => ({ email: user?.email || '', confirmEmail: '', phone: '' }),
    [user?.email]
  );

  const [onSubmit, loading] = useAsyncOperation(
    async ({ email, confirmEmail, phone }: any) => {
      if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
        validationOpen();
      } else {
        const data = {
          email,
          phone: phone ? '+' + phone : null,
          domain: DOMAIN,
        };
        await api.user.update({ data, params: { user_id: user?.id }, cookieToken: cookies.get('token') || '' });
        await api.getAccess.openAccess({
          data,
        });
        const queryString = new URLSearchParams(queryParams)?.toString();
        router.push(
          `${routes.public.trial_activation}?${queryString ? `${queryString}` : ''}`
        );
      }
    }
  );

  useEffect(() => {
    if (fetchTrialActivationData) {
      fetchTrialActivationData({});
    }
  }, [fetchTrialActivationData]);

  const { errors, values, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: emailVerificationValidation(t),
      enableReinitialize: true,
      onSubmit,
    });

  const hidePhoneField =
    Array.isArray(trialActivationData) &&
    trialActivationData.length > 0 &&
    trialActivationData[0].status === 'off';

  const formData = useMemo(() => {
    const fields = [
      {
        id: 'email',
        name: 'email',
        value: values.email,
        placeholder: t('enter_email'),
        handleChange,
        handleBlur,
        error: touched.email && errors.email,
        type: 'email',
      },
      {
        id: 'confirmEmail',
        name: 'confirmEmail',
        value: values.confirmEmail,
        placeholder: t('confirm_email'),
        handleChange,
        handleBlur,
        error: touched.confirmEmail && errors.confirmEmail,
        type: 'email',
      },
    ];

    if (!hidePhoneField) {
      fields.push({
        id: 'phone',
        name: 'phone',
        value: values.phone,
        placeholder: t('enter_phone'),
        handleChange,
        handleBlur,
        error: touched.phone && errors.phone,
        type: 'phone',
      });
    }
    return fields;
  }, [values, t, handleChange, handleBlur, touched, errors, hidePhoneField]);

  const isPaymentSuccess = useMemo(() => {
    return queryParams?.get('payment') === 'success';
  }, [queryParams]);

  const isPaymentFailed = useMemo(() => {
    return queryParams?.get('payment') === 'failed';
  }, [queryParams]);

  return {
    handleSubmit,
    formData,
    loading,
    validationState,
    validationClose,
    hidePhoneField,
    isPaymentSuccess,
    isPaymentFailed,
  };
};

export default useEmailVerification;
