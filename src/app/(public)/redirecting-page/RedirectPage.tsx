'use client';
import { useCallback, useContext, useState, useEffect, useMemo } from 'react';
import { enqueueSnackbar } from 'notistack';
import { api } from '@/api';
import { decodeToken } from '@/utils/helper';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AuthContext } from '@/context/auth-provider';
import { ERROR_MESSAGES, USER_ROLE } from '@/utils/constants';
import { updateUser } from '@/store/features/auth.slice';
import { routes } from '@/utils/constants/routes';
import useSocket from '@/hooks/use-socket';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import FailedPaymentPopup from '@/components/failed-payment-popup';
import NoData from './NoData';

const RedirectPageComponent = ({ user }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { setToken } = useContext(AuthContext);
  const { updateSocketOnLogin } = useSocket();
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState(true);
  const [userLoginSuccess, setUserLoginSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showFailedMessage, setShowFailedMessage] = useState(false);

  const token = searchParams.get('token');
  const payment = searchParams.get('payment');
  const redirectionPage = searchParams.get('redirection-page');

  const verifyTokenHandler = useCallback(
    async (token: string) => {
      try {
        setIsLoading(true);
        if (token) {
          const response = await api.auth.verifyToken({ data: { token } });

          if (response?.data?.data?.is_verified && response?.data?.data?.token) {
            const newGeneratedToken = response?.data?.data?.token;

            const decodeData = decodeToken(newGeneratedToken);

            if (decodeData?.role === USER_ROLE.CUSTOMER) {
              setToken(newGeneratedToken);
              updateSocketOnLogin(newGeneratedToken);
              dispatch(
                updateUser({
                  token: newGeneratedToken,
                  activeUI: '',
                  isLoggedIn: true,
                  ...user,
                  ...decodeData,
                })
              );

              if (decodeData?.is_verified) {
                setUserLoginSuccess(true);
              }
            }
          }
        }
      } catch (error: any) {
        enqueueSnackbar(error?.message || ERROR_MESSAGES.common, {
          variant: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setToken, updateSocketOnLogin, dispatch, user]
  );

  const handleRedirect = useCallback(() => {
    setIsRedirecting(true);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('token');
    params.delete('redirection-page');

    const remainingParams = params.toString();
    const targetUrl = remainingParams
      ? `${redirectionPage}?${remainingParams}`
      : redirectionPage || routes.public.home;

    setTimeout(() => {
      router.replace(targetUrl);
    }, 200);
  }, [searchParams, redirectionPage, router]);

  useEffect(() => {
    if (token && payment === 'success') {
      verifyTokenHandler(token);
    } else if (payment === 'failed') {
      setShowFailedMessage(true);
      setIsLoading(false);
    }
  }, [token, payment, verifyTokenHandler]);

  const isPaymentFailed = useMemo(() => payment === 'failed', [payment]);

  useEffect(() => {
    if (userLoginSuccess) {
      setTimeout(() => {
        handleRedirect();
      }, 300);
    }
  }, [userLoginSuccess, handleRedirect]);

  const showRedirectingLoader = isLoading || isRedirecting;

  if (showRedirectingLoader ||  userLoginSuccess)
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          minHeight: '100vh',
          gap: 2,
          p: 3,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {t('redirecting')}
        </Typography>
      </Box>
    );

  if (isPaymentFailed && showFailedMessage)
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            minHeight: '100vh',
            gap: 2,
            p: 3,
          }}
        >
          <Typography variant="h6" color="error">
            {t('payment_failed')}
          </Typography>
        </Box>

        <FailedPaymentPopup open={true} />
      </>
    );

  if (!isLoading && !userLoginSuccess && !isPaymentFailed)
    return <NoData />;

  return null;
};

export default RedirectPageComponent;
