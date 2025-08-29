'use client';
import { FormHelperText, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import CustomButton from '@/shared/button';
import FormControl from '@/shared/inputs/form-control';
import useEmailVerification from './useEmailVerification';
import LandingLayoutContainer from '@/shared/landing-layout-container';
import PopUpModal from '@/shared/pop-up-modal';
import SuccessPaymentPopup from '@/components/success-payment-popup';
import FailedPaymentPopup from '@/components/failed-payment-popup';

const EmailVerificationComponent = ({ data }: any) => {
  const t = useTranslations();
  const {
    formData,
    handleSubmit,
    loading,
    hidePhoneField,
    isPaymentFailed,
    isPaymentSuccess,
    validationClose,
    validationState,
  } = useEmailVerification({ data });

  return (
    <>
      <LandingLayoutContainer>
        <Stack
          sx={{
            px: 2,
            py: 0.4,
            alignItems: 'center',
            bgcolor: '#FFDFDC',
            borderRadius: '26px',
          }}
        >
          <Typography variant='subtitle1' sx={{ textAlign: 'center' }}>
            {t('order_incomplete_message')}{' '}
          </Typography>
        </Stack>
        <Typography
          variant='h4'
          sx={{ textAlign: { xs: 'center', sm: 'left' } }}
        >
          {t('order_almost_complete')}
        </Typography>

        <Typography
          variant='subtitle1'
          sx={{ fontWeight: 400, textAlign: { xs: 'center', sm: 'left' } }}
        >
          {t('order_instructions')}
        </Typography>

        <Stack
          component='form'
          onSubmit={handleSubmit}
          sx={{ maxWidth: { sm: '350px' }, gap: 2 }}
        >
          {formData.map(({ id, ...input }: any) => {
            return (
              <Stack key={id} sx={{ gap: 0.8 }}>
                {id === 'confirmEmail' && (
                  <FormHelperText>
                    {t('email_verification_prompt')}
                  </FormHelperText>
                )}
                <FormControl {...input} />
              </Stack>
            );
          })}
          <CustomButton
            variant='gradient'
            size='large'
            loading={typeof loading === 'boolean' ? loading : false}
            type='submit'
          >
            {hidePhoneField
              ? t('confirm_email_button')
              : t('confirm_email_phone_button')}
          </CustomButton>
        </Stack>
      </LandingLayoutContainer>

      {/* Validation popup */}
            <PopUpModal
                open={validationState}
                onClose={validationClose}
                message={t('validation_error_message')}
                successButton={{
                    text: t('validation_okay_button'),
                    onClick: validationClose
                }}
            />

            {/* Payment popups */}
            <SuccessPaymentPopup open={isPaymentSuccess} />
            <FailedPaymentPopup open={isPaymentFailed} />
    </>
  );
};

export default EmailVerificationComponent;
