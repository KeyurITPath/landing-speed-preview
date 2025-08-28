import { useRouter, usePathname } from 'next/navigation';
import PopUpModal from '@/shared/pop-up-modal';
import { ICONS } from '@/assets/icons';
import { useTranslations } from 'next-intl';
import { Stack, styled, Typography } from '@mui/material';
import { api } from '@/api';
import { useDispatch, useSelector } from 'react-redux';
import { decodeToken } from '@/utils/helper';
import { updateUser } from '@/store/features/auth.slice';
import useSocket from '@/hooks/use-socket';
import { AuthContext } from '@/context/auth-provider';
import { useContext } from 'react';
import cookies from 'js-cookie'

const StyledSuccessText = styled('span')(() => ({
  color: '#51AA4F',
  fontWeight: 600,
  fontSize: '1.5rem',
  display: 'block',
}));

const StyledThankYouText = styled('span')(() => ({
  fontWeight: 400,
  fontSize: '1rem',
  display: 'block',
}));

const SuccessSubscriptionPopup = ({ open }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const t = useTranslations();

  const { setToken } = useContext(AuthContext);

  const { updateSocketOnLogin } = useSocket();
  const { user } = useSelector(({ auth }: any) => auth);

  const handleClose = async () => {
    const response = await api.token.getToken({
      params: {
        userId: user?.id || '',
      },
      cookieToken: cookies.get('token') || ''
    });
    if (response?.data) {
      const token = response?.data?.data;
      const registerUserData = decodeToken(token);
      updateSocketOnLogin(token);
      setToken(token);
      dispatch(
        updateUser({
          activeUI: '',
          ...user,
          ...registerUserData,
        })
      );
      router.replace(pathname);
    }
  };

  return (
    <PopUpModal
      {...{ open }}
      onClose={handleClose}
      icon={ICONS.SHIELD_CHECK}
      message={
        <Stack spacing={2} sx={{ width: '100%', textAlign: 'center' }}>
          <Typography>
            {t.rich('subscription_successful', {
              success: chunks => (
                <StyledSuccessText>{chunks}</StyledSuccessText>
              ),
            })}
          </Typography>
          <Typography>
            {t.rich('thank_you_subscription_message', {
              thankyou: chunks => (
                <StyledThankYouText>{chunks}</StyledThankYouText>
              ),
            })}
          </Typography>
        </Stack>
      }
      successButton={{
        text: t('validation_okay_button'),
        onClick: handleClose,
      }}
    />
  );
};

export default SuccessSubscriptionPopup;
