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
// import { gtm } from '../../../../../assets/utils/gtm';
import { isEmptyObject } from '@/utils/helper';
import { useSearchParams } from 'next/navigation';
import { pixel } from '@/utils/pixel';

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

  console.log('open', open, activeForm)

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
