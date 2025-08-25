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
import { useContext } from 'react';
import { AuthContext } from '@/context/auth-provider';
// import useSocket from '@/hooks/use-socket';

const Discount = ({
  handleCancel,
  title,
  description,
  image,
  rootHandleSuccess,
  purchasePayload,
  trial_days,
  stripe_price_id,
  slug,
  header,
}: any) => {
  const t = useTranslations();
  const { user } = useSelector(({ auth }: any) => auth);
  const dispatch = useDispatch();
  const { setToken } = useContext(AuthContext);
  // const { updateSocketOnLogin } = useSocket();

  const [onSuccess, loading] = useAsyncOperation(async () => {
    const payload = {
      ...purchasePayload,
      ...(trial_days ? { trial_days } : {}),
      stripe_price_id,
      trial_activation_method: TRIAL_ACTIVATION_METHODS.SALES_DISCOUNT_POPUP,
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
        // updateSocketOnLogin(token);
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

  return (
    <>
      <Image
        width={600}
        height={280}
        src={encodeURI(image)}
        style={{
          aspectRatio: '16/6',
          borderRadius: 0,
        }}
        alt='coursesBanner'
      />
      <Stack
        sx={{
          alignItems: 'center',
          py: 1.5,
          px: 3,
          background: 'linear-gradient(90deg, #F2F3BC 28.54%, #FF9966 100%)',
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
        <Stack sx={{ gap: { xs: 2, sm: 3 } }}>
          <Typography variant='h5'>{title}</Typography>
          <Typography
            variant='body1'
            dangerouslySetInnerHTML={{ __html: description }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxHeight: {
                xs: 'calc(100vh - 445px)',
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
            {...{ loading }}
            fullWidth
            sx={{ textTransform: 'capitalize' }}
            onClick={typeof onSuccess === 'function' ? onSuccess : undefined}
          >
            {t('keep_subscription')}
          </CustomButton>
          <CustomButton
            fullWidth
            sx={{ textTransform: 'capitalize' }}
            color='secondary'
            onClick={handleCancel}
          >
            {t('still_cancel')}
          </CustomButton>
        </Stack>
      </Stack>
    </>
  );
};

export default Discount;
