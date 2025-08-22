"use client";

import { IconButton, styled, useMediaQuery } from '@mui/material';
import { closeSnackbar, MaterialDesignContent, SnackbarProvider } from "notistack";
import { ICONS } from '@/assets/icons';


const StyledVariant = styled(MaterialDesignContent)(({ theme }) => ({
    '&.notistack-MuiContent-success': {
        backgroundColor: theme.palette.success.main
    },
    '&.notistack-MuiContent-error': {
        backgroundColor: theme.palette.error.main
    },
    '&.notistack-MuiContent-warning': {
        backgroundColor: theme.palette.warning.main
    }
}));

export default function ToastProvider({ children }: { children: React.ReactNode }) {

    const matchUpSm = useMediaQuery(theme => theme.breakpoints.up('sm'));

    return (
        <SnackbarProvider
            maxSnack={3}
            preventDuplicate
            autoHideDuration={3000}
            Components={{
                success: StyledVariant,
                error: StyledVariant,
                warning: StyledVariant
            }}
            anchorOrigin={{
                vertical: matchUpSm ? 'top' : 'bottom',
                horizontal: matchUpSm ? 'right' : 'center'
            }}
            action={(snackbarId) => (
                <IconButton
                    aria-label="Close"
                    size="small"
                    sx={{ color: '#ffffff', fontSize: 22 }}
                    onClick={() => closeSnackbar(snackbarId)}
                >
                    <ICONS.CloseCircleOutline />
                </IconButton>
            )}
        >
            {children}
        </SnackbarProvider>
    );
}
