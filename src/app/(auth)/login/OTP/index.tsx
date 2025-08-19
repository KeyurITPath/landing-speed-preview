import { useDispatch } from 'react-redux';
import { Box, styled, Typography } from '@mui/material';
import { OVERRIDE } from '@/theme/basic';
import OTPContainer, { ResendOTP } from '@/shared/OTP/OTPInput';
import useOTP from './useOTP';
import CustomButton from '../../../../shared/button';
import { primaryNew } from '../../../../theme/color';
import Link from 'next/link';
import { routes } from '@/utils/constants/routes';
import { formatTime } from '@/utils/helper';
import { setActiveUI } from '@/store/features/auth.slice';

const Container = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(4),
  ...OVERRIDE({}).FLEX,
  flexDirection: 'column',
  textAlign: 'center',
}));

const ResendButton = styled(CustomButton)(({ theme }) => ({
  fontWeight: 600,
  color: '#292F79 !important',
  fontSize: 14,
  padding: theme.spacing(0.25, 0.5),
  background: 'transparent !important',
  boxShadow: 'none !important',
  '&:hover': {
    background: 'transparent !important',
    boxShadow: 'none !important',
  },
  '&:disabled': {
    color: theme.palette.grey[400],
  },
}));

const RenderButtonBox = styled(Box)(({ theme }) => ({
  ...OVERRIDE({ justifyContent: 'flex-start' }).FLEX,
  width: '100%',
  marginTop: theme.spacing(3),
  flexDirection: 'column',
}));

const OTP = () => {
  const {
    errors,
    user,
    values,
    remainingTime,
    isResendDisabled,
    handleSubmit,
    handleResendClick,
    handleChange,
    isLoading,
  } = useOTP();
  const dispatch = useDispatch();

  const handleGoBackToLogin = () => {
    dispatch(setActiveUI(''));
  };

  const renderButton = ({ onClick, ...buttonProps }: any) => (
    <RenderButtonBox>
      <Box mb={2}>
        <Typography fontSize={14} fontWeight={600}>
          Did not receive a code?
        </Typography>
      </Box>

      <ResendButton
        {...{ onClick }}
        {...buttonProps}
        disabled={isResendDisabled}
      >
        Resend OTP
      </ResendButton>
    </RenderButtonBox>
  );

  const renderTime = (remainingTime: number) => (
    <Box
      sx={{
        ...OVERRIDE({ justifyContent: 'center' }).FLEX,
        width: '100%',
        mt: 2,
      }}
    >
      <Typography align='right' fontSize={14} fontWeight={500}>
        Wait to resend:{' '}
        <span style={{ color: '#292F79' }}>{formatTime(remainingTime)}</span>
      </Typography>
    </Box>
  );

  return (
    <Container>
      <Typography
        variant='h5'
        fontWeight={500}
        fontSize={24}
        color='#5E5873'
        mb={2}
      >
        Email Verification
      </Typography>

      <Typography variant='body1' fontSize={14} color='textSecondary' mb={3}>
        Please enter the verification code sent to your email to complete the
        process.
      </Typography>

      <Typography
        variant='body1'
        fontWeight={700}
        color='#292F79'
        fontSize={16}
        mb={2}
      >
        {`Enter the OTP sent to your email ${user?.email}`}
      </Typography>

      <OTPContainer
        {...{ error: errors.otp }}
        style={{ justifyContent: 'center', margin: '16px 0' }}
        value={values.otp}
        handleChange={handleChange}
        OTPLength={6}
      />

      <ResendOTP
        style={{
          ...OVERRIDE({
            justifyContent: 'start',
          }).FLEX,
          flexDirection: 'column',
        }}
        onResendClick={handleResendClick}
        renderButton={renderButton}
        renderTime={() => renderTime(remainingTime)}
      />

      <CustomButton
        sx={{ mt: 3, minWidth: 90 }}
        variant='gradient'
        size='large'
        loading={isLoading}
        onClick={() => handleSubmit()}
      >
        Verify
      </CustomButton>

      <Typography
        component={Link}
        href={routes.auth.login}
        variant='body2'
        onClick={handleGoBackToLogin}
        sx={{
          textDecoration: 'none',
          color: primaryNew.main,
          '&:hover': {
            color: '#192b93',
          },
          mt: 2,
        }}
      >
        Go back to login?
      </Typography>
    </Container>
  );
};

export default OTP;
