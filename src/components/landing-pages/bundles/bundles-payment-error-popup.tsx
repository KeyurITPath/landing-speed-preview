'use client';

import React from 'react';
import {
  Box,
  Modal,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import CustomButton from '@shared/button';
import { ICONS } from '@assets/icons';

const BundlesPaymentErrorPopup = ({
  open,
  errorMessage,
  onClose,
}: {
  open: boolean;
  errorMessage: string;
  onClose: () => void;
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          p: 3,
          maxWidth: '500px',
          width: '100%',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: '#747474',
          }}
        >
          <ICONS.CLOSE size={24} />
        </IconButton>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography
            variant='h6'
            sx={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#0E0E0E',
            }}
          >
            Payment Error
          </Typography>

          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#747474',
            }}
          >
            {errorMessage || 'Payment failed. Please try again.'}
          </Typography>

          <CustomButton
            fullWidth
            onClick={onClose}
            variant='contained'
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#FFFFFF',
              mt: 2,
            }}
          >
            Close
          </CustomButton>
        </Stack>
      </Box>
    </Modal>
  );
};

export default BundlesPaymentErrorPopup;

