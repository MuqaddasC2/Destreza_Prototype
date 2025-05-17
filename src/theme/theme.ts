import { createTheme } from '@mui/material/styles';

// Color palette
export const colors = {
  background: {
    dark: '#0C0E1D',
    medium: '#211F36',
  },
  accent: {
    primary: '#51FAAA',
    secondary: '#FF81FF',
    tertiary: '#616083',
  },
  text: {
    primary: 'rgba(255, 255, 255, 0.87)',
    secondary: 'rgba(255, 255, 255, 0.6)',
    disabled: 'rgba(255, 255, 255, 0.38)',
  },
  card: {
    background: 'rgba(12, 14, 29, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  disease: {
    susceptible: '#5B8FF9', 
    exposed: '#FF81FF',
    infectious: '#FF4D4F',
    recovered: '#51FAAA',
    dead: '#666666',
  }
};

// Theme configuration
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.accent.primary,
    },
    secondary: {
      main: colors.accent.secondary,
    },
    background: {
      default: colors.background.dark,
      paper: colors.card.background,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '0.02em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: colors.text.secondary,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: colors.text.disabled,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `linear-gradient(to bottom, ${colors.background.dark}, ${colors.background.medium})`,
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: `0 0 15px rgba(81, 250, 170, 0.3)`,
          '&:hover': {
            boxShadow: `0 0 20px rgba(81, 250, 170, 0.5)`,
          },
        },
        outlined: {
          borderColor: colors.accent.primary,
          '&:hover': {
            boxShadow: `0 0 10px rgba(81, 250, 170, 0.3)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.card.background,
          backdropFilter: 'blur(32px)',
          borderRadius: '20px',
          border: `1px solid ${colors.card.border}`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: colors.accent.primary,
          height: 3,
          boxShadow: `0 0 8px ${colors.accent.primary}`,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          minWidth: 100,
          '&.Mui-selected': {
            color: colors.accent.primary,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(33, 31, 54, 0.7)',
          borderRadius: '12px',
          border: `1px solid ${colors.card.border}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.card.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.accent.primary,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.accent.primary,
            boxShadow: `0 0 0 1px ${colors.accent.primary}`,
          },
        },
      },
    },
  },
});

export default theme;