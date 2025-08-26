'use client';
import {
  Avatar,
  Button,
  Divider,
  Grid2,
  Skeleton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import FormControl from '@/shared/inputs/form-control';
import useSettingAndSubscription from './use-setting-and-subscription';
import CustomButton from '@/shared/button';
import CancelDelayPopup from '@/components/cancel-delay-popup';
import SuccessSubscriptionPopup from '@/components/success-subscription-popup';
// import CancelPopups from '../../components/cancel-popups';
import { useMemo } from 'react';
import { linearGradients } from '@/theme/color';

const SettingsFormContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: '30px',
  background: '#FFFFFF',
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
  },
}));

const FormContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: '50px 30px',
  [theme.breakpoints.down('sm')]: {
    padding: '25px 15px',
  },
}));

const PhotoUploadButton = styled(Typography)(() => ({
  color: '#304BE0',
  fontSize: '14px',
  fontWeight: 400,
  cursor: 'pointer',
}));

const SubscriptionButton = styled(CustomButton)(() => ({
  borderRadius: '4px',
  padding: '15px 20px',
  fontWeight: 600,
  textTransform: 'none',
}));

const SettingAndSubscriptionContainer = ({
  user,
  language_id,
  domainDetails,
  country_code,
}: any) => {
  const {
    userSettingsFormData,
    handleSubmit,
    image,
    handleImageUpload,
    BRAND_NAME,
    transFormData,
    handleSubscription,
    handleSubscriptionLoading,
    isImageUploadedLoading,
    cancelDelayPopupState,
    cancelDelayPopupClose,
    transformCancelDelayPopupData,
    isMobile,
    isBecomeAMemberWithVerified,
    cancelDelayPopupsDataLoading,
    handleManageBilling,
    manageBillingBtnLoading,
    cancelDelayBtnDisabled,
    isSubscriptionActivated,
    isSubscriptionLoader,
    cancelPopupsState,
    cancelPopupsClose,
    onCancelPopupCancel,
    onCancelPopupSuccess,
    handleCancelPopupWarningSuccess,
    handleSaveFeedbackFormData,
    saveFeedBackFormData,
    onSubmit,
    cancelDelayBtnLoading,
    resetCancelPopup,
    setResetCancelPopup,
    onCancelPopupCancelLoading,
    isFormUpdated,
    canSaveChanges,
    isSubmitting,
    transformTrialSubscriptionData,
  } = useSettingAndSubscription({
    language_id,
    user,
    domainDetails,
    country_code,
  });

  const t = useTranslations();
  const {
    isSubscribed,
    subscriptionPrice,
    next_payment_date,
    findActiveSubscriptionPlanName,
  } = transFormData || {};
  const { price }: any = transformTrialSubscriptionData || {};

  const isLifeTimeSubscription = useMemo(() => {
    return findActiveSubscriptionPlanName === 'Lifetime subscription';
  }, [findActiveSubscriptionPlanName]);

  return (
    <SettingsFormContainer>
      <Stack sx={{ border: '1px solid #BBBBBB59', borderRadius: '8px' }}>
        <Grid2 container>
          <Grid2 size={{ xs: 12, sm: 3, md: 2 }}>
            <Stack
              sx={{ py: 4, px: 3 }}
              alignItems='center'
              spacing={2}
              id='profile-avatar'
            >
              <Avatar
                alt='profile_avatar'
                src={image && image}
                sx={{
                  height: { xs: 70, sm: 100 },
                  width: { xs: 70, sm: 100 },
                  border: '1px solid #BBBBBB59',
                }}
              />
              <input
                accept='image/*'
                id='photo-upload'
                type='file'
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <label htmlFor='photo-upload'>
                <PhotoUploadButton component='span'>
                  {t('upload_photo')}
                </PhotoUploadButton>
              </label>
            </Stack>
          </Grid2>
          <Divider
            orientation='vertical'
            flexItem
            sx={{
              display: { xs: 'none', sm: 'block' },
              borderColor: '#BBBBBB59',
            }}
          />
          <Grid2 size={{ xs: 12, sm: 8, md: 9 }}>
            <FormContainer>
              <Grid2 container spacing={3} width={'100%'}>
                {userSettingsFormData?.map(item => (
                  <Grid2 size={item?.sx} key={item?.id}>
                    <FormControl
                      fullWidth
                      mainSx={{ width: '100%' }}
                      {...item}
                    />
                  </Grid2>
                ))}
                <Grid2 size={{ xs: 12 }}>
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Typography variant='subtitle2' fontWeight={400}>
                      {t('subscription')}
                    </Typography>

                    {!isSubscribed ? (
                      <>
                        {isSubscriptionLoader ? (
                          <Skeleton
                            variant='rounded'
                            width='100%'
                            height={60}
                          />
                        ) : (
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            sx={{
                              overflow: 'hidden',
                            }}
                            spacing={2}
                          >
                            <Typography
                              variant='body2'
                              color='#747474'
                              sx={{
                                backgroundColor: '#E7E7E7',
                                borderRadius: '6px',
                                padding: '15px 20px',
                                width: { xs: '100%', sm: '124px' },
                                fontWeight: 600,
                                textAlign: 'center',
                              }}
                            >
                              {t('not_active')}
                            </Typography>
                            <SubscriptionButton
                              variant='gradient'
                              sx={{
                                width: '100%',
                                borderRadius: '8px',
                              }}
                              onClick={handleSubscription}
                              loading={handleSubscriptionLoading}
                            >
                              {t('activate_subscription', {
                                payment_per_month: price || subscriptionPrice,
                              })}
                            </SubscriptionButton>
                          </Stack>
                        )}
                        <Typography variant='caption' color='#747474'>
                          {t('brand_name_subscription_grant_message', {
                            brand_name: BRAND_NAME,
                          })}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          sx={{
                            border: {
                              xs: 'none',
                              sm: '1px solid #BBBBBB59',
                            },
                            borderRadius: '6px',
                            overflow: 'hidden',
                          }}
                          spacing={{ xs: 2, sm: 0 }}
                        >
                          <Typography
                            variant='body2'
                            color='white'
                            sx={{
                              background: linearGradients.primary,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: {
                                xs: '6px',
                                sm: '6px 0 0 6px',
                              },
                              padding: '15px 20px',
                              width: 'auto',
                              minWidth: '128px',
                              fontWeight: 600,
                              textAlign: 'center',
                            }}
                          >
                            {t('activated')}
                          </Typography>
                          {cancelDelayBtnDisabled ? (
                            <Typography
                              variant='body2'
                              color='#747474'
                              sx={{
                                backgroundColor: '#BBBBBB59',
                                borderRadius: {
                                  xs: '6px',
                                  sm: '6px 0 0 6px',
                                },
                                padding: '15px 20px',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              {t.rich('subscription_cancel_delay_message', {
                                payment_date: next_payment_date || '',
                                span: chunks => (
                                  <span
                                    style={{
                                      fontWeight: 500,
                                      color: '#0E0E0E',
                                      marginLeft: '4px',
                                    }}
                                  >
                                    {chunks}
                                  </span>
                                ),
                              })}
                            </Typography>
                          ) : isLifeTimeSubscription && !next_payment_date ? (
                            <Typography
                              variant='body2'
                              color='#747474'
                              sx={{
                                backgroundColor: '#BBBBBB59',
                                borderRadius: {
                                  xs: '6px',
                                  sm: '6px 0 0 6px',
                                },
                                padding: '15px 20px',
                                width: '100%',
                              }}
                            >
                              {t.rich(
                                'lifetime_subscription_activated_message',
                                {
                                  planName:
                                    findActiveSubscriptionPlanName || '',
                                  span: chunks => (
                                    <span
                                      style={{
                                        fontWeight: 500,
                                        color: '#0E0E0E',
                                      }}
                                    >
                                      {chunks}
                                    </span>
                                  ),
                                }
                              )}
                            </Typography>
                          ) : (
                            <Typography
                              variant='body2'
                              color='#747474'
                              sx={{
                                backgroundColor: '#BBBBBB59',
                                borderRadius: {
                                  xs: '6px',
                                  sm: '6px 0 0 6px',
                                },
                                padding: '15px 20px',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              {t.rich('upcoming_payment_month_due_on', {
                                payment_per_month: subscriptionPrice || '',
                                payment_date: next_payment_date || '',
                                span: chunks => (
                                  <span
                                    style={{
                                      fontWeight: 500,
                                      color: '#0E0E0E',
                                      marginLeft: '4px',
                                    }}
                                  >
                                    {chunks}
                                  </span>
                                ),
                              })}
                            </Typography>
                          )}
                        </Stack>

                        {!isLifeTimeSubscription && (
                          <Button
                            onClick={onSubmit}
                            sx={{
                              mt: 2,
                              color: '#304BE0 !important',
                              fontWeight: 500,
                              fontSize: 14,
                              paddingX: 0,
                              alignSelf: 'flex-start',
                              backgroundColor: 'transparent',
                              '&:hover': {
                                backgroundColor: 'transparent !important',
                                opacity: 0.7,
                              },
                              '&:disabled': {
                                backgroundColor: 'transparent !important',
                                opacity: 0.7,
                              },
                            }}
                            disableRipple
                            variant='text'
                            loading={cancelDelayBtnLoading}
                            disabled={cancelDelayBtnDisabled}
                          >
                            {cancelDelayBtnLoading
                              ? t('submitting')
                              : t('cancel_subscription_settings')}
                          </Button>
                        )}
                      </>
                    )}
                  </Stack>
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <Stack spacing={3} sx={{ mt: 2 }}>
                    <Grid2 container spacing={4}>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Stack spacing={1}>
                          <Typography variant='subtitle2' fontWeight={400}>
                            {t('billing')}
                          </Typography>

                          <CustomButton
                            variant='gradient'
                            sx={{
                              width: { xs: '100%', sm: '150px' },
                              borderRadius: '8px',
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                            onClick={handleManageBilling}
                            loading={manageBillingBtnLoading}
                          >
                            {t('manage_billing')}
                          </CustomButton>
                          <Typography variant='caption' color='#747474'>
                            {t('used_to_manage_your_stripe_account')}
                          </Typography>
                        </Stack>
                      </Grid2>
                    </Grid2>
                  </Stack>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                  <Stack
                    direction='row'
                    justifyContent='flex-start'
                    sx={{ mt: 3 }}
                  >
                    <CustomButton
                      variant='gradient'
                      onClick={handleSubmit}
                      disabled={
                        !isFormUpdated ||
                        !canSaveChanges ||
                        isImageUploadedLoading
                      }
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                      loading={isSubmitting || isImageUploadedLoading}
                    >
                      {t('save')}
                    </CustomButton>
                  </Stack>
                </Grid2>
              </Grid2>
            </FormContainer>
          </Grid2>
        </Grid2>
      </Stack>

      <CancelDelayPopup
        {...{
          open: cancelDelayPopupState,
          onClose: cancelDelayPopupClose,
          data: {
            ...transformCancelDelayPopupData,
            isMobile,
            isBecomeAMemberWithVerified,
          },
          isLoading: cancelDelayPopupsDataLoading,
          cancelDelayBtnLoading,
          onClickCancelDelay: cancelDelayPopupClose,
        }}
      />

      <SuccessSubscriptionPopup open={isSubscriptionActivated} />
    </SettingsFormContainer>
  );
};

export default SettingAndSubscriptionContainer;
