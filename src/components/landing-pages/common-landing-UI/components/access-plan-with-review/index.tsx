import React from 'react';
import { useMemo } from 'react';
import {
  Box,
  Container,
  Grid2,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import CustomButton from '@/shared/button';
import { ICONS } from '@/assets/icons';
import ReviewCard from './components/review-card';
import { formatCurrency } from '../../../../../utils/helper';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const StyledLink = styled(Link)(() => ({
  color: '#782fef',
  textDecoration: 'none',
  fontWeight: 400,
  transition: 'opacity 0.3s',
  '&:hover': {
    opacity: 0.7,
  },
}));

const GetAccessWithReview = ({ landingData, getAccessOpen }: any) => {
  const {
    data,
    course,
    SUPPORT_MAIL,
    isBecomeAMemberWithVerified,
    isBecomeVerifiedAndSubscribed,
    isUserPurchasedCourse,
    handleProceedToWatch,
  } = landingData;

  const canProceedToWatch =
    isUserPurchasedCourse || isBecomeVerifiedAndSubscribed;

  const shouldShowPriceDetails =
    !isBecomeVerifiedAndSubscribed &&
    !isBecomeAMemberWithVerified &&
    !isUserPurchasedCourse;

  const dispatch = useDispatch();
  const t = useTranslations();
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

  const withIncrease = useMemo(() => {
    const calculatedDiscount = 100 - course?.discount;
    const actualPrice = (prices.price / calculatedDiscount) * 100;

    return formatCurrency(actualPrice, prices.currency);
  }, [course?.discount, prices.currency, prices.price]);
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'primary.container',
        py: { xs: 2, md: shouldShowPriceDetails ? 8 : 4 },
      }}
    >
      <Container maxWidth='md'>
        <Box sx={{ width: '100%', py: 3 }}>
          {shouldShowPriceDetails && (
            <>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: 28,
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                {prices?.currency ? prices?.currency : ''}{' '}
                {formatCurrency(prices.price, prices.currency)}
              </Typography>
              <Typography sx={{ fontSize: 16 }}>
                {course?.discount && (
                  <>
                    <span
                      style={{
                        color: '#808080',
                        textDecoration: 'line-through',
                      }}
                    >
                      {withIncrease || ''}
                    </span>{' '}
                    <span style={{ fontWeight: 600 }}>
                      {course?.discount || 0}% — {t('discount')}
                    </span>
                  </>
                )}
              </Typography>
              <Typography sx={{ color: 'error.main', fontSize: 16 }}>
                {t('end_of_sale')}:{' '}
                <span style={{ color: 'black' }}>{t('hours')}</span>
              </Typography>
            </>
          )}
          <CustomButton
            sx={{
              mb: 2,
              mt: 4,
              borderRadius: '2rem',
              minHeight: '58px',
              width: { xs: '100%', sm: '300px' },
              display: 'flex',
              flexDirection: 'column',
              '.MuiButton-icon': {
                position: 'absolute',
                alignSelf: 'flex-end',
              },
              fontSize: 16,
              fontWeight: 500,
              px: 4,
            }}
            endIcon={
              <ICONS.ARROW_RIGHT
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 400,
                }}
              />
            }
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
          <Stack direction='row' mb={1} alignItems='center' spacing={2}>
            <ICONS.SHIELD_CHECK size={26} color={'#1E1E1E'} />
            <Typography
              sx={{ fontWeight: 500, fontSize: 16 }}
              color='primary.typography'
            >
              {t('money_back')}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: { xs: 13, sm: 16 }, fontWeight: 400 }}>
            {t.rich('email_support_message', {
              email: SUPPORT_MAIL,
              a: chunk => (
                <StyledLink href={`mailto:${SUPPORT_MAIL}`}>{chunk}</StyledLink>
              ),
            })}
          </Typography>
        </Box>
        <hr
          style={{
            border: '1px dashed #808080',
            margin: '42px 0',
            opacity: 0.2,
          }}
        />
        <Typography
          sx={{
            color: 'primary.typography',
            fontWeight: 500,
            fontSize: 28,
            mt: 3,
            mb: 3,
          }}
        >
          {t('comments_about_course')}
        </Typography>
        <Grid2 container spacing={2} sx={{ width: '100%' }}>
          <Grid2 size={{ xs: 12 }}>
            <Box sx={{ position: 'relative' }}>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={50}
                slidesPerView={1}
                loop={true}
                pagination={{
                  clickable: true,
                }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
              >
                {data?.comments?.map((review: any, index: number) => (
                  <SwiperSlide key={index}>
                    <ReviewCard review={review} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className='swiper-button-prev swiper-button-bg-color-white' />
              <div className='swiper-button-next swiper-button-bg-color-white' />
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default GetAccessWithReview;
