import React from 'react';
import {
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import CustomButton from '@/shared/button';
import { ICONS } from '@/assets/icons';
import { useTranslations } from 'next-intl';

interface UpsalePaymentErrorPopupProps {
  open: boolean;
  onClose: () => void;
  errorMessage?: string;
}

const UpsalePaymentErrorPopup = ({
  open,
  onClose,
  errorMessage = 'Payment failed. Please try again.',
}: UpsalePaymentErrorPopupProps) => {
  const t = useTranslations();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="body"
      fullWidth={true}
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 1,
        },
      }}
    >
      <DialogContent sx={{ px: 8, py: 4, bgcolor: 'white' }}>
        <Stack sx={{ gap: 3.5, alignItems: 'center' }}>
          {/* Error Icon */}
          <Stack
            sx={{
              color: 'error.main',
              fontSize: 60,
            }}
          >
            <ICONS.CloseCircle />
          </Stack>

          {/* Payment Failed Title */}
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Payment Failed
          </Typography>

          {/* Dynamic Error Message */}
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              lineHeight: 1.6,
              fontSize: '16px',
            }}
          >
            {errorMessage}
          </Typography>

          {/* Action Button */}
          <CustomButton
            color="error"
            onClick={onClose}
            sx={{ width: '100%', maxWidth: '200px' }}
          >
            OK
          </CustomButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default UpsalePaymentErrorPopup;
