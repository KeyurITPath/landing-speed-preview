import { common } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';

import {
    error,
    hover,
    initial,
    neutral,
    primary,
    primaryNew,
    secondary,
    slate,
    success,
    warning,
    themeColors,
    linearGradients
} from './color';

export const createPalette = () => {
    return {
        action: {
            active: neutral[500],
            disabled: alpha(neutral[900], 0.38),
            disabledBackground: alpha(neutral[900], 0.12),
            focus: alpha(neutral[900], 0.16),
            hover: alpha(neutral[900], 0.04),
            selected: alpha(neutral[900], 0.12)
        },
        background: {
            default: common.white,
            paper: common.white,
            primary
        },
        divider: '#F2F4F7',
        error,
        mode: 'light',
        neutral,
        primary,
        secondary,
        success,
        text: {
            primary: neutral[900],
            secondary: neutral[500],
            disabled: alpha(neutral[900], 0.38)
        },
        warning,
        initial,
        slate,
        hover,
        primaryNew,
        themeColors,
        linearGradients
    };
};
