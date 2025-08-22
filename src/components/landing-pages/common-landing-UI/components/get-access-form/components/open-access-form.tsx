import { useContext, useMemo } from 'react';
import {
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import CustomButton from '@/shared/button';
import { decodeToken, formatCurrency, isEmptyObject } from '@/utils/helper';
import { openAccessNowValidation } from '@/utils/validations';
import FormControl from '@/shared/inputs/form-control';
import { api } from '@/api';
import { AuthContext } from '@/context/auth-provider';
// import { gtm } from '@/assets/utils/gtm';
import useAsyncOperation from '@/hooks/use-async-operation';
import { DOMAIN } from '@/utils/constants';
// import { pixel } from '@/assets/utils/pixel';
import { routes } from '@/utils/constants/routes';
import { updateUser } from '@/store/features/auth.slice';
import { useTranslations } from 'next-intl';
// import useSocket from '@/hooks/use-socket';
import Link from 'next/link';

const TermsLink = styled(Link)(() => ({
  color: 'black',
  textDecorationColor: 'black',
  ':hover': {
    opacity: 0.7,
  },
}));

const OpenAccessForm = ({
  landingData,
  courseData,
  setActiveForm,
  utm_source,
  utmData,
  queryParams,
  isCourseUpsaleCoursesAvailable,
}: any) => {
  const { user, setToken } = useContext(AuthContext);
  // const { updateSocketOnLogin } = useSocket();

  const { course, currency, language, languages } = useSelector(
    ({ defaults }: any) => defaults
  );
  const { data: languagesData } = languages || {};

  const dispatch = useDispatch();

  const initialValues = {
    email: user?.email || '',
    isAgreeTerms: Boolean(utm_source),
  };

  const t = useTranslations();

  const [onSubmit, loading] = useAsyncOperation(async (values: any) => {
    const selectedLanguage = languagesData?.find(
      (lang: any) => Number(lang.id) === Number(language?.id)
    );

    const res = await api.getAccess.openAccess({
      data: {
        email: values.email,
        final_url: course?.slug,
        currency_id: currency?.id,
        domain: DOMAIN,
        user_language: selectedLanguage?.name,
        user_currency: currency?.code,
        landing_page: course?.landing_page,
      },
    });
    const { token } = res?.data?.data || {};

    let registerUserData = {};

    if (token) {
      setToken(token);
      registerUserData = decodeToken(token);
      // updateSocketOnLogin(token);
      dispatch(
        updateUser({
          token,
          activeUI: '',
          ...user,
          ...registerUserData,
        })
      );
    }

    // gtm.ecommerce.add_to_cart();
    if (!isCourseUpsaleCoursesAvailable) {
      let success_url = '';
      const { origin, pathname } = window.location;
      if (registerUserData?.is_verified) {
        success_url = `${origin}${pathname}?payment=success`;
      } else {
        sessionStorage.setItem('hasSalesFlowAccess', true);
        const queryString = new URLSearchParams(queryParams).toString();
        success_url = `${origin}${routes.public.email_verification}?payment=success${queryString ? `&${queryString}` : ''}`;
      }

      const cancel_url = `${origin}${pathname}?payment=failed`;

      const data = {
        stripe_price_id: courseData?.course_prices?.[0]?.stripe_price_id,
        selected_upsale_price_ids: [],
        user_id: registerUserData?.id,
        final_url: course?.slug,
        success_url,
        cancel_url,
        domain: DOMAIN,
        ...queryParams,
      };

      const resOrderCheckout = await api.getAccess.orderCheckout({ data });
      if (resOrderCheckout?.data?.data?.checkoutUrl) {
        // await pixel.initial_checkout({
        //     userId: registerUserData?.id,
        //     content_ids: [],
        //     ...(!isEmptyObject(utmData) ? { utmData } : {})
        // });
        window.location.href = resOrderCheckout?.data?.data?.checkoutUrl;
      }
    } else {
      setActiveForm('checkout-form');
    }
  });

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      enableReinitialize: true,
      validationSchema: openAccessNowValidation(t),
      onSubmit,
    });

  const isAgreeTermsError = touched?.isAgreeTerms && errors?.isAgreeTerms;

  const coursePrice = useMemo(() => {
    const defaultPrice = courseData?.course_prices?.[0];
    const amount = defaultPrice?.price;
    const currencyCode = defaultPrice?.currency?.name;

    return formatCurrency(amount, currencyCode);
  }, [courseData?.course_prices]);

  return (
    <Stack sx={{ gap: { xs: 2.5, sm: 4 } }}>
      <Typography variant='h5' sx={{ color: 'common.black', fontWeight: 500 }}>
        {t('save_your_seat')}
      </Typography>
      <Divider
        sx={{
          borderStyle: 'dashed',
          borderColor: '#dfdfdf',
        }}
      />
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 35,
          gap: 2,
        }}
      >
        <Typography
          variant='body1'
          sx={{ color: 'common.black', fontWeight: 500 }}
        >
          {landingData?.header}
        </Typography>
        <Typography
          variant='body1'
          sx={{ color: 'common.black', fontWeight: 500, textWrap: 'nowrap' }}
        >
          {coursePrice}
        </Typography>
      </Stack>
      <Divider
        sx={{
          borderStyle: 'dashed',
          borderColor: '#dfdfdf',
        }}
      />
      <Typography
        variant='body1'
        sx={{ color: 'common.black', fontWeight: 500, textAlign: 'right' }}
      >
        {t('total')}: {coursePrice}
      </Typography>
      <Stack component='form' sx={{ gap: 2.5 }} onSubmit={handleSubmit}>
        <Stack sx={{ gap: 1.5 }}>
          <FormControl
            {...{ handleBlur, handleChange }}
            label={t('your_email')}
            placeholder='example@mail.com'
            name='email'
            error={touched?.email && errors?.email}
            value={values?.email}
          />
          <FormControlLabel
            sx={{ alignItems: 'start' }}
            control={
              <Checkbox
                size='small'
                name='isAgreeTerms'
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values?.isAgreeTerms}
                sx={{ mt: -1.1 }}
              />
            }
            label={
              <Typography
                variant='body2'
                sx={{ color: isAgreeTermsError ? 'error.main' : 'black' }}
              >
                {t.rich('terms_of_service', {
                  refund: chunks => (
                    <TermsLink
                      href='/refund-policies'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {chunks}
                    </TermsLink>
                  ),
                  terms: chunks => (
                    <TermsLink
                      href='/terms-of-service'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {chunks}
                    </TermsLink>
                  ),
                  privacy: chunks => (
                    <TermsLink
                      href='/privacy-policy'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {chunks}
                    </TermsLink>
                  ),
                })}
              </Typography>
            }
          />
        </Stack>
        <CustomButton {...{ loading }} size='large' type='submit'>
          {t('openAccessNow')}
        </CustomButton>
      </Stack>
    </Stack>
  );
};

export default OpenAccessForm;
