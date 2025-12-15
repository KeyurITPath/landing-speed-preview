'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Divider,
  Grid2,
  Stack,
  Typography,
  useMediaQuery,
  Avatar,
  Rating,
} from '@mui/material';
import CustomButton from '@shared/button';
import { ICONS } from '@assets/icons';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import useBundles from './useBundles';
import { Skeleton } from '@mui/material';
import SuccessPaymentPopup from '../../success-payment-popup';
import FailedPaymentPopup from '../../failed-payment-popup';
import BundlesPaymentErrorPopup from './bundles-payment-error-popup';

// Mobile Skeleton loading component
const MobileBundleCourseSkeleton = () => (
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
    <Skeleton variant='rectangular' height={92} width='100%' />
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
      </Stack>
      <Stack
        direction='row'
        alignItems='center'
        spacing={1}
        sx={{ mt: 'auto' }}
      >
        <Skeleton variant='circular' width={20} height={20} />
        <Skeleton variant='text' height={14} width='60px' />
        <Box sx={{ ml: 'auto' }}>
          <Skeleton variant='text' height={14} width='30px' />
        </Box>
      </Stack>
    </Stack>
  </Box>
);

// Desktop Skeleton loading component
const BundleCourseSkeleton = ({ isMobile }: { isMobile: boolean }) => (
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
      <Stack
        direction='row'
        alignItems='center'
        spacing={1}
        sx={{ mt: 'auto' }}
      >
        <Skeleton variant='circular' width={30} height={30} />
        <Skeleton variant='text' height={20} width='100px' />
        <Box sx={{ ml: 'auto' }}>
          <Skeleton variant='text' height={20} width='40px' />
        </Box>
      </Stack>
    </Stack>
  </Box>
);

// Plus Icon Component
const PlusIcon = ({ isMobile }: { isMobile: boolean }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isMobile ? '14px' : '20px',
      height: isMobile ? '14px' : '20px',
      borderRadius: '50%',
      backgroundColor: '#49AE56',
      color: '#FFFFFF',
      flexShrink: 0,
      '& svg': {
        fontSize: isMobile ? '12px' : '18px',
      },
    }}
  >
    <ICONS.PLUS />
  </Box>
);

// Mobile Bundle Course Card - matching upsale mobile card style
const MobileBundleCourseCard = React.memo(({ course }: { course: any }) => {
  const { title, image, instructor, rating } = course;
  const { avatar, name } = instructor || {};

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
        height={130}
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
          gap: 1.5,
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
              fontWeight: 500,
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              color: '#0E0E0E',
              height: 40,
              lineHeight: 1.4,
            }}
          >
            {title}
          </Typography>
        </Stack>
        <Stack
          direction='row'
          alignItems='center'
          width='100%'
          spacing={1}
          sx={{ overflow: 'hidden' }}
        >
          <Avatar
            alt={name}
            src={avatar}
            sx={{
              height: 30,
              width: 30,
              flexShrink: 0,
            }}
          />
          <Stack
            direction='column'
            alignItems='flex-start'
            sx={{ flex: 1, minWidth: 0 }}
          >
            <Typography
              variant='caption'
              sx={{
                fontSize: '12px',
                color: '#0E0E0E',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
                maxWidth: '100%',
              }}
            >
              {name}
            </Typography>
            <Stack direction='row' alignItems='center' spacing={0.5}>
              <Rating
                name='read-only'
                value={1}
                max={1}
                readOnly
                sx={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#FFC11E',
                  mb: '3px !important',
                  '& .MuiRating-icon': {
                    color: '#FFC11E',
                  },
                }}
              />
              <Typography
                variant='caption'
                fontWeight={500}
                sx={{
                  fontSize: '12px',
                  color: '#0E0E0E',
                }}
              >
                {rating}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
});

MobileBundleCourseCard.displayName = 'MobileBundleCourseCard';

// Desktop Bundle Course Card
const BundleCourseCard = React.memo(
  ({ course, isMobile }: { course: any; isMobile: boolean }) => {
    const { title, image, instructor, rating } = course;
    const { avatar, name } = instructor || {};

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
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
              color: '#0E0E0E',
              minHeight: '36px',
            }}
          >
            {title}
          </Typography>

          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            width='100%'
          >
            <Stack direction='row' alignItems='center' spacing={1}>
              <Avatar
                alt={name}
                src={avatar}
                sx={{
                  height: { xs: 20, sm: 30 },
                  width: { xs: 20, sm: 30 },
                  flexShrink: 0,
                }}
              />
              <Typography
                variant='caption'
                sx={{
                  fontSize: { xs: '12px' },
                  color: '#0E0E0E',
                  height: '50px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {name}
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' spacing={0.5}>
              <Rating
                name='read-only'
                value={1}
                max={1}
                readOnly
                sx={{
                  fontSize: '16px',
                  color: '#FFC11E',
                  mb: '3px !important',
                  '& .MuiRating-icon': {
                    color: '#FFC11E',
                  },
                }}
              />
              <Typography
                variant='caption'
                fontWeight={500}
                sx={{
                  fontSize: { xs: '12px' },
                  color: '#0E0E0E',
                }}
              >
                {rating}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    );
  }
);

