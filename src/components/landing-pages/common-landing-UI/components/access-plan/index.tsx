import React from 'react';
import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { OVERRIDE } from '@/theme/basic';
import CustomButton from '@/shared/button';
import { initial } from '@/theme/color';
import { formatCurrency } from '@/utils/helper';
import { getAccessOpen } from '@/store/features/course.slice';
import { useTranslations } from 'next-intl';

const AccessPlan = ({ landingData }: any) => {
  const {
    isBecomeAMemberWithVerified,
    isBecomeVerifiedAndSubscribed,
    isUserPurchasedCourse,
    handleProceedToWatch,
    course,
  } = landingData;

  const dispatch = useDispatch();
  const t = useTranslations();

  const canProceedToWatch =
    isUserPurchasedCourse || isBecomeVerifiedAndSubscribed;

  const shouldShowPriceDetails =
    !isBecomeVerifiedAndSubscribed &&
    !isBecomeAMemberWithVerified &&
    !isUserPurchasedCourse;

  const prices = useMemo(() => {
    const clone = { ...course };
    if (clone?.course_prices?.length) {
      const currentDefaultPrice = clone?.course_prices?.[0];
      return {
        price: currentDefaultPrice?.price || 0,
        currency: currentDefaultPrice?.currency?.name || 'USD',
      };
    } else
      return {
        price: 0,
        currency: 'USD',
      };
  }, [course]);

  const actualPrice = useMemo(() => {
    const calculatedDiscount = 100 - course?.discount;
    const actualPrice = (prices.price / calculatedDiscount) * 100 || 0;

    return formatCurrency(actualPrice, prices.currency);
  }, [course?.discount, prices.currency, prices.price]);

  return (
    <Box
      sx={{
        width: '100%',
        ...OVERRIDE({}).FLEX,
        boxShadow: {
          xs: 'none',
          sm: '0px -1px 3px 0px #0000001A',
        },
        background: {
          xs: 'transparent',
          sm: initial.white,
        },
        py: { xs: 2, sm: 2 },
        px: { xs: 3, sm: 2 },
        position: 'sticky',
        zIndex: 10,
        bottom: 0,
        left: 0,
      }}
    >
      <CustomButton
        sx={{
          borderRadius: '2rem',
          minHeight: '58px',
          width: { xs: '100%', sm: '300px' },
          display: { xs: 'flex', sm: 'none' },
          flexDirection: 'column',
          '.MuiButton-icon': {
            position: 'absolute',
            alignSelf: 'flex-end',
          },
          fontSize: 16,
          fontWeight: 500,
          px: 4,
        }}
        onClick={() => {
          if (canProceedToWatch) {
            handleProceedToWatch();
          } else {
            dispatch(getAccessOpen());
          }
        }}
      >
        {canProceedToWatch ? t('proceed_to_watch') : t('get_access')}
      </CustomButton>
      <Box
        sx={{
          display: { xs: 'none', sm: 'flex' },
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {shouldShowPriceDetails && (
          <Typography fontSize={{ xs: 12, sm: 18 }} fontWeight={500}>
            {course?.discount && (
              <Box
                component='span'
                sx={{
                  fontWeight: 400,
                  color: '#808080',
                  textDecoration: 'line-through',
                }}
              >
                {actualPrice || 0}
              </Box>
            )}{' '}
            {formatCurrency(prices.price, prices.currency)}{' '}
            {course?.discount && (
              <Box component='span' sx={{ fontWeight: 400 }}>
                - {t('discount')} {course?.discount || 0}%
              </Box>
            )}
          </Typography>
        )}

        <CustomButton
          sx={{ ml: { xs: 1, sm: 2 }, borderRadius: '2rem' }}
          onClick={() => {
            if (canProceedToWatch) {
              handleProceedToWatch();
            } else {
              dispatch(getAccessOpen());
            }
          }}
        >
          {canProceedToWatch ? t('proceed_to_watch') : t('get_access')}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default AccessPlan;
