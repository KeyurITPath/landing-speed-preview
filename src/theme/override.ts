import {
  alertClasses,
  // createTheme,
  // inputLabelClasses,
  // outlinedInputClasses,
  paperClasses,
} from '@mui/material';
import { error, success, warning } from './color';

// const muiTheme = createTheme();

export function createComponents(config) {
  const { palette } = config;

  return {
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        root: {
          '& span': {
            top: 4,
            right: -8,
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: 16,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          whiteSpace: 'break-spaces',
          padding: '4px 16px',
          [`&.${alertClasses.colorWarning}`]: {
            color: warning.main,
            backgroundColor: warning.light,
          },
          [`&.${alertClasses.colorError}`]: {
            color: error.main,
            backgroundColor: error.light,
          },
          [`&.${alertClasses.colorSuccess}`]: {
            color: success.main,
            backgroundColor: success.light,
          },
        },
        icon: {
          [`&.${alertClasses.colorWarning}`]: {
            color: warning.main,
          },
          [`&.${alertClasses.colorError}`]: {
            color: error.main,
          },
          [`&.${alertClasses.colorSuccess}`]: {
            color: success.main,
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: palette.primary.typography,
          overflowWrap: 'anywhere',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
          textTransform: 'none',
          '&.MuiButton-colorPrimary': {
            color: 'white',
            transition: 'all 0.3s ease',
            ':hover': {
              backgroundColor: palette.primary.light,
            },
            '&.Mui-disabled': {
              backgroundColor: palette.primary.light,
            },
          },
          '&.MuiButton-colorSecondary': {
            color: 'white',
            transition: 'all 0.3s ease',
            ':hover': {
              backgroundColor: palette.secondary.light,
            },
            '&.Mui-disabled': {
              backgroundColor: palette.secondary.light,
            },
          },
          '&.MuiButton-colorError': {
            color: 'white',
            transition: 'all 0.3s ease',
            ':hover': {
              backgroundColor: palette.error.light,
            },
            '&.Mui-disabled': {
              backgroundColor: palette.error.light,
            },
          },
        },
        sizeSmall: {
          padding: '4px 16px',
          borderRadius: '31px',
        },
        sizeMedium: {
          padding: '8px 20px',
          borderRadius: '41px',
        },
        sizeLarge: {
          padding: '11px 24px',
          borderRadius: '50px',
        },
        textSizeSmall: {
          padding: '7px 12px',
        },
        textSizeMedium: {
          padding: '9px 16px',
        },
        textSizeLarge: {
          padding: '12px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          [`&.${paperClasses.elevation1}`]: {
            boxShadow:
              '0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '32px 24px',
          '&:last-child': {
            paddingBottom: '32px',
          },
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6',
        },
        subheaderTypographyProps: {
          variant: 'body2',
        },
      },
      styleOverrides: {
        root: {
          padding: '32px 24px 16px',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        body: {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        '#__next': {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        },
        '#nprogress': {
          pointerEvents: 'none',
        },
        '#nprogress .bar': {
          backgroundColor: palette.primary.dark,
          height: 3,
          left: 0,
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 2000,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
        input: {
          '&::placeholder': {
            opacity: 0.5,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '24px',
          '&::placeholder': {
            // color: palette.text.secondary
          },
        },
      },
    },
    // MuiOutlinedInput: {
    //     styleOverrides: {
    //         root: {
    //             background: 'transparent',
    //             borderRadius: 6,
    //             '&:hover': {
    //                 backgroundColor: palette.action.hover,
    //                 [`& .${outlinedInputClasses.notchedOutline}`]: {
    //                     borderColor: palette.action.hover,
    //                     borderWidth: 1
    //                 }
    //             },
    //             [`&.${outlinedInputClasses.focused}`]: {
    //                 backgroundColor: 'transparent',
    //                 [`& .${outlinedInputClasses.notchedOutline}`]: {
    //                     borderColor: palette.primary.main,
    //                     borderWidth: 1,
    //                     boxShadow: 'none'
    //                 }
    //             },
    //             [`&.${outlinedInputClasses.error}`]: {
    //                 [`& .${outlinedInputClasses.notchedOutline}`]: {
    //                     borderColor: palette.error.main,
    //                     borderWidth: 1,
    //                     boxShadow: 'none'
    //                 }
    //             }
    //         },
    //         input: {
    //             fontSize: 14,
    //             fontWeight: 500,
    //             padding: '12px 14px',
    //             lineHeight: '24px'
    //         },
    //         textarea: {
    //             padding: '10.5px 16px !important'
    //         },
    //         notchedOutline: {
    //             transition: muiTheme.transitions.create(['border-color', 'box-shadow']),
    //             borderWidth: 1
    //         }
    //     }
    // },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: 'black',
          fontWeight: 400,
          marginBottom: 3,
          // fontSize: 14,
          // fontWeight: 500,
          // [`&.${inputLabelClasses.filled}`]: {
          //     transform: 'translate(12px, 18px) scale(1)'
          // },
          // [`&.${inputLabelClasses.shrink}`]: {
          //     [`&.${inputLabelClasses.standard}`]: {
          //         transform: 'translate(12px, 18px) scale(1)'
          //     },
          //     [`&.${inputLabelClasses.filled}`]: {
          //         transform: 'translate(12px, 6px) scale(0.85)'
          //     },
          //     [`&.${inputLabelClasses.outlined}`]: {
          //         transform: 'translate(14px, 9px) scale(1)'
          //     }
          // }
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          paddingTop: 4,
          paddingBottom: 4,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  };
}
