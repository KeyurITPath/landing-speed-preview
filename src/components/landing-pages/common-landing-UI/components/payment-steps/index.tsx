import React from 'react';
import {
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  styled,
} from '@mui/material';
import { useTranslations, useMessages } from 'next-intl';

const CustomStepLabel = styled(StepLabel)(() => ({
  '& .MuiStepLabel-iconContainer': {
    '& .MuiStepIcon-root': {
      color: 'transparent',
      border: '1px solid',
      borderColor: '#747474',
      borderRadius: '50%',
      '& text': {
        fill: '#747474',
      },
    },
  },
}));

const PaymentSteps = ({ BRAND_NAME }: any) => {
  const t = useTranslations();
  const messages = useMessages();

  const paymentSteps = messages['payment_steps'];

  return (
    <Container maxWidth='md' sx={{ pb: { xs: 2, md: 4 } }}>
      <Typography
        color='primary.typography'
        fontWeight={500}
        fontSize={28}
        mb={3.75}
      >
        {t('after_payment_practicing')}
      </Typography>
      <Stepper orientation='vertical' activeStep={-1}>
        {paymentSteps.map((step: string, index: number) => (
          <Step key={index}>
            <CustomStepLabel>
              <Typography>
                {t.rich(`payment_steps.${index}`, { brand_name: BRAND_NAME })}
              </Typography>
            </CustomStepLabel>
          </Step>
        ))}
      </Stepper>
    </Container>
  );
};

export default PaymentSteps;
