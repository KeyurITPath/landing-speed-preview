import { createTheme as createMuiTheme } from '@mui/material';
import { createComponents } from './override';
import { createShadows } from './shadows';
import { createTypography } from './typography';
import { createPalette } from './palette';

export const createTheme = () => {
  const defaultTheme = createMuiTheme();

  const palette = createPalette();
  const components = createComponents({ palette });
  const shadows = createShadows();
  const typography = createTypography(defaultTheme);

  return createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440,
        xxl: 1880, // 👈 custom xxl breakpoint
      },
    },
    components,
    palette,
    shadows,
    shape: {
      borderRadius: 10,
    },
    typography,
  });
};
