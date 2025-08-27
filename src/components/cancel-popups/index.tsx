import { useMemo } from 'react';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Fade,
  Stack,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { POPUPS_CATEGORIES } from '@/utils/constants';
import useCancelPopups from './use-cancel-popup';

const Tab = ({ rank, value, children }: any) => {
  return (
    <Fade in={rank === value} timeout={500} unmountOnExit={true}>
      <Box hidden={rank !== value} sx={{ width: '100%', height: '100%' }}>
        <Stack sx={{ height: '100%' }}>{children}</Stack>
      </Box>
    </Fade>
  );
};

const CancelPopups = ({
  open,
  onClose,
  type = POPUPS_CATEGORIES.cancel,
  rootHandleCancel,
  rootHandleSuccess,
  handleWarningSuccess,
  isMobile,
  handleSaveFeedbackFormData,
  saveFeedBackFormData,
  resetCancelPopup,
  setResetCancelPopup,
  onCancelPopupCancelLoading,
}: any) => {
  const {
    transformedData,
    activeTab,
    handleCancel,
    setActiveTab,
    cancelPopupsLoading,
    handleGoBack,
  } = useCancelPopups({
    rootHandleCancel,
    type,
    resetCancelPopup,
    setResetCancelPopup,
  });

  const { user } = useSelector(({ auth }: any) => auth);
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
      {...{
        open: Boolean(open),
        onClose: e => {
          onClose(e);
          setActiveTab(1);
        },
      }}
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
        '& .MuiPaper-root': { overflowX: 'hidden' },
      }}
      fullScreen={isMobile}
    >
      <DialogContent sx={{ p: 0, height: '100%' }}>
        {cancelPopupsLoading ? (
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
                        handleSaveFeedbackFormData,
                        saveFeedBackFormData,
                        handleGoBack,
                        onCancelPopupCancelLoading,
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

export default CancelPopups;
