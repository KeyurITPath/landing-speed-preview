import { forwardRef } from 'react';
import { CircularProgress, Button as MuiButton } from '@mui/material';
import { linearGradients } from '../../theme/color';

import { ButtonProps as MuiButtonProps } from '@mui/material';

interface CustomButtonProps extends Omit<MuiButtonProps, 'variant'> {
  loading?: boolean;
  isShowCloseIconBorder?: boolean;
  variant?: MuiButtonProps['variant'] | 'gradient';
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      color = 'primary',
      size = 'medium',
      variant = 'contained',
      loading = false,
      disabled,
      children,
      sx,
      isShowCloseIconBorder, // remove from rest
      ...props
    },
    ref
  ) => {
    const isGradient = variant === 'gradient';
    const isDisabled = loading || disabled;

    const gradientStyle = {
      transition: 'all 0.3s ease',
      content: '""',
      position: 'absolute',
      height: '100%',
      width: '100%',
      bgcolor: 'rgba(255, 255, 255, 0.3)',
    };

    return (
      <MuiButton
        ref={ref}
        color={color}
        size={size}
        variant={isGradient ? 'contained' : variant}
        disabled={isDisabled}
        {...(loading && {
          startIcon: (
            <CircularProgress size={15} thickness={6} color='inherit' />
          ),
        })}
        sx={{
          ...(isGradient && {
            background: linearGradients.primary,
            color: '#ffffff',
            borderRadius: 0.8,
            position: 'relative',
            ':hover': {
              ':before': {
                ...gradientStyle,
                opacity: 1,
              },
            },
            ':before': {
              ...gradientStyle,
              opacity: isDisabled ? 1 : 0,
            },
          }),
          ...sx,
        }}
        {...props}
      >
        {loading ? 'SUBMITTING...' : children}
      </MuiButton>
    );
  }
);

CustomButton.displayName = 'CustomButton';

export default CustomButton;
