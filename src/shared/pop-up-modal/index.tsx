import { CircularProgress, Dialog, DialogContent, Stack, Typography } from '@mui/material';
import CustomButton from '../button';

const PopUpModal = ({
    open,
    onClose,
    message = '',
    successButton = {},
    icon: Icon,
    type = '',
    loading = false,
    ...props
}: any) => {
    const isError = type === 'error';
    return (
        <Dialog
            {...{ open: Boolean(open), onClose }}
            scroll="body"
            fullWidth={true}
            maxWidth="xs"
            PaperProps={{
                sx: {
                    borderRadius: 1
                }
            }}
            {...props}
        >
            <DialogContent sx={{ px: 8, py: 4, bgcolor: 'white' }}>
                {loading ? (
                    <Stack
                        sx={{
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <CircularProgress size={50} />
                    </Stack>
                ) : (
                    <Stack sx={{ gap: 3.5, alignItems: 'center' }}>
                        {Icon && (
                            <Stack
                                sx={{
                                    color: isError ? 'error.main' : 'primary.main',
                                    fontSize: 60
                                }}
                            >
                                <Icon />
                            </Stack>
                        )}
                        {typeof message === 'string' ? (
                            <Typography variant="h5" sx={{ textAlign: 'center' }}>
                                {message}
                            </Typography>
                        ) : (
                            message
                        )}
                        <CustomButton
                            color={isError ? 'error' : 'primary'}
                            onClick={successButton.onClick}
                            sx={{ width: '100%', maxWidth: '200px' }}
                        >
                            {successButton.text}
                        </CustomButton>
                    </Stack>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PopUpModal;
