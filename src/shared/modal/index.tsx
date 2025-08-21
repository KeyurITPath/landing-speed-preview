"use client"
import { useCallback } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    useTheme
} from '@mui/material';
import { ICONS } from '../../assets/icons';
import CustomButton from '../button';

const CustomModal = ({
    sx,
    open,
    handleClose,
    loading,
    renderAction,
    title,
    children,
    withAction,
    isShowCloseIcon = false,
    withIcon = false,
    actionLabel,
    handleAction,
    handleClickOutside = false,
    titleSx,
    closeLabel,
    isShowCloseIconBorder,
    isShowCloseButton = true,
    disabled,
    maxWidth = 'sm',
    fullWidth = true,
    ...props
}: any) => {

    const theme = useTheme();

    const onClose = useCallback(() => {
        if (!isShowCloseIcon || isShowCloseButton) return handleClose();
        if (withIcon) return handleClose();
        if (handleClickOutside) return handleClose();
    }, [handleClickOutside, handleClose, isShowCloseButton, isShowCloseIcon, withIcon]);

    return (
        <Dialog
            sx={{
                ...sx,
                '& .MuiDialog-paper': {
                    borderRadius: '10px'
                }
            }}
            {...{ open: Boolean(open), onClose, maxWidth, fullWidth }}
            {...props}
        >
            {isShowCloseIcon ? (
                <IconButton
                    size="small"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: '17px',
                        top: '22px'
                    }}
                >
                    <ICONS.Close sx={{ color: '#304BE0', fontWeight: 600 }} />
                </IconButton>
            ) : null}
            {title ? (
                <DialogTitle sx={{ ...titleSx, px: 3, pb: 3, pt: 3 }}>
                    <Typography
                        sx={{
                             fontFamily: "'Rubik', sans-serif",
            fontWeight: 700,
            lineHeight: 1.2,
                            textAlign: 'center',
                            color: '#304BE0',
                             [theme.breakpoints.up('xs')]: {
                fontSize: '1.3rem'
            },
            [theme.breakpoints.up('sm')]: {
                fontSize: '1.4rem'
            },
            [theme.breakpoints.up('md')]: {
                fontSize: '1.5rem'
            }
                        }}
                    >
                        {title}
                    </Typography>
                </DialogTitle>
            ) : null}
            <DialogContent>{children}</DialogContent>
            {withAction ? (
                <DialogActions
                    sx={{
                        justifyContent: renderAction
                            ? 'flex-start'
                            : !isShowCloseIcon && isShowCloseButton
                              ? 'center'
                              : 'flex-end',
                        px: 3,
                        pb: 5,
                        gap: 2
                    }}
                >
                    {renderAction ? (
                        renderAction()
                    ) : (
                        <>
                            <CustomButton
                                {...{ disabled, loading }}
                                variant="gradient"
                                onClick={handleAction}
                            >
                                {actionLabel}
                            </CustomButton>
                            {!isShowCloseIcon && isShowCloseButton ? (
                                <CustomButton
                                    isShowCloseIconBorder={!isShowCloseIconBorder}
                                    onClick={handleClose}
                                    color="secondary"
                                    sx={{ borderRadius: 0.8 }}
                                >
                                    {closeLabel || 'Close'}
                                </CustomButton>
                            ) : null}
                        </>
                    )}
                </DialogActions>
            ) : null}
        </Dialog>
    );
};

export default CustomModal;
