'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Button,
  Divider,
  Grid2,
  IconButton,
  Modal,
  Stack,
  Typography,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import CustomButton from '@shared/button';
import { ICONS } from '@assets/icons';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SuccessPaymentPopup from '../../success-payment-popup';
import FailedPaymentPopup from '../../failed-payment-popup';
import useUpsale from './useUpsale';
import { formatCurrency } from '@/utils/helper';
import UpsalePaymentErrorPopup from './upsale-payment-error-popup';

const UpsaleCourses = ({
  courseData,
  currency,
}: {
  courseData?: any;
  currency?: any;
}) => {
  const t = useTranslations();
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  // Use the custom hook
  const {
    selectedUpsales,
    loading,
    isLoadingUpsales,
    isPaymentSuccess,
    isPaymentFailed,
    showPaymentError,
    paymentErrorMessage,
    upsaleCourses,
    totalPrice,
    handleAddToOrder,
    removeFromOrder,
    handleCheckout,
    handleDeclineUpsale,
    handleClosePaymentError,
    isCompleteButtonDisabled,
  } = useUpsale(courseData, currency);
  // Memoize the display condition for navigation buttons
  const showNavigation = useMemo(
    () => upsaleCourses?.length > 3,
    [upsaleCourses?.length]
  );

  // Skeleton loading component for upsale courses
  const UpsaleCourseSkeleton = () => (
    <Box
      sx={{
        border: '1px solid #e9ecef',
        borderRadius: '14px',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Skeleton
        variant='rectangular'
        height={isMobile ? 130 : 170}
        width='100%'
        sx={{ borderRadius: '14px 14px 0 0' }}
      />
      <Stack
        gap={1}
        sx={{
          p: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Skeleton variant='text' height={40} width='100%' />
        <Skeleton variant='text' height={24} width='80%' />
        <Skeleton
          variant='rectangular'
          height={36}
          width='100%'
          sx={{ borderRadius: '8px', mt: 'auto' }}
        />
      </Stack>
    </Box>
  );

  // Selected course (the one user originally purchased) - get from props or API
  const selectedCourse = {
    id: courseData?.course?.id || courseData?.id || 'main-course',
    title:
      courseData?.course?.course_translations?.[0]?.title ||
      courseData?.course_translations?.[0]?.title ||
      courseData?.course_title ||
      '',
    price: courseData?.course?.course_prices?.[0]
      ? formatCurrency(
          courseData.course.course_prices[0].price,
          courseData.course.course_prices[0].currency?.name
        )
      : formatCurrency(19, 'USD'),
  };

  const UpsaleCourseCard = ({ course }: { course: any }) => {
    const { title, image, price, actualPrice, id } = course;
    const isSelected = selectedUpsales.find((item: any) => item.id === id);

    return (
      <Box
        sx={{
          border: '1px solid #e9ecef',
          borderRadius: '14px',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.2s',
          // maxWidth: { xs: '170px', sm: '200px' },
          width: '100%',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Image
          width={200}
          height={170}
          src={image}
          alt={title}
          style={{
            objectFit: 'cover',
            aspectRatio: '16/9',
            width: '100%',
            height: isMobile ? '130px' : '170px',
          }}
        />

        <Stack
          gap={1}
          sx={{
            p: 2,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Typography
            variant='body2'
            sx={{
              fontWeight: 500,
              fontSize: { xs: '14px' },
              lineHeight: 1.3,
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant='subtitle2'
            sx={{
              fontWeight: 500,
              fontSize: { xs: '16px' },
            }}
          >
            {price}{' '}
            <Box
              component='span'
              sx={{
                textDecoration: 'line-through',
                color: '#747474',
                fontSize: { xs: '16px' },
                fontWeight: 500,
              }}
            >
              {actualPrice}
            </Box>
          </Typography>

          <CustomButton
            size='small'
            onClick={() =>
              isSelected ? removeFromOrder(id) : handleAddToOrder(course)
            }
            variant={isSelected ? 'outlined' : 'contained'}
            sx={{
              color: isSelected ? '#FFFFFF' : '#FFFFFF',
              border: isSelected ? '1px solid #ddd' : 'none',
              fontSize: '14px',
              fontWeight: 400,
              '&.MuiButton-outlined': {
                color: '#747474',
                borderColor: '#747474',
              },
              '&.MuiButton-outlined:hover': {
                color: '#747474',
                borderColor: '#747474',
                backgroundColor: '#ddd9d9 !important',
                opacity: 0.8,
              },
            }}
          >
            {isSelected ? 'Delete' : 'Add to order'}
          </CustomButton>
        </Stack>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3 } }}>
        <Stack spacing={{ xs: 3, sm: 4 }}>
          {/* Header Section */}
          <Stack gap={2}>
            <Typography
              variant='h3'
              sx={{
                fontSize: { xs: '24px', md: '28px' },
                fontWeight: 600,
              }}
            >
              Add a Hot Pick, Save Big!
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                fontWeight: 400,
                color: '#747474',
              }}
            >
              Enhance your learning experience by adding these supplementary
              courses to the one you&apos;ve already purchased, and watch your
              progress accelerate to three times its previous pace.
            </Typography>
          </Stack>

          <Stack
            sx={{
              backgroundColor: '#F5F6FD',
              borderRadius: '16px',
              p: { xs: 2, sm: 3 },
            }}
          >
            {/* Available Upsale Courses */}
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  mb: 2,
                }}
              >
                <Box
                  className='navigation-wrapper'
                  sx={{
                    display: {
                      xs: 'none',
                      md: showNavigation ? 'flex!important' : 'none!important',
                    },
                    gap: 2,
                  }}
                >
                  <div
                    className='swiper-button-prev upsale-courses-slider-swiper-button-prev'
                    style={{ position: 'relative', top: '0px' }}
                  >
                    <ICONS.KeyboardArrowLeft size={32} />
                  </div>
                  <div
                    className='swiper-button-next upsale-courses-slider-swiper-button-next'
                    style={{ position: 'relative', top: '0px' }}
                  >
                    <ICONS.KeyboardArrowRight size={32} />
                  </div>
                </Box>
              </Box>
              <Swiper
                modules={isMobile ? [Navigation, Pagination] : [Navigation]}
                slidesPerView={2}
                spaceBetween={16}
                style={{ width: '100%' }}
                pagination={{ clickable: isMobile && true }}
                navigation={
                  !isMobile
                    ? {
                        nextEl: '.upsale-courses-slider-swiper-button-next',
                        prevEl: '.upsale-courses-slider-swiper-button-prev',
                      }
                    : false
                }
                breakpoints={{
                  0: {
                    slidesPerView: 2,
                  },
                  600: {
                    slidesPerView: 2,
                  },
                  900: {
                    slidesPerView: 3,
                  },
                }}
              >
                {isLoadingUpsales
                  ? // Show skeleton loading when loading
                    Array.from({ length: 3 }).map((_, index) => (
                      <SwiperSlide key={index}>
                        <Box pb={{ xs: 4, sm: 2 }}>
                          <UpsaleCourseSkeleton />
                        </Box>
                      </SwiperSlide>
                    ))
                  : upsaleCourses?.length > 0
                    ? // Show actual courses when available
                      upsaleCourses?.map((course: any) => (
                        <SwiperSlide key={course.id}>
                          <Box pb={{ xs: 4, sm: 2 }}>
                            <UpsaleCourseCard course={course} />
                          </Box>
                        </SwiperSlide>
                      ))
                    : null}
              </Swiper>
            </Box>

            {/* Total and Checkout Section */}
            <Stack sx={{ gap: 2 }}>
              <Divider sx={{ borderColor: '#dfdfdf' }} />
              <Stack sx={{ gap: 3, mt: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <CustomButton
                    fullWidth
                    variant='outlined'
                    onClick={handleDeclineUpsale}
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      '&.MuiButton-outlined': {
                        color: '#49AE56',
                        borderColor: '#49AE56',
                      },
                      '&:hover': {
                        color: '#FFFFFF',
                        borderColor: '#49AE56',
                        opacity: 0.8,
                      },
                    }}
                  >
                    No, I don&apos;t Need
                  </CustomButton>
                  <CustomButton
                    fullWidth
                    loading={loading}
                    disabled={isCompleteButtonDisabled}
                    onClick={handleCheckout}
                    variant='contained'
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#FFFFFF',
                    }}
                  >
                    Complete
                  </CustomButton>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Payment popups */}
      <SuccessPaymentPopup open={isPaymentSuccess} />
      <FailedPaymentPopup open={isPaymentFailed} />

      {/* Payment Error Popup for Upsale */}
      <UpsalePaymentErrorPopup
        open={showPaymentError}
        errorMessage={paymentErrorMessage}
        onClose={handleClosePaymentError}
      />
    </Box>
  );
};

export default UpsaleCourses;
