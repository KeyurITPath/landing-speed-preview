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
import { Navigation } from 'swiper/modules';
import CustomButton from '@shared/button';
import { ICONS } from '@assets/icons';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SuccessPaymentPopup from '../../success-payment-popup';
import FailedPaymentPopup from '../../failed-payment-popup';
import useUpsale from './useUpsale';
import { formatCurrency } from '@/utils/helper';
import UpsalePaymentErrorPopup from './upsale-payment-error-popup';

// Mobile Skeleton loading component - compact style matching checkout-form
const MobileUpsaleCourseSkeleton = () => (
  <Box
    sx={{
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
    }}
  >
    <Skeleton
      variant='rectangular'
      height={92}
      width='100%'
    />
    <Stack
      sx={{
        gap: 0.5,
        p: 1.5,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Stack sx={{ gap: 0.5 }}>
        <Skeleton variant='text' height={18} width='100%' />
        <Skeleton variant='text' height={18} width='90%' />
        <Skeleton variant='text' height={22} width='70%' />
      </Stack>
      <Skeleton
        variant='rectangular'
        height={32}
        width='100%'
        sx={{ borderRadius: '4px' }}
      />
    </Stack>
  </Box>
);

// Desktop Skeleton loading component for upsale courses - moved outside to prevent recreation
const UpsaleCourseSkeleton = ({ isMobile }: { isMobile: boolean }) => (
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

// Mobile Upsale Course Card - compact horizontal scroll style matching checkout-form
const MobileUpsaleCourseCard = React.memo(
  ({
    course,
    isSelected,
    onAddToOrder,
    onRemove,
  }: {
    course: any;
    isSelected: boolean;
    onAddToOrder: (course: any) => void;
    onRemove: (id: string) => void;
  }) => {
    const t = useTranslations();
    const { title, image, price, actualPrice, id } = course;

    return (
      <Box
        sx={{
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Image
          width={165}
          height={92}
          src={image}
          alt={title}
          style={{
            objectFit: 'cover',
            aspectRatio: '16/9',
            width: '100%',
            borderRadius: '8px',
          }}
          priority={false}
          loading='lazy'
        />
        <Stack
          sx={{
            gap: 0.5,
            p: 1.5,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Stack sx={{ gap: 1 }}>
            <Typography
              variant='body2'
              sx={{
                fontSize: '14px',
                lineHeight: 1.3,
                display: '-webkit-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: '36px',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant='subtitle1'
              sx={{
                fontWeight: 500,
                fontSize: '16px',
              }}
            >
              {price}{' '}
              <Box
                component='span'
                sx={{
                  textDecoration: 'line-through',
                  color: '#757575',
                  fontSize: '14px',
                  fontWeight: 400,
                }}
              >
                {actualPrice}
              </Box>
            </Typography>
          </Stack>
          <CustomButton
            size='small'
            onClick={() => (isSelected ? onRemove(id) : onAddToOrder(course))}
            variant={isSelected ? 'outlined' : 'contained'}
            sx={{
              fontSize: '12px',
              fontWeight: 400,
              padding: '6px 12px',
              minHeight: '32px',
              ...(isSelected && {
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
              }),
            }}
          >
            {isSelected ? t('upsale.delete') : t('upsale.add_to_order')}
          </CustomButton>
        </Stack>
      </Box>
    );
  }
);

MobileUpsaleCourseCard.displayName = 'MobileUpsaleCourseCard';

// Desktop Upsale Course Card - moved outside and memoized to prevent unnecessary rerenders
const UpsaleCourseCard = React.memo(
  ({
    course,
    isSelected,
    isMobile,
    onAddToOrder,
    onRemove,
  }: {
    course: any;
    isSelected: boolean;
    isMobile: boolean;
    onAddToOrder: (course: any) => void;
    onRemove: (id: string) => void;
  }) => {
    const t = useTranslations();
    const { title, image, price, actualPrice, id } = course;

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
          priority={false}
          loading='lazy'
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
              mb: 1,
              height: '40px',
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
            onClick={() => (isSelected ? onRemove(id) : onAddToOrder(course))}
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
            {isSelected ? t('upsale.delete') : t('upsale.add_to_order')}
          </CustomButton>
        </Stack>
      </Box>
    );
  }
);

UpsaleCourseCard.displayName = 'UpsaleCourseCard';

const UpsaleCourses = ({
  courseData,
  currency,
  landingPageName,
}: {
  courseData?: any;
  currency?: any;
  landingPageName?: string;
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        py: { xs: 4, sm: 6 },
      }}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 1.5, sm: 3 } }}>
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
              {t('upsale.title')}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                fontWeight: 400,
                color: '#747474',
              }}
            >
              {t('upsale.description')}
            </Typography>
          </Stack>

          <Stack
            sx={{
              backgroundColor: '#F5F6FD',
              borderRadius: '16px',
              p: { xs: 1, sm: 3 },
            }}
            spacing={{ xs: 1 }}
          >
            {/* Available Upsale Courses */}
            <Box>
              {/* Desktop Navigation */}
              {!isMobile && (
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
                      display: showNavigation ? 'flex!important' : 'none!important',
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
              )}

              {/* Mobile View - Grid2 horizontal scroll like checkout-form */}
              {isMobile ? (
                <Grid2
                  container
                  spacing={{ xs: 1.5 }}
                  sx={{ flexWrap: 'nowrap', pb: 1, overflowX: 'auto' }}
                  className='custom-scrollbar'
                >
                  {isLoadingUpsales
                    ? // Show skeleton loading when loading
                      Array.from({ length: 3 }).map((_, index) => (
                        <Grid2 key={index} size={{ xs: 4 }} sx={{ minWidth: '160px' }}>
                          <MobileUpsaleCourseSkeleton />
                        </Grid2>
                      ))
                    : upsaleCourses?.length > 0
                      ? // Show actual courses when available
                        upsaleCourses?.map((course: any) => {
                          const isSelected = selectedUpsales.find(
                            (item: any) => item.id === course.id
                          );
                          return (
                            <Grid2 key={course.id} size={{ xs: 4 }} sx={{ minWidth: '160px' }}>
                              <MobileUpsaleCourseCard
                                course={course}
                                isSelected={!!isSelected}
                                onAddToOrder={handleAddToOrder}
                                onRemove={removeFromOrder}
                              />
                            </Grid2>
                          );
                        })
                      : null}
                </Grid2>
              ) : (
                // Desktop View - Swiper
                <Swiper
                  modules={[Navigation]}
                  slidesPerView={2}
                  spaceBetween={16}
                  style={{ width: '100%' }}
                  navigation={{
                    nextEl: '.upsale-courses-slider-swiper-button-next',
                    prevEl: '.upsale-courses-slider-swiper-button-prev',
                  }}
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
                          <Box pb={2}>
                            <UpsaleCourseSkeleton isMobile={isMobile} />
                          </Box>
                        </SwiperSlide>
                      ))
                    : upsaleCourses?.length > 0
                      ? // Show actual courses when available
                        upsaleCourses?.map((course: any) => {
                          const isSelected = selectedUpsales.find(
                            (item: any) => item.id === course.id
                          );
                          return (
                            <SwiperSlide key={course.id}>
                              <Box pb={2}>
                                <UpsaleCourseCard
                                  course={course}
                                  isSelected={!!isSelected}
                                  isMobile={isMobile}
                                  onAddToOrder={handleAddToOrder}
                                  onRemove={removeFromOrder}
                                />
                              </Box>
                            </SwiperSlide>
                          );
                        })
                      : null}
                </Swiper>
              )}
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
                    {t('upsale.no_need')}
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
                    {t('upsale.complete')}
                  </CustomButton>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Payment popups */}
      <SuccessPaymentPopup open={isPaymentSuccess} landingPageName={landingPageName}/>
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
