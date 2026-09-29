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

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(getTheme);

  useEffect(() => {
    saveTheme(mode);
  }, [mode]);

  const toggleTheme = useCallback(
    () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === 'dark' ? '#ffc107' : '#a35f00' },
          background:
            mode === 'dark'
              ? { default: '#0b0d17', paper: '#151a2b' }
              : { default: '#f4f5f9', paper: '#ffffff' },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          button: { textTransform: 'none', fontWeight: 600 },
        },
      }),
    [mode],
  );

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
