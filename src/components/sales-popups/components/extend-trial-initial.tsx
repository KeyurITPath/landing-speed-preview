import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { TRIAL_ACTIVATION_METHODS } from '../../../utils/constants';
import { useContext, useMemo } from 'react';
import { Box, Stack, styled, Typography } from '@mui/material';
import { error } from '../../../theme/color';
import CustomButton from '../../../shared/button';
import useAsyncOperation from '../../../hooks/use-async-operation';
import { api } from '../../../api';
import { decodeToken, getSubscriptionPayload } from '../../../utils/helper';
import { updateUser } from '../../../store/features/auth.slice';
import { AuthContext } from '../../../context/auth-provider';
// import useSocket from '../../../hooks/use-socket';

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'src',
})(({ theme, src }: any) => ({
  width: '100%',
  height: '100%',
  minHeight: 680,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  backgroundImage: `url(${src})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const ExtendTrialInitial = ({
  handleCancel,
  title,
  description,
  image,
  trial_days,
  rootHandleSuccess,
  purchasePayload,
  slug,
}: any) => {
  const { setToken } = useContext(AuthContext);
  const t = useTranslations();
  const dispatch = useDispatch();
  // const { updateSocketOnLogin } = useSocket();
  const { user } = useSelector(({ auth }: any) => auth);

  const [onSuccess, loading] = useAsyncOperation(async () => {
    const payload = {
      ...purchasePayload,
      trial_days: Number(trial_days),
      name: 'monthly subscription',
      trial_activation_method:
        TRIAL_ACTIVATION_METHODS.SALES_EXTEND_TRIAL_1_POPUP,
      ...getSubscriptionPayload(),
    };

    const response = await api.plan.purchasePlan({
      data: payload,
    });

    if (response?.data?.data?.checkoutUrl) {
      window.open(response?.data?.data?.checkoutUrl, '_self');
      return;
    } else {
      const { token } = response?.data?.data || {};

      let registerUserData = {};

      if (token) {
        registerUserData = decodeToken(token);
        setToken(token);
        // updateSocketOnLogin(token);
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

const mainButtonValue = useMemo(
  () => t("extend_trial_initial", { trial_days }),
  [t, trial_days]
);

  return (
    <StyledBox src={encodeURI(image)}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 4,
          background: 'white',
          borderTopRightRadius: '56px',
        }}
      >
        <Typography
          variant='body1'
          sx={{ color: error.main, fontSize: 20, fontWeight: 600 }}
          color='error'
        >
          {title}
        </Typography>
        <Typography
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            overflowY: {
              xs: 'auto',
              sm: 'unset',
            },
            ul: {
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
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
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                top: 2,
                left: 0,
              },
            },
          }}
          variant='body1'
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <Stack sx={{ gap: 2, width: '100%', mt: 4 }}>
          <CustomButton
            {...{ loading }}
            fullWidth
            sx={{ textTransform: 'uppercase' }}
            onClick={onSuccess}
          >
            {mainButtonValue}
          </CustomButton>
          <CustomButton
            fullWidth
            sx={{ textTransform: 'uppercase' }}
            color='secondary'
            onClick={handleCancel}
          >
            {t('decline_the_opportunity')}
          </CustomButton>
        </Stack>
      </Box>
    </StyledBox>
  );
};

export default ExtendTrialInitial;
