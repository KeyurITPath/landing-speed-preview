import { useEffect, useMemo } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { ICONS } from '@/assets/icons';
import OpenAccessForm from './components/open-access-form';
import CheckoutForm from './components/checkout-form';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { isEmptyObject } from '@/utils/helper';
import { useTranslations } from 'next-intl';
import { pixel } from '@/utils/pixel';
import { gtm } from '@/utils/gtm';
import {
  generateConversionId,
  trackAddToCart,
  trackContentView,
  TWITTER_EVENTS,
} from '../../../../../utils/pixel/twitter';

const GetAccessForm = ({ open, onClose, landingData, ...props }: any) => {
  const {
    data,
    course,
    activeForm,
    setActiveForm,
    SUPPORT_MAIL,
    utmData,
    activeLandingPage,
  } = landingData;
  const queryParams = useSearchParams();
  const { upSaleCourses } = useSelector(({ course }: any) => course);

  const isCourseUpsaleCoursesAvailable = useMemo(() => {
    return Boolean(upSaleCourses?.length > 0);
  }, [upSaleCourses?.length]);

  const t = useTranslations();
  const conversion_id = generateConversionId('cart');

  useEffect(() => {
    if (open && activeForm === 'access-form') {
      gtm.ecommerce.open_cart();
      trackAddToCart({
        conversion_id: conversion_id,
        content_ids: [landingData.course?.id],
        content_type: 'course',
        ...(landingData?.course.course_prices?.[0]?.currency?.name
          ? { currency: landingData?.course.course_prices?.[0]?.currency?.name }
          : { currency: 'USD' }),
        ...(landingData?.course.course_prices?.[0]?.price
          ? { value: landingData?.course.course_prices?.[0]?.price }
          : { value: 0 }),
        ...(landingData?.course.course_prices?.[0]?.price
          ? { total_amount: landingData?.course.course_prices?.[0]?.price }
          : { total_amount: 0 }),
        contents: [
          {
            id: course?.id,
            quantity: 1,
            item_price: landingData?.course.course_prices?.[0]?.price,
          },
        ],
        ...(!isEmptyObject(utmData) ? { utmData } : {}),
      });
      pixel.add_to_cart({
        conversion_id: conversion_id,
        twitter_event_id: TWITTER_EVENTS.add_to_cart,
        content_ids: [landingData.course?.id],
        content_type: 'course',
        ...(landingData?.course.course_prices?.[0]?.currency?.name
          ? { currency: landingData?.course.course_prices?.[0]?.currency?.name }
          : { currency: 'USD' }),
        ...(landingData?.course.course_prices?.[0]?.price
          ? { value: landingData?.course.course_prices?.[0]?.price }
          : { value: 0 }),
        ...(landingData?.course.course_prices?.[0]?.price
          ? { total_amount: landingData?.course.course_prices?.[0]?.price }
          : { total_amount: 0 }),
        contents: [
          {
            id: course?.id,
            quantity: 1,
            item_price: landingData?.course.course_prices?.[0]?.price,
          },
        ],
        ...(!isEmptyObject(utmData) ? { utmData } : {}),
      });
    }
  }, [
    activeForm,
    conversion_id,
    course?.id,
    landingData.course,
    open,
    utmData,
  ]);

  return (
    <Dialog
      {...{ open: Boolean(open), onClose }}
      scroll='body'
      fullWidth={true}
      maxWidth='sm'
      PaperProps={{
        sx: {
          borderRadius: 0,
          m: { xs: 0, sm: '50px' },
          width: { xs: '100%', sm: 'calc(100% - 100px)' },
          maxWidth: { xs: '100% !important', sm: '600px !important' },
          position: 'relative',
        },
      }}
      sx={{ bgcolor: 'common.black' }}
      {...props}
    >
      <IconButton
        aria-label='Close'
        onClick={onClose}
        size='small'
        sx={{
          position: 'absolute',
          top: 2,
          right: 2,
          color: 'black',
          fontSize: 24,
        }}
      >
        <ICONS.CLOSE />
      </IconButton>
      <DialogContent sx={{ px: { xs: 3, sm: 5 }, py: 5, bgcolor: 'white' }}>
        <Stack sx={{ gap: { xs: 2, sm: 4 } }}>
          {activeForm === 'access-form' ? (
            <OpenAccessForm
              {...{
                setActiveForm,
                queryParams,
                isCourseUpsaleCoursesAvailable,
                utmData,
                activeLandingPage,
              }}
              landingData={data}
              courseData={course}
              utm_source={queryParams?.get('utm_source')}
            />
          ) : activeForm === 'checkout-form' ? (
            <CheckoutForm
              {...{ setActiveForm, queryParams, utmData, activeLandingPage }}
              landingData={data}
              courseData={course}
            />
          ) : null}

          {(activeForm === 'access-form' || activeForm === 'checkout-form') && (
            <>
              <Typography variant='body2' sx={{ color: 'common.black' }}>
                {t.rich('start_practicing', {
                  strong: chunks => (
                    <Box component='span' sx={{ fontWeight: 500 }}>
                      {chunks}
                    </Box>
                  ),
                })}
              </Typography>
              <Typography variant='body2' sx={{ color: 'common.black' }}>
                {t.rich('money_back_guarantee', {
                  support_email: SUPPORT_MAIL,
                  strong: chunks => (
                    <Box component='span' sx={{ fontWeight: 500 }}>
                      {chunks}
                    </Box>
                  ),
                  email: chunks => (
                    <Link
                      href={`mailto:${SUPPORT_MAIL}`}
                      underline='hover'
                      sx={{ color: '#2588e4' }}
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </Typography>
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default GetAccessForm;
