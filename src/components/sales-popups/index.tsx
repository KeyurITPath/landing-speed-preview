'use client';
import { useContext, useMemo } from 'react';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Fade,
  Stack,
} from '@mui/material';
import { useSelector } from 'react-redux';
import useSalesPopups from './useSalesPopups';
import { POPUPS_CATEGORIES } from '@/utils/constants';
import { AuthContext } from '@/context/auth-provider';

const Tab = ({ rank, value, children }: any) => {
  return (
    <Fade in={rank === value} timeout={500} unmountOnExit={true}>
      <Box hidden={rank !== value} sx={{ width: '100%', height: '100%' }}>
        <Stack sx={{ height: '100%' }}>{children}</Stack>
      </Box>
    </Fade>
  );
};

const SalesPopups = ({
  open,
  onClose,
  type = POPUPS_CATEGORIES.sales,
  rootHandleCancel,
  rootHandleSuccess,
  handleWarningSuccess,
  isMobile,
  monthlySubscriptionData,
  country_code
}: any) => {

  const { transformedData, activeTab, handleCancel, salesPopupsLoading } =
    useSalesPopups({
      rootHandleCancel,
      type,
      monthlySubscriptionData,
      country_code
    });

  const { user } = useContext(AuthContext);

  const { course, language } = useSelector((state: any) => state.defaults);

  const purchasePayload = useMemo(
    () => ({
      userId: user?.id,
      course_id: course?.id,
      language_id: language?.id,
      trial_days: 7,
    }),
    [course?.id, language?.id, user?.id]
  );

  return (
    <Dialog
      {...{ open: Boolean(open), onClose }}
      fullWidth={true}
      maxWidth='sm'
      scroll='body'
      PaperProps={{
        sx: {
          mx: { xs: '8px', sm: 4 },
          width: {
            xs: 'calc(100% - 16px)',
            sm: 'calc(100% - 64px)',
          },
          height: { xs: 'calc(100% - 16px)', sm: 'auto' },
          maxWidth: {
            xs: 'calc(100% - 16px) !important',
            sm: '600px !important',
          },
          borderRadius: '8px',
        },
      }}
      sx={{
        position: 'fixed',
        zIndex: 1300,
        inset: 0,
        '& .MuiDialog-container': {
          position: 'fixed',
          inset: 0,
          alignItems: 'center',
          justifyContent: 'center',
        },
        '& .MuiBackdrop-root': {
          position: 'fixed',
          inset: 0,
        },
      }}
      fullScreen={isMobile}
    >
      <DialogContent sx={{ p: 0, height: '100%' }}>
        {salesPopupsLoading ? (
          <Stack
            sx={{
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress size={50} />
          </Stack>
        ) : (
          <>
            {transformedData.map(
              ({ id, Component, rank, slug, ...props }: any) => {
                return (
                  <Tab key={id} {...{ rank }} value={activeTab}>
                    <Component
                      {...{
                        handleCancel,
                        rootHandleSuccess,
                        handleWarningSuccess,
                        purchasePayload,
                        slug,
                        monthlySubscriptionData,
                      }}
                      {...props}
                    />
                  </Tab>
                );
              }
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SalesPopups;
