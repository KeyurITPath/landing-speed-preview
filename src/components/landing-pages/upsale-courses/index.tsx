"use client";

import React from 'react';
import {
  Box,
  Button,
  Divider,
  Grid2,
  IconButton,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import CustomButton from '@shared/button';
import { ICONS } from '@assets/icons';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SuccessPaymentPopup from '../../success-payment-popup';
import FailedPaymentPopup from '../../failed-payment-popup';
import useUpsale from './useUpsale';

const UpsaleCourses = ({
  courseData,
  currency
}: {
  courseData?: any;
  currency?: any;
}) => {
  const t = useTranslations();

  // Use the custom hook
  const {
    selectedUpsales,
    loading,
    isPaymentSuccess,
    isPaymentFailed,
    upsaleCourses,
    totalPrice,
    handleAddToOrder,
    removeFromOrder,
    handleCheckout,
    handleDeclineUpsale,
  } = useUpsale(courseData, currency);

  // Selected course (the one user originally purchased) - get from props or API
  const selectedCourse = {
    id: courseData?.course?.id || courseData?.id || 'main-course',
    title: courseData?.course?.course_translations?.[0]?.title ||
           courseData?.course_translations?.[0]?.title ||
           courseData?.course_title ||
           '',
    price: courseData?.course?.course_prices?.[0] ?
      `${courseData.course.course_prices[0].currency?.name || '$'}${courseData.course.course_prices[0].price}` :
      '$19',
  };

  const UpsaleCourseCard = ({ course }: { course: any }) => {
    const { title, image, price, actualPrice, id } = course;
    const isSelected = selectedUpsales.find((item: any) => item.id === id);

    return (
      <Box
        sx={{
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Image
            width={200}
            height={120}
            src={image}
            alt={title}
            style={{
              objectFit: 'cover',
              aspectRatio: '16/9',
              width: '100%',
              height: '120px',
            }}
          />
        </Box>

        <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant='body2'
            sx={{
              fontWeight: 500,
              fontSize: '13px',
              lineHeight: 1.3,
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1,
              minHeight: '32px',
            }}
          >
            {title}
          </Typography>

          <Typography variant='subtitle2' sx={{ fontWeight: 600, fontSize: '14px', mb: 2 }}>
            {price}{' '}
            <Box
              component='span'
              sx={{
                textDecoration: 'line-through',
                color: '#757575',
                fontSize: '12px',
                fontWeight: 400,
              }}
            >
              {actualPrice}
            </Box>
          </Typography>

          <CustomButton
            size='small'
            onClick={() => handleAddToOrder(course)}
            disabled={isSelected}
            sx={{
              backgroundColor: isSelected ? '#e0e0e0' : undefined,
              color: isSelected ? '#666' : undefined,
              fontSize: '12px',
              py: 0.5,
              mt: 'auto',
            }}
          >
            {isSelected ? 'Added' : 'Add to order'}
          </CustomButton>
        </Box>
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
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3 }}>
        <Stack spacing={6}>
          {/* Header Section */}
          <Box sx={{ textAlign: 'left' }}>
            <Typography
              variant='h3'
              sx={{
                fontSize: { xs: '28px', md: '36px' },
                fontWeight: 700,
                color: '#0E0E0E',
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              Add a Hot Pick, Save Big!
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                color: '#666',
                lineHeight: 1.5,
                maxWidth: '600px',
              }}
            >
              Enhance your learning experience by adding these supplementary courses to the one you&apos;ve already purchased, and watch your
              progress accelerate to three times its previous pace.
            </Typography>
          </Box>

          {/* Selected Course Section */}
          <Box
            sx={{
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              p: 3,
              border: '1px solid #e9ecef',
            }}
          >
            <Stack sx={{ gap: 2 }}>
              <Typography
                variant='h6'
                sx={{ color: 'common.black', fontWeight: 600, mb: 2 }}
              >
                Your Selected Course
              </Typography>
              <Stack
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: 35,
                  gap: 2,
                }}
              >
                <Typography
                  variant='body1'
                  sx={{ color: 'common.black', fontWeight: 500 }}
                >
                  {selectedCourse.title}
                </Typography>
                <Typography
                  variant='body1'
                  sx={{ color: 'common.black', fontWeight: 500, textWrap: 'nowrap' }}
                >
                  {selectedCourse.price}
                </Typography>
              </Stack>

              {/* Selected Upsale Courses */}
              {selectedUpsales.map(({ title, price, id }: { title: string; price: string; id: string }) => (
                <Stack
                  key={id}
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    py: 1,
                    borderTop: '1px solid #e9ecef',
                  }}
                >
                  <Typography
                    variant='body1'
                    sx={{ color: 'common.black', fontWeight: 500 }}
                  >
                    {title}
                  </Typography>
                  <Stack
                    sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5 }}
                  >
                    <Typography
                      variant='body1'
                      sx={{
                        color: 'common.black',
                        fontWeight: 500,
                        textWrap: 'nowrap',
                      }}
                    >
                      {price}
                    </Typography>
                    <IconButton
                      size='small'
                      sx={{ color: '#BFBFBF', fontSize: 25, mr: -1 }}
                      onClick={() => removeFromOrder(id)}
                    >
                      <ICONS.CloseCircleOutline />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* Available Upsale Courses */}
          <Box>
            <Typography
              variant='h5'
              sx={{ color: 'common.black', fontWeight: 600, mb: 3 }}
            >
              Add These Premium Courses
            </Typography>
            <Grid2 container spacing={2}>
              {upsaleCourses.map((course: any) => (
                  <Grid2 key={course.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <UpsaleCourseCard course={course} />
                </Grid2>
              ))}
            </Grid2>
          </Box>

          {/* Total and Checkout Section */}
          <Box
            sx={{
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              p: 3,
              border: '1px solid #e9ecef',
            }}
          >
            <Stack sx={{ gap: 3 }}>
              <Typography
                variant='h6'
                sx={{ color: 'common.black', fontWeight: 600, textAlign: 'right' }}
              >
                Total: {totalPrice}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <CustomButton
                  fullWidth
                  sx={{ textTransform: 'capitalize' }}
                  color='secondary'
                  onClick={handleDeclineUpsale}
                >
                  NO, I DON&apos;T NEED THIS
                </CustomButton>
                <CustomButton
                  fullWidth
                  sx={{ textTransform: 'capitalize' }}
                  loading={loading}
                  onClick={handleCheckout}
                >
                  COMPLETE
                </CustomButton>
              </Stack>

              {/* Footer Section */}
              {/* <Stack sx={{ gap: 1, textAlign: 'center' }}>
                <Typography
                  variant='body2'
                  sx={{ color: 'common.black', fontSize: '14px' }}
                >
                  Sign up today - start instantly and lock in the lowest price.
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ color: 'common.black', fontSize: '14px' }}
                >
                  14 days money back guarantee: If the course isn&apos;t what you expected, request a full refund within 14 days - no questions asked. Just email us at{' '}
                  <Box
                    component='span'
                    sx={{
                      color: '#1976d2',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    hello@eduelle.com
                  </Box>
                  .
                </Typography>
              </Stack> */}
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Payment popups */}
      <SuccessPaymentPopup open={isPaymentSuccess} />
      <FailedPaymentPopup open={isPaymentFailed} />
    </Box>
  );
};

export default UpsaleCourses;
