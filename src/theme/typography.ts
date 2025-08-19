export const createTypography = theme => {
  return {
    fontFamily: '"Rubik", sans-serif',
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.57,
    },
    button: {
      fontWeight: 600,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.66,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      lineHeight: 2.5,
      textTransform: 'uppercase',
    },
    h1: {
      fontFamily: "'Rubik', sans-serif",
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: "'Rubik', sans-serif",
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      [theme.breakpoints.up('xs')]: {
        fontSize: '1.875rem',
      },
      [theme.breakpoints.up('sm')]: {
        fontSize: '2.25rem',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '3rem',
      },
    },
    h3: {
      fontFamily: "'Rubik', sans-serif",
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      [theme.breakpoints.up('xs')]: {
        fontSize: '2rem',
      },
      [theme.breakpoints.up('sm')]: {
        fontSize: '2.15rem',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '2.25rem',
      },
    },
    h4: {
      fontFamily: "'Rubik', sans-serif",
      fontWeight: 700,
      lineHeight: 1.2,
      [theme.breakpoints.up('xs')]: {
        fontSize: '1.6rem',
      },
      [theme.breakpoints.up('sm')]: {
        fontSize: '1.8rem',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '2rem',
      },
    },
    h5: {
      fontFamily: "'Rubik', sans-serif",
      fontWeight: 700,
      lineHeight: 1.2,
      [theme.breakpoints.up('xs')]: {
        fontSize: '1.3rem',
      },
      [theme.breakpoints.up('sm')]: {
        fontSize: '1.4rem',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontFamily: "'Rubik', sans-serif",
      fontWeight: 700,
      lineHeight: 1.2,
      [theme.breakpoints.up('xs')]: {
        fontSize: '1.0rem',
      },
      [theme.breakpoints.up('sm')]: {
        fontSize: '1.1rem',
      },
    },
    logo: {
      fontFamily: "'Rubik', sans-serif",
      fontWeight: 500,
      fontSize: '22px',
      lineHeight: 1.2,
      textTransform: 'uppercase',
      background: 'linear-gradient(90deg, #50B3F9 0%, #667CF7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },

    indexNumber: {
      fontSize: '6.25rem',
      fontWeight: 500,
      lineHeight: 1.2,
      [theme.breakpoints.up('xs')]: {
        fontSize: '2.5rem',
      },
      [theme.breakpoints.up('sm')]: {
        fontSize: '2.6rem',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '6rem',
      },
    },
  };
};
