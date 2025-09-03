import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import CustomButton from '@/shared/button';
import useAsyncOperation from '@/hooks/use-async-operation';
import { api } from '@/api';
import { useTranslations } from 'next-intl';
import { TRIAL_ACTIVATION_METHODS } from '@/utils/constants';
import { decodeToken, getSubscriptionPayload } from '@/utils/helper';
import { updateUser } from '@/store/features/auth.slice';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '@/context/auth-provider';
import { useContext } from 'react';
import { fetchUser } from '@/store/features/user.slice';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import useSocket from '@/hooks/use-socket';
import cookies from 'js-cookie';

const ExtendTrial = ({
  handleCancel,
  title,
  description,
  image,
  rootHandleSuccess,
  purchasePayload,
  trial_days,
  slug,
}: any) => {
  const { user } = useSelector(({ auth }: any) => auth);
  const { updateSocketOnLogin } = useSocket();
  const dispatch = useDispatch();
  const country_code = cookies.get('country_code');
  const { setToken } = useContext(AuthContext);
  const [fetchUserData] = useDispatchWithAbort(fetchUser);

  const [onSuccess, loading] = useAsyncOperation(async () => {
    if (user?.subscription_type === 'trial') {
      await api.plan.cancelSubscription({
        data: {
          userId: purchasePayload.userId,
          is_cancel_immediately: true,
        },
      });
    }

    const additionalPayload = {
      ...purchasePayload,
    };
    delete additionalPayload['trial_days'];

    const payload = {
      ...additionalPayload,
      ...(trial_days && user?.subscription_type === 'trial'
        ? { trial_days }
        : {}),
      name: 'monthly subscription',
      trial_activation_method:
        TRIAL_ACTIVATION_METHODS.CANCEL_EXTEND_TRIAL_POPUP,
      ...getSubscriptionPayload(),
    };

    const response = await api.plan.purchasePlan({
      data: { ...payload },
    });

    if (response?.data?.data?.checkoutUrl) {
      window.open(response?.data?.data?.checkoutUrl, '_self');
      return;
    } else {
      if (fetchUserData) {
        fetchUserData({
          params: { user_id: user?.id },
          headers: {
            'req-from': country_code,
          },
        });
      }
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
          height: { xs: 240, sm: '100%' },
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
          <Typography variant='h5'>{title}</Typography>
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
            }}
          />
        </Stack>
        <Stack
          sx={{ flexDirection: { sm: 'row' }, alignItems: 'center', gap: 2 }}
        >
          <CustomButton
            variant='gradient'
            {...{ loading }}
            fullWidth
            sx={{ textTransform: 'capitalize', borderRadius: 8 }}
            onClick={onSuccess}
          >
            {t('pause_for', { trial_days })}
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
