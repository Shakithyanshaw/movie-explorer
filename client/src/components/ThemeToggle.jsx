import { IconButton, Tooltip } from '@mui/material';
import { useThemeMode } from '../context/ThemeContext';
import { LightMode, DarkMode } from '@mui/icons-material';

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();
  const label =
    mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Tooltip title={label}>
      <IconButton onClick={toggleTheme} aria-label={label} color="inherit">
        {mode === 'dark' ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
}
