import {
  alpha,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  Movie as MovieIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useMovies } from '../context/MovieContext';
import { clearAuthState, getAuthState } from '../utils/storage';

const navLinkSx = {
  borderRadius: 999,
  '&.active': {
    color: 'primary.main',
    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
  },
};

// Text button on larger screens, icon button on phones.
function NavItem({ to, end, label, icon }) {
  return (
    <>
      <Button
        component={NavLink}
        to={to}
        end={end}
        color="inherit"
        startIcon={icon}
        sx={{ ...navLinkSx, display: { xs: 'none', sm: 'inline-flex' } }}
      >
        {label}
      </Button>
      <IconButton
        component={NavLink}
        to={to}
        end={end}
        color="inherit"
        aria-label={label}
        sx={{ ...navLinkSx, display: { xs: 'inline-flex', sm: 'none' } }}
      >
        {icon}
      </IconButton>
    </>
  );
}

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
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(14px)',
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ gap: 0.5 }}>
        <Box
          component={RouterLink}
          to="/"
          aria-label="Movie Explorer home"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            textDecoration: 'none',
            color: 'text.primary',
            mr: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              p: 0.75,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <MovieIcon fontSize="small" />
          </Box>
          <Typography
            variant="h6"
            component="span"
            sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' } }}
          >
            Movie Explorer
          </Typography>
        </Box>

        <NavItem to="/" end label="Home" icon={<HomeIcon />} />
        <NavItem
          to="/favorites"
          label="Favorites"
          icon={
            <Badge badgeContent={favorites.length} color="primary" max={99}>
              <FavoriteIcon />
            </Badge>
          }
        />

        <Tooltip title="Search">
          <IconButton
            component={NavLink}
            to="/search"
            color="inherit"
            aria-label="Search"
            sx={navLinkSx}
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>

        <ThemeToggle />

        {username && (
          <Tooltip title={username}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                ml: 0.5,
                bgcolor: 'secondary.main',
                fontSize: '0.9rem',
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
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
