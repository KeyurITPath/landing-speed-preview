import { useContext } from 'react';
import { Checkbox, FormControlLabel, Link, Stack, Typography, styled } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import CustomButton from '../../../../../../shared/button';
import { decodeToken, isEmptyObject } from '../../../../../../assets/utils/function';
import { openAccessNowValidation } from '../../../../../../assets/utils/validations';
import FormControl from '../../../../../../shared/inputs/form-control';
import { api } from '../../../../../../api';
import { AuthContext } from '../../../../../../contexts/AuthContext';
import { gtm } from '../../../../../../assets/utils/gtm';
import useAsyncOperation from '../../../../../../hooks/use-async-operation';
import { DOMAIN } from '../../../../../../constant';
import { pixel } from '../../../../../../assets/utils/pixel';
import { URLS } from '../../../../../../constant/urls';
import { updateUser } from '../../../../../../redux/slices/auth.slice';
import { Trans, useTranslation } from 'react-i18next';
import useSocket from '../../../../../../hooks/use-socket';

const TermsLink = styled(Link)(() => ({
    color: '#304BE0',
    textDecorationColor: 'black',
    ':hover': {
        opacity: 0.7
    }
}));

const OpenAccessForm = ({ courseData, utm_source, queryParams, activeLandingPage, domainName, utmData }) => {
    const { user, setToken } = useContext(AuthContext);
    const { updateSocketOnLogin } = useSocket();

    const { course, currency, language, languages } = useSelector((state) => state.defaults);
    const { data: languagesData } = languages || {};

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const initialValues = { email: user?.email || '', isAgreeTerms: Boolean(utm_source) };
    const isLanding3LangPage = activeLandingPage?.name === 'landing3';

    const [onSubmit, loading] = useAsyncOperation(async (values) => {
        const selectedLanguage = languagesData?.find(
            (lang) => Number(lang.id) === Number(language?.id)
        );

        const res = await api.getAccess.openAccess({
            data: {
                email: values.email,
                final_url: course?.slug,
                currency_id: currency?.id,
                domain: DOMAIN,
                user_language: selectedLanguage?.name,
                user_currency: currency?.code,
                landing_page: course?.landing_page
            }
        });
        const { token } = res?.data?.data || {};

        let registerUserData = {};

        if (token) {
            setToken(token);
            updateSocketOnLogin(token);
            registerUserData = decodeToken(token);
            dispatch(
                updateUser({
                    token,
                    activeUI: '',
                    ...user,
                    ...registerUserData
                })
            );
        }

        gtm.ecommerce.add_to_cart();

        let success_url = '';
        const { origin, pathname } = window.location;

        if (registerUserData) {
            success_url = `${origin}${URLS.REDIRECTING_PAGE.path}?redirection-page=${URLS.DASHBOARD.path}&payment=success&type=purchase_course`;
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
            ...queryParams
        };

        const resOrderCheckout = await api.getAccess.orderCheckout({ data });

        if (resOrderCheckout?.data?.data?.checkoutUrl) {
            pixel.initial_checkout({
                content_ids: [],
                ...(!isEmptyObject(utmData) ? { utmData } : {})
            });
            window.location.href = resOrderCheckout?.data?.data?.checkoutUrl;
        }
    });

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: openAccessNowValidation(t),
        onSubmit
    });

    const isAgreeTermsError = touched?.isAgreeTerms && errors?.isAgreeTerms;

    return (
        <Stack sx={{ gap: { xs: 2.5, sm: 7 } }}>
            <Stack
                sx={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: { xs: 2.5, sm: 7 }
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ color: 'initial.black', fontWeight: 700 }}
                    textAlign={'center'}
                >
                    {t('open_access_form.complete_form')}
                </Typography>

                <Stack component="form" sx={{ gap: 2.5 }} onSubmit={handleSubmit}>
                    <Stack sx={{ gap: { xs: 2.5, sm: 7 } }} alignItems={'center'}>
                        <FormControl
                            {...{ handleBlur, handleChange }}
                            label={t('your_email')}
                            placeholder={t('open_access_form.email_placeholder')}
                            name="email"
                            fullWidth
                            error={touched?.email && errors?.email}
                            value={values?.email}
                        />
                        <CustomButton
                            {...{ loading }}
                            size="large"
                            type="submit"
                            variant="gradient"
                            sx={{ height: 60, width: { xs: '100%', sm: 300 } }}
                        >
                            {t('open_access_form.go_to_checkout')}
                        </CustomButton>
                    </Stack>
                    <FormControlLabel
                        sx={{ alignItems: 'start' }}
                        control={
                            <Checkbox
                                size="small"
                                color="primaryNew"
                                name="isAgreeTerms"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                checked={values?.isAgreeTerms}
                                sx={{ mt: -1.1 }}
                            />
                        }
                        label={
                            <Typography
                                variant="body2"
                                sx={{ color: isAgreeTermsError ? 'error.main' : 'black' }}
                            >
                                <Trans
                                    i18nKey="terms_of_service_link"
                                    components={{
                                        refund: (
                                            <TermsLink
                                                href="/refund-policies"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                        terms: (
                                            <TermsLink
                                                href="/terms-of-service"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                        privacy: (
                                            <TermsLink
                                                href="/privacy-policy"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        )
                                    }}
                                />
                            </Typography>
                        }
                    />
                </Stack>
            </Stack>
        </Stack>
    );
};

export default OpenAccessForm;
