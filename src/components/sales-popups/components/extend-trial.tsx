import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { IMAGES } from '@/assets/images';
import CustomButton from '@/shared/button';
import useCountdownTimer from '@/hooks/use-countdown-timer';
import useAsyncOperation from '@/hooks/use-async-operation';
import { api } from '@/api';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { TRIAL_ACTIVATION_METHODS } from '@/utils/constants';
import { decodeToken, getSubscriptionPayload } from '@/utils/helper';
import { updateUser } from '@/store/features/auth.slice';
import { AuthContext } from '@/context/auth-provider';
import { useContext } from 'react';
import useSocket from '@/hooks/use-socket';

const ExtendTrial = ({
  handleCancel,
  title,
  description,
  image,
  trial_days,
  rootHandleSuccess,
  purchasePayload,
  slug,
  header,
}: any) => {
  const dispatch = useDispatch();
  const { updateSocketOnLogin } = useSocket();
  const { setToken } = useContext(AuthContext);
  const { user } = useSelector(({ auth }: any) => auth);

  const [countDown] = useCountdownTimer(60);
  const { data } = useSelector(({ popup }: any) => popup?.monthlySubscription);

  const [onSuccess, loading] = useAsyncOperation(async () => {
    const payload = {
      ...purchasePayload,
      trial_days: Number(trial_days),
      name: 'monthly subscription',
      trial_activation_method:
        TRIAL_ACTIVATION_METHODS.SALES_EXTEND_TRIAL_2_POPUP,
      ...getSubscriptionPayload(),
    };

    const response = await api.plan.purchasePlan({
      data: { ...payload },
    });

    if (response?.data?.data?.checkoutUrl) {
      window.open(response?.data?.data?.checkoutUrl, '_self');
      return;
    } else {
      const { token } = response?.data?.data || {};

      let registerUserData = {};

      if (token) {
        registerUserData = decodeToken(token);
        updateSocketOnLogin(token);
        setToken(token);
        dispatch(
          updateUser({
            activeUI: '',
            ...user,
            ...registerUserData,
          })
        );
      }

      rootHandleSuccess(slug);
    }
  });

  const t = useTranslations();

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: {xs: 240, sm: '100%'},
          overflow: 'hidden',
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
          aspectRatio: '16/6',
          position: 'relative',
        }}
      >
        <Image
          fill
          sizes='100vw'
          src={encodeURI(image)}
          style={{
            objectFit: 'cover',
            aspectRatio: '16/6',
            borderRadius: 0,
          }}
          alt='coursesBanner'
        />
      </Box>
      <Stack
        sx={{
          alignItems: 'center',
          py: 1.5,
          px: 3,
          backgroundImage: `url(${IMAGES.gradientBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 400 }}>
          <Box
            dangerouslySetInnerHTML={{ __html: header }}
            sx={{ fontWeight: 400 }}
          />
        </Typography>
      </Stack>
      <Stack
        sx={{
          p: { xs: 3, sm: 4 },
          gap: { xs: 2, sm: 3 },
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <Stack
          sx={{
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'start',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Stack>
              <Typography variant='h5'>{title}</Typography>
              <Typography variant='h5' sx={{ color: 'primary.main' }}>
                {!user?.is_user_purchased_trial
                  ? trial_days
                  : Number(data?.trial_days)}{' '}
                {t('free_trial')}
              </Typography>
            </Stack>
            <Stack
              sx={{ bgcolor: '#FF3A44', py: 0.5, px: 1.5, borderRadius: 1.2 }}
            >
              <Typography
                variant='body2'
                sx={{ color: 'common.white', textWrap: 'nowrap' }}
              >
                00.00.{countDown}
              </Typography>
            </Stack>
          </Stack>
          <Typography
            variant='body1'
            dangerouslySetInnerHTML={{ __html: description }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxHeight: {
                xs: 'calc(100vh - 510px)',
                sm: 'none',
              },
              overflowY: {
                xs: 'auto',
                sm: 'unset',
              },
              ul: {
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                listStyle: 'none',
              },
              li: {
                position: 'relative',
                paddingLeft: '28px',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: 18,
                  height: 18,
                  backgroundImage: `url(${IMAGES.checkEmoji})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  top: 2,
                  left: 0,
                },
              },
            }}
          />
        </Stack>
        <Stack sx={{ gap: 2 }}>
          <CustomButton
            {...{ loading }}
            fullWidth
            sx={{ textTransform: 'capitalize' }}
            onClick={onSuccess}
          >
            {t('begin_journey', {
              trial_days: !user?.is_user_purchased_trial
                ? trial_days
                : Number(data?.trial_days),
            })}
          </CustomButton>
          <CustomButton
            fullWidth
            sx={{ textTransform: 'capitalize' }}
            color='secondary'
            onClick={handleCancel}
          >
            {t('skip_offer')}
          </CustomButton>
        </Stack>
      </Stack>
    </>
  );
};

export default ExtendTrial;
