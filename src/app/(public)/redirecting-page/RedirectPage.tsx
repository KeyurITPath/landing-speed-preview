'use client';
import { useCallback, useContext, useState, useEffect, useMemo } from 'react';
import { enqueueSnackbar } from 'notistack';
import { api } from '@/api';
import { decodeToken } from '@/utils/helper';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
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
  const queryParams = useSearchParams();
  const dispatch = useDispatch();
  const { setToken } = useContext(AuthContext);
  const { updateSocketOnLogin } = useSocket();
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState(true);
  const [userLogInSuccess, isUserLogInSuccess] = useState(false);

  const verifyTokenHandler = useCallback(
    async (token: any) => {
      try {
        setIsLoading(true);

        if (queryParams?.get('token')) {
          const response = await api.auth.verifyToken({
            data: {
              token,
            },
          });
          if (response?.data?.data?.is_verified) {
            const decodeData = decodeToken(token);
            if (decodeData?.role === USER_ROLE.CUSTOMER) {
              setToken(token);
              updateSocketOnLogin(token);
              dispatch(
                updateUser({
                  token,
                  activeUI: '',
                  isLoggedIn: true,
                  ...user,
                  ...decodeData,
                })
              );
              if (decodeData?.is_verified) {
                isUserLogInSuccess(true);
              }
            }
          }
        }
      } catch (error) {
        enqueueSnackbar(error?.message || ERROR_MESSAGES.common, {
          variant: 'error',
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [queryParams, setToken, updateSocketOnLogin, dispatch, user]
  );

  const handleRedirect = useCallback(() => {
    const searchParams = new URLSearchParams(queryParams);
    const redirectionPage = searchParams.get('redirection-page');
    searchParams.delete('token');
    searchParams.delete('redirection-page');

    const remainingParams = searchParams.toString();
    const targetPath = `${redirectionPage}`;
    router.replace(`${targetPath}?${remainingParams}`);
  }, [queryParams, router]);

  const handleRedirectToHome = useCallback(() => {
    router.push(routes.public.home);
  }, [router]);

  useEffect(() => {
    if (
      queryParams?.get('token') &&
      queryParams?.get('payment') === 'success'
    ) {
      verifyTokenHandler(queryParams?.get('token'));
    } else if (queryParams?.get('payment') === 'failed') {
      setIsLoading(false);
    }
  }, [queryParams, verifyTokenHandler]);

  const isPaymentFailed = useMemo(() => {
    return queryParams?.get('payment') === 'failed';
  }, [queryParams]);

  useEffect(() => {
    if (userLogInSuccess) {
      handleRedirect();
    }
  }, [userLogInSuccess, handleRedirect]);

  if (isLoading)
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
        <Typography variant='h6' color='text.secondary'>
          {t('redirecting')}
        </Typography>
      </Box>
    );

  if (isPaymentFailed) return <FailedPaymentPopup open={isPaymentFailed} />;
  if (!isLoading && !userLogInSuccess && !isPaymentFailed)
    return <NoData navigateHomePage={handleRedirectToHome} />;
};

export default RedirectPageComponent;
