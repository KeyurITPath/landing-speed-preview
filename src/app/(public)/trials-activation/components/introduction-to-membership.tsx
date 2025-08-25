import { Box, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { linearGradients } from '@/theme/color';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/helper';

const IntroductionToMembership = ({
  BRAND_NAME,
  monthlySubscriptionData,
}: any) => {
  const t = useTranslations();
  const { currency } = useSelector((state: any) => state.defaults);

  const price = formatCurrency(
    monthlySubscriptionData?.subscription_plan_prices?.[0]?.amount || 0,
    monthlySubscriptionData?.subscription_plan_prices?.[0]?.currency?.name ||
      currency?.code ||
      'USD'
  );

  return (
    <Stack sx={{ gap: { xs: 2.5, sm: 3 } }}>
      <Typography variant='body1'>
        {t.rich('freeTrialText', {
          price,
          span: chunks => (
            <Box component='span' sx={{ fontWeight: 600 }}>
              {chunks}
            </Box>
          ),
        })}
      </Typography>
      <Stack
        sx={{
          background: linearGradients.primary,
          p: { xs: 3, sm: 4 },
          gap: { xs: 2, sm: 3 },
          borderRadius: 0.8,
          color: 'common.white',
        }}
      >
        <Typography variant='h5' sx={{ zIndex: 1, color: 'common.white' }}>
          {t('guaranteed')}
        </Typography>
        <Typography variant='body1' sx={{ zIndex: 1, color: 'common.white' }}>
          {t('cancelTrialText')}
        </Typography>
      </Stack>
      <Typography variant='body1'>
        <Box component='span' sx={{ fontWeight: 600 }}>
          {'whyActNow'}
          {':'}
        </Box>{' '}
        {t('specialOfferText')}
      </Typography>
      <Typography variant='h4' sx={{ fontWeight: 500 }}>
        {t('membershipTitle', { brand_name: BRAND_NAME })}
      </Typography>
      <Typography variant='subtitle1'>
        {t('membershipSubtitle', { brand_name: BRAND_NAME })}
      </Typography>
      <Typography variant='body2'>{t('membershipDescription1')}</Typography>
      <Typography variant='body2'>
        {t('membershipDescription2', { brand_name: BRAND_NAME })}
      </Typography>
    </Stack>
  );
};

export default IntroductionToMembership;
