import { alpha } from '@mui/material/styles';

const withAlphas = (color) => {
    return {
        ...color,
        alpha4: alpha(color.main, 0.04),
        alpha8: alpha(color.main, 0.08),
        alpha10: alpha(color.main, 0.1),
        alpha12: alpha(color.main, 0.12),
        alpha30: alpha(color.main, 0.3),
        alpha40: alpha(color.main, 0.4),
        alpha50: alpha(color.main, 0.5),
        alpha80: alpha(color.main, 0.8),
        alpha90: alpha(color.main, 0.9)
    };
};

const withAlpha = (color, name) => {
    return {
        ...color,
        alpha5: alpha(color[name], 0.05),
        alpha8: alpha(color[name], 0.08),
        alpha12: alpha(color[name], 0.12),
        alpha20: alpha(color[name], 0.2),
        alpha30: alpha(color[name], 0.3),
        alpha40: alpha(color[name], 0.4),
        alpha50: alpha(color[name], 0.5),
        alpha80: alpha(color[name], 0.8),
        alpha90: alpha(color[name], 0.9)
    };
};

export const neutral = {
    50: '#E8EDF4',
    100: '#F3F4F6',
    200: '#E5E7EB',
    250: '#CECFD3',
    300: '#D2D6DB',
    400: '#9DA4AE',
    500: '#6C737F',
    600: '#4D5761',
    700: '#2F3746',
    800: '#1C2536',
    900: '#111927'
};

export const success = withAlphas({
    lightest: '#F0FDF9',
    light: '#B5FBDD',
    main: '#4caf50',
    dark: '#388e3c',
    darkest: '#134E48',
    contrastText: '#FFFFFF'
});

export const warning = withAlphas({
    lightest: '#FFFAEB',
    light: '#FFF4E6',
    main: '#FFC11E',
    dark: '#B54708',
    darkest: '#7A2E0E',
    contrastText: '#FFFFFF'
});

export const error = withAlphas({
    lightest: '#FEF3F2',
    light: '#f3777f',
    main: '#EE3D48',
    dark: '#CF4A4D',
    darkest: '#7A271A',
    contrastText: '#FFFFFF'
});

export const initial = withAlpha(
    {
        white: '#ffffff',
        black: '#000000'
    },
    'black'
);

export const slate = withAlphas({
    main: '#5E5873',
    tab: '#F0F2F5'
});

export const primary = withAlphas({
    light: '#9dd59b',
    main: '#73C371',
    // dark: '#1D33B5',
    secondary: '#F5F5F5',
    typography: '#1E1E1E',
    container: '#F5F2F0',
    background: '#F5F6FD'
});

export const primaryNew = withAlphas({
    main: '#304BE0',
    disabled: alpha('#304BE0', 0.4),
    hover: alpha('#304BE0', 0.6)
});

export const secondary = withAlphas({
    light: '#a6a6a6',
    main: '#808080'
});

export const hover = withAlphas({
    main: '#F9FAFB',
    secondary: '#333333'
});

export const linearGradients = {
    primary: 'linear-gradient(90deg, #50B3F9 0%, #667CF7 100%)'
};

export const themeColors = {
    bodyBg: 'rgba(245, 247, 255, 1)',
    sideBarBg: '#191919'
};
