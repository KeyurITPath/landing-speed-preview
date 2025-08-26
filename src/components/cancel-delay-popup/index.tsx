import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CourseCard from '../dashboard-card';
import { useMemo } from 'react';
import CustomButton from '@/shared/button';
import { useTranslations } from 'next-intl';
import { ICONS } from '@/assets/icons';

const CancelDelayPopup = ({
  open,
  onClose,
  data,
  isLoading,
  cancelDelayBtnLoading,
  onClickCancelDelay,
}: any) => {
  const {
    course_activation_message,
    contact_support_message,
    cancelDelayCourseData: COURSES_DATA,
    isMobile,
    isBecomeAMemberWithVerified,
    handleStartFree = () => {},
  } = data || {};

  const dashboardData = useMemo(() => {
    return {
      isMobile,
      isBecomeAMemberWithVerified,
      handleStartFree,
    };
  }, [handleStartFree, isBecomeAMemberWithVerified, isMobile]);

  const t = useTranslations();

  return (
    <Dialog
      {...{ open: Boolean(open), onClose }}
      fullWidth={true}
      maxWidth='md'
      scroll='body'
      PaperProps={{
        sx: {
          mx: { xs: 1.5, sm: 4 },
          width: {
            xs: 'calc(100% - 24px)',
            sm: 'calc(100% - 64px)',
          },
          maxWidth: {
            xs: 'calc(100% - 24px) !important',
            sm: '700px !important',
          },

          maxHeight: { xs: 'calc(100% - 16px)', sm: 'none' },
        },
      }}
      fullScreen={isMobile}
    >
      <DialogContent sx={{ p: 0 }}>
        {isLoading ? (
          <Stack
            sx={{
              p: { xs: 3, sm: 4 },
              gap: { xs: 2, sm: 3 },
              flex: 1,
              justifyContent: 'space-between',
              overflow: 'auto',
              height: '100%',
            }}
          >
            <CircularProgress size={50} />
          </Stack>
        ) : (
          <Stack
            sx={{
              p: { xs: 3, sm: 4 },
              gap: { xs: 2 },
              flex: 1,
              justifyContent: 'space-between',
            }}
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
                zIndex: 1,
              }}
            >
              <ICONS.CLOSE />
            </IconButton>

            <Typography
              variant='body1'
              dangerouslySetInnerHTML={{
                __html: course_activation_message || '',
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            />
            <Box sx={{ width: '100%' }}>
              <CourseCard
                {...{
                  dashboardData,
                  progress: false,
                  COURSES_DATA,
                  isLoading,
                  navigation: false,
                  breakpoints: {
                    0: {
                      slidesPerView: 1.3,
                    },
                    600: {
                      slidesPerView: 3,
                    },
                  },
                }}
              />
            </Box>
            <Typography
              variant='body1'
              dangerouslySetInnerHTML={{
                __html: contact_support_message || '',
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            />

            <CustomButton
              {...{ cancelDelayBtnLoading }}
              sx={{ textTransform: 'capitalize' }}
              variant='gradient'
              onClick={onClickCancelDelay}
            >
              {t('validation_okay_button')}
            </CustomButton>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CancelDelayPopup;
