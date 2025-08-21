import { Box, Typography } from '@mui/material';
import CustomModal from '@/shared/modal';

const ConfirmationPopup = ({
    open,
    onClose,
    loading,
    handleSubmit,
    modelTitle,
    confirmationText,
    actionLabel,
    isShowCloseIcon = false,
    isShowCloseButton,
    maxWidth,
    ...props
}: any) => {
    return (
        <CustomModal
            title={modelTitle}
            handleAction={handleSubmit}
            handleClose={onClose}
            withAction
            {...{
                open,
                loading,
                fullWidth: true,
                maxWidth,
                actionLabel: actionLabel ? actionLabel : 'Confirm',
                isShowCloseIcon,
                isShowCloseButton,
                ...props
            }}
        >
            <Box sx={{ width: '100%', mb: 1.2 }}>
                <Typography variant="body2" color="#969594" textAlign={'center'}>
                    {confirmationText}
                </Typography>
            </Box>
        </CustomModal>
    );
};

export default ConfirmationPopup;
