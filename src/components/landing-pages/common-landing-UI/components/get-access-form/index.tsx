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
// import { gtm } from '@/assets/utils/gtm';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { isEmptyObject } from '@/utils/helper';
import { useTranslations, useMessages } from 'next-intl';
import { pixel } from '@/utils/pixel';

const GetAccessForm = ({ open, onClose, landingData, ...props }: any) => {
  const { data, course, activeForm, setActiveForm, SUPPORT_MAIL, utmData } =
    landingData;
  const queryParams = useSearchParams();
  const { upSaleCourses } = useSelector(({ course }: any) => course);


  const isCourseUpsaleCoursesAvailable = useMemo(() => {
    return Boolean(upSaleCourses?.length > 0);
  }, [upSaleCourses?.length]);

  const t = useTranslations();

     useEffect(() => {
          if (open && activeForm === 'access-form') {
              // gtm.ecommerce.open_cart();
              pixel.add_to_cart({
                  content_ids: [],
                  ...(!isEmptyObject(utmData) ? { utmData } : {})
              });
          }
      }, [activeForm, open, utmData]);

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
              }}
              landingData={data}
              courseData={course}
              utm_source={queryParams?.get('utm_source')}
            />
          ) : (
            <CheckoutForm
              {...{ setActiveForm, queryParams, utmData }}
              landingData={data}
              courseData={course}
            />
          )}

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
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default GetAccessForm;
