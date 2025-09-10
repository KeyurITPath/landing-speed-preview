import { useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { ICONS } from '@/assets/icons';
import OpenAccessForm from './components/open-access-form';
import { isEmptyObject } from '@/utils/helper';
import { useSearchParams } from 'next/navigation';
import { pixel } from '@/utils/pixel';
import { gtm } from '@/utils/gtm';

const GetAccessForm = ({
  open,
  onClose,
  course,
  activeForm,
  setActiveForm,
  activeLandingPage,
  domainName,
  utmData,
  ...props
}: any) => {
  const queryParams = useSearchParams();

  useEffect(() => {
    if (open && activeForm === 'access-form') {
      gtm.ecommerce.open_cart();
      pixel.add_to_cart({
        content_ids: [course?.id],
        content_type: 'course',
        ...(course.course_prices?.[0]?.currency?.name
          ? { currency: course.course_prices?.[0]?.currency?.name }
          : {}),
        ...(course.course_prices?.[0]?.price
          ? { value: course.course_prices?.[0]?.price }
          : {}),
        ...(course.course_prices?.[0]?.price
          ? { total_amount: course.course_prices?.[0]?.price }
          : {}),
        contents: [
          {
            id: course?.id,
            quantity: 1,
            item_price: course.course_prices?.[0]?.price,
          },
        ],
        ...(!isEmptyObject(utmData) ? { utmData } : {}),
      });
    }
  }, [activeForm, open, utmData, course]);

  return (
    <Dialog
      {...{ open: Boolean(open), onClose }}
      scroll='body'
      fullWidth={true}
      maxWidth='sm'
      PaperProps={{
        sx: {
          borderRadius: 2,
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
          right: 5,
          color: 'black',
          fontSize: 24,
        }}
      >
        <ICONS.CLOSE />
      </IconButton>
      <DialogContent sx={{ px: { xs: 3, sm: 5 }, py: 5, bgcolor: 'white' }}>
        <Stack sx={{ gap: { xs: 2, sm: 4 } }}>
          {Boolean(activeForm === 'access-form') && (
            <OpenAccessForm
              {...{
                setActiveForm,
                queryParams,
                activeLandingPage,
                domainName,
                utmData,
              }}
              courseData={course}
              utm_source={queryParams?.get('utm_source')}
            />
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default GetAccessForm;
