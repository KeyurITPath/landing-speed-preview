import React from 'react';
import { Box } from '@mui/material';

interface ResendOTPProps {
  style?: React.CSSProperties;
  onResendClick: () => void;
  renderButton: (props: { onClick: () => void }) => React.ReactNode;
  renderTime: () => React.ReactNode;
}

const ResendOTP: React.FC<ResendOTPProps> = ({
  style,
  onResendClick,
  renderButton,
  renderTime,
  ...props
}) => {
  return (
    <Box style={style} {...props}>
      {renderButton({ onClick: onResendClick })}
      {renderTime()}
    </Box>
  );
};

export default ResendOTP;
