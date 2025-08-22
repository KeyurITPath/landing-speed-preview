import { useContext } from 'react';
import {
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import CustomButton from '@/shared/button';
import { decodeToken, isEmptyObject } from '@/utils/helper';
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
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// import useSocket from '@/hooks/use-socket';

const TermsLink = styled(Link)(() => ({
  color: '#304BE0',
  textDecorationColor: 'black',
  ':hover': {
    opacity: 0.7,
  },
}));

const OpenAccessForm = ({
  courseData,
  utm_source,
  activeLandingPage,
  domainName,
  utmData,
}: any) => {
  const { user, setToken } = useContext(AuthContext);
  // const { updateSocketOnLogin } = useSocket();

  const searchParams = useSearchParams();

  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const { course, currency, language, languages } = useSelector(
    ({ defaults }: any) => defaults
  );
  const { data: languagesData } = languages || {};

  const dispatch = useDispatch();
  const t = useTranslations();

  const initialValues = {
    email: user?.email || '',
    isAgreeTerms: Boolean(utm_source),
  };
  const isLanding3LangPage = activeLandingPage === 'landing3';

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
      // updateSocketOnLogin(token);
      registerUserData = decodeToken(token);
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

    let success_url = '';
    const { origin, pathname } = window.location;

    if (registerUserData) {
      success_url = `${origin}${routes.public.redirecting_page}?redirection-page=${routes.private.dashboard}&payment=success&type=purchase_course`;
    }

    const cancel_url = `${origin}${pathname}?payment=failed`;

    const data = {
      stripe_price_id: courseData?.course_prices?.[0]?.stripe_price_id,
      selected_upsale_price_ids: [],
      user_id: registerUserData?.id,
      success_url,
      cancel_url,
      is_purchase_from_landing_3: isLanding3LangPage && true,
      domain: isLanding3LangPage ? domainName : DOMAIN,
      final_url: course?.slug,
      ...params
    };

    const resOrderCheckout = await api.getAccess.orderCheckout({ data });

    if (resOrderCheckout?.data?.data?.checkoutUrl) {
      // pixel.initial_checkout({
      //     content_ids: [],
      //     ...(!isEmptyObject(utmData) ? { utmData } : {})
      // });
      window.location.href = resOrderCheckout?.data?.data?.checkoutUrl;
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

  return (
    <Stack sx={{ gap: { xs: 2.5, sm: 7 } }}>
      <Stack
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 2.5, sm: 7 },
        }}
      >
        <Typography
          variant='h4'
          sx={{ color: 'initial.black', fontWeight: 700 }}
          textAlign={'center'}
        >
          {t('open_access_form.complete_form')}
        </Typography>

        <Stack component='form' sx={{ gap: 2.5 }} onSubmit={handleSubmit}>
          <Stack sx={{ gap: { xs: 2.5, sm: 7 } }} alignItems={'center'}>
            <FormControl
              {...{ handleBlur, handleChange }}
              label={t('your_email')}
              placeholder={t('open_access_form.email_placeholder')}
              name='email'
              fullWidth
              error={touched?.email && errors?.email}
              value={values?.email}
            />
            <CustomButton
              {...{ loading }}
              size='large'
              type='submit'
              variant='gradient'
              sx={{ height: 60, width: { xs: '100%', sm: 300 } }}
            >
              {t('open_access_form.go_to_checkout')}
            </CustomButton>
          </Stack>
          <FormControlLabel
            sx={{ alignItems: 'start' }}
            control={
              <Checkbox
                size='small'
                color='primaryNew'
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
                {t.rich('terms_of_service_link', {
                  refund: chunks => (
                    <TermsLink
                      href={routes.public.refund_policies}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {chunks}
                    </TermsLink>
                  ),
                  terms: chunks => (
                    <TermsLink
                      href={routes.public.terms_of_service}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {chunks}
                    </TermsLink>
                  ),
                  privacy: chunks => (
                    <TermsLink
                      href={routes.public.privacy_policy}
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
      </Stack>
    </Stack>
  );
};

export default OpenAccessForm;
