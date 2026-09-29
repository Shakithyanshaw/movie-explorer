import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { getTheme, saveTheme } from '../utils/storage';

const ThemeModeContext = createContext(null);

const HEADING_FONT = '"Poppins", "Inter", "Helvetica", "Arial", sans-serif';

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(getTheme);

  useEffect(() => {
    saveTheme(mode);
  }, [mode]);

  const toggleTheme = useCallback(
    () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    [],
  );

  const theme = useMemo(() => {
    const isDark = mode === 'dark';
    return createTheme({
      palette: {
        mode,
        primary: {
          main: isDark ? '#ffb547' : '#a35f00',
          contrastText: isDark ? '#1a1200' : '#ffffff',
        },
        secondary: { main: '#7c5cff' },
        background: isDark
          ? { default: '#0a0c14', paper: '#141828' }
          : { default: '#f4f5fa', paper: '#ffffff' },
        divider: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)',
      },
      shape: { borderRadius: 14 },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontFamily: HEADING_FONT },
        h2: { fontFamily: HEADING_FONT },
        h3: { fontFamily: HEADING_FONT },
        h4: { fontFamily: HEADING_FONT },
        h5: { fontFamily: HEADING_FONT },
        h6: { fontFamily: HEADING_FONT },
        button: { textTransform: 'none', fontWeight: 600 },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: { transition: 'background-color 0.3s ease' },
          },
        },
        // Removes MUI's grey overlay on dark-mode papers so our colors stay true.
        MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
        MuiButton: { styleOverrides: { root: { borderRadius: 999 } } },
        MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
      },
    });
  }, [mode]);

  const value = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeModeContext);