BundleCourseCard.displayName = 'BundleCourseCard';

const Bundles = ({
  courseData,
  currency,
  landingPageName,
}: {
  courseData?: any;
  currency?: any;
  landingPageName?: string | null;
}) => {
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));
  const t = useTranslations();

  const {
    bundleCourses,
    isLoadingBundles,
    bundlePricing,
    loading,
    isPaymentSuccess,
    isPaymentFailed,
    showPaymentError,
    paymentErrorMessage,
    handleCheckout,
    handleDeclineBundle,
    handleClosePaymentError,
  } = useBundles(courseData, currency, landingPageName);

  const { originalPrice, discountPrice, discountPercentage } = bundlePricing;

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        py: { xs: 4, sm: 6 },
        px: { xs: 0.5, sm: 1 },
      }}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 1.5, sm: 3 } }}>
        <Stack spacing={{ xs: 3, sm: 4 }}>
          <Stack gap={2}>
            <Typography
              variant='h3'
              sx={{
                fontSize: { xs: '24px', md: '28px' },
                fontWeight: 600,
              }}
            >
              {t('bundles.title')}
            </Typography>
            {isLoadingBundles ? (
              <Box>
                <Skeleton
                  variant='text'
                  height={20}
                  width='100%'
                  sx={{ mb: 0.5 }}
                />
                <Skeleton
                  variant='text'
                  height={20}
                  width='95%'
                  sx={{ mb: 0.5 }}
                />
                <Skeleton variant='text' height={20} width='90%' />
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: { xs: '14px', md: '16px' },
                  fontWeight: 400,
                  color: '#747474',
                  lineHeight: 1.5,
                }}
              >
                {t.rich('bundles.description', {
                  originalPrice: originalPrice,
                  discountPercentage: discountPercentage,
                  discountPrice: discountPrice,
                  courseCount: bundleCourses?.length || 3,
                  originalPriceTag: (chunks: any) => (
                    <Box
                      component='span'
                      key='originalPrice'
                      sx={{
                        textDecoration: 'line-through',
                        color: '#000000',
                      }}
                    >
                      {chunks}
                    </Box>
                  ),
                  discountPercentageTag: (chunks: any) => (
                    <Box
                      component='span'
                      key='discountPercentage'
                      sx={{
                        fontWeight: 700,
                        color: '#304BE0',
                      }}
                    >
                      {chunks}
                    </Box>
                  ),
                  discountPriceTag: (chunks: any) => (
                    <Box
                      component='span'
                      key='discountPrice'
                      sx={{
                        fontWeight: 700,
                        color: '#304BE0',
                      }}
                    >
                      {chunks}
                    </Box>
                  ),
                  courseCountTag: (chunks: any) => (
                    <Box
                      component='span'
                      key='courseCount'
                      sx={{
                        fontWeight: 500,
                        color: '#0E0E0E',
                      }}
                    >
                      {chunks}
                    </Box>
                  ),
                })}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>
      <Box
        sx={{
          backgroundColor: '#F5F5F5',
          borderRadius: { xs: 0, md: '16px' },
          my: { xs: 3 },
          mx: { xs: 0, md: 'auto' },
          maxWidth: { xs: '100%', md: '1200px' },
        }}
      >
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            px: { xs: 1, sm: 3 },
            py: { xs: 3, sm: 4 },
          }}
        >
          <Stack spacing={{ xs: 3, sm: 4 }}>
            <Box>
              {isMobile ? (
                <Box
                  sx={{
                    position: 'relative',
                    minHeight: '220px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'nowrap',
                      gap: 0.5,
                      pb: 1,
                      overflowX: 'auto',
                    }}
                    className='custom-scrollbar'
                  >
                    {isLoadingBundles
                      ? Array.from({ length: 3 }).map((_, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: {
                                xs: 'calc((100% - 8px) / 2)',
                                sm: 'calc((100% - 24px) / 3)',
                              },
                              flexShrink: 0,
                            }}
                          >
                            <MobileBundleCourseSkeleton />
                          </Box>
                        ))
                      : bundleCourses?.length > 0
                        ? bundleCourses.map((course: any, index: number) => (
                            <React.Fragment key={course.id}>
                              <Box
                                sx={{
                                  width: {
                                    xs: 'calc((100% - 16px) / 2)',
                                    sm: 'calc((100% - 36px) / 3)',
                                  },
                                  flexShrink: 0,
                                }}
                              >
                                <MobileBundleCourseCard course={course} />
                              </Box>
                              {index < bundleCourses.length - 1 && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    width: '8px',
                                    pointerEvents: 'none',
                                  }}
                                >
                                  <PlusIcon isMobile={isMobile} />
                                </Box>
                              )}
                            </React.Fragment>
                          ))
                        : null}
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    position: 'relative',
                    minHeight: '300px',
                    display: 'block',
                  }}
                >
                  {isLoadingBundles ? (
                    <Grid2 container spacing={{ xs: 1, sm: 2 }}>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                          <BundleCourseSkeleton isMobile={false} />
                        </Grid2>
                      ))}
                    </Grid2>
                  ) : bundleCourses?.length > 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'stretch',
                        justifyContent: 'center',
                        gap: { xs: 1 },
                        flexWrap: 'nowrap',
                      }}
                    >
                      {bundleCourses.map((course: any, index: number) => (
                        <React.Fragment key={course.id}>
                          <Box
                            sx={{
                              flex: '0 1 auto',
                              minWidth: '280px',
                              maxWidth: '350px',
                              width: '100%',
                            }}
                          >
                            <BundleCourseCard
                              course={course}
                              isMobile={false}
                            />
                          </Box>
                          {index < bundleCourses.length - 1 && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                pointerEvents: 'none',
                              }}
                            >
                              <PlusIcon isMobile={false} />
                            </Box>
                          )}
                        </React.Fragment>
                      ))}
                    </Box>
                  ) : null}
                </Box>
              )}
            </Box>

            {isLoadingBundles ? (
              <Stack
                spacing={1}
                alignItems='center'
                sx={{ pt: { xs: 2, sm: 3 } }}
              >
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing={1}
                  justifyContent='center'
                >
                  <Skeleton variant='text' width={80} height={24} />
                  <Skeleton variant='text' width={100} height={24} />
                </Stack>
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing={1}
                  justifyContent='center'
                >
                  <Skeleton variant='text' width={100} height={32} />
                  <Skeleton variant='text' width={120} height={32} />
                </Stack>
              </Stack>
            ) : (
              bundleCourses?.length > 0 && (
                <Stack spacing={1} alignItems='center'>
                  <Stack
                    direction='row'
                    alignItems='center'
                    spacing={0.5}
                    flexWrap='wrap'
                    justifyContent='center'
                  >
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#747474',
                        textDecoration: 'line-through',
                      }}
                    >
                      {originalPrice}
                    </Typography>
                    <Box
                      component='span'
                      sx={{
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        component='span'
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#304BE0',
                        }}
                      >
                        {discountPercentage}
                      </Typography>
                      <Typography
                        component='span'
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#0E0E0E',
                        }}
                      >
                        {t('bundles.discount')}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack
                    direction='row'
                    alignItems='center'
                    spacing={0.5}
                    flexWrap='wrap'
                    justifyContent='center'
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '20px', md: '22px' },
                        fontWeight: 700,
                        color: '#304BE0',
                      }}
                    >
                      {discountPrice}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: '20px', md: '22px' },
                        fontWeight: 500,
                        color: '#0E0E0E',
                      }}
                    >
                      {t('bundles.for_courses', {
                        count: bundleCourses?.length,
                      })}
                    </Typography>
                  </Stack>
                </Stack>
              )
            )}

            <Stack spacing={{ xs: 2, sm: 3 }}>
              <Divider sx={{ borderColor: '#dfdfdf' }} />
              <Stack spacing={{ xs: 2, sm: 3 }} alignItems='center'>
                <CustomButton
                  {...{ loading, disabled: loading || !bundleCourses?.length }}
                  onClick={handleCheckout}
                  variant='contained'
                  size='medium'
                  sx={{
                    fontSize: { sm: '16px', md: '18px' },
                    fontWeight: 400,
                    color: '#FFFFFF',
                    backgroundColor: '#49AE56',
                    maxWidth: { xs: 350, sm: 400, md: 500 },
                    borderRadius: '35px',
                    textTransform: 'none',
                    p: { xs: '12px 16px', md: '14px 28px' },
                    '&:hover': {
                      backgroundColor: '#3d8e47',
                    },
                  }}
                >
                  {t('bundles.confirm_and_add_to_order')}
                </CustomButton>
                <Typography
                  component='button'
                  onClick={handleDeclineBundle}
                  disabled={loading || !bundleCourses?.length}
                  sx={{
                    fontSize: { xs: '14px', sm: '16px' },
                    fontWeight: 400,
                    color: '#0E0E0E',
                    textDecoration: 'underline',
                    textTransform: 'none',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    margin: '0 auto',
                    display: 'block',
                    '&:hover': {
                      opacity: 0.7,
                    },
                    '&:disabled': {
                      cursor: 'not-allowed',
                      opacity: 0.5,
                      pointerEvents: 'none',
                    },
                  }}
                >
                  {t('bundles.no_i_dont_need_this')}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>

      <SuccessPaymentPopup
        open={isPaymentSuccess}
        landingPageName={landingPageName}
      />
      <FailedPaymentPopup open={isPaymentFailed} />

      <BundlesPaymentErrorPopup
        open={showPaymentError}
        errorMessage={paymentErrorMessage}
        onClose={handleClosePaymentError}
      />
    </Box>
  );
};

export default Bundles;
