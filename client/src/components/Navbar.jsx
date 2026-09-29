import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useMovies } from '../context/MovieContext';
import { clearAuthState, getAuthState } from '../utils/storage';

const activeStyle = { '&.active': { color: 'primary.main' } };

export default function Navbar() {
  const navigate = useNavigate();
  const { favorites } = useMovies();
  const { username } = getAuthState();

  const handleLogout = () => {
    clearAuthState();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'primary.main',
            textDecoration: 'none',
            mr: 'auto',
          }}
        >
          <MovieIcon />
          <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
            Movie Explorer
          </Typography>
        </Box>

        {/* Desktop navigation */}
        <Button
          component={NavLink}
          to="/"
          end
          color="inherit"
          startIcon={<HomeIcon />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' }, ...activeStyle }}
        >
          Home
        </Button>
        <Button
          component={NavLink}
          to="/favorites"
          color="inherit"
          startIcon={
            <Badge badgeContent={favorites.length} color="primary" max={99}>
              <FavoriteIcon />
            </Badge>
          }
          sx={{ display: { xs: 'none', sm: 'inline-flex' }, ...activeStyle }}
        >
          Favorites
        </Button>

        {/* Mobile navigation */}
        <IconButton
          component={NavLink}
          to="/"
          end
          color="inherit"
          aria-label="Home"
          sx={{ display: { xs: 'inline-flex', sm: 'none' }, ...activeStyle }}
        >
          <HomeIcon />
        </IconButton>
        <IconButton
          component={NavLink}
          to="/favorites"
          color="inherit"
          aria-label="Favorites"
          sx={{ display: { xs: 'inline-flex', sm: 'none' }, ...activeStyle }}
        >
          <Badge badgeContent={favorites.length} color="primary" max={99}>
            <FavoriteIcon />
          </Badge>
        </IconButton>

        <ThemeToggle />

        {username && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            {username}
          </Typography>
        )}
        <Tooltip title="Logout">
          <IconButton
            onClick={handleLogout}
            aria-label="Logout"
            color="inherit"
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
