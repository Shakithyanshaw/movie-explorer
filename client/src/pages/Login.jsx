import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  Whatshot as WhatshotIcon,
  playCircleOutline as PlayCircleOutlineIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import {
  Movie as MovieIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAuthState, setAuthState } from '../utils/storage';
import ThemeToggle from '../components/ThemeToggle';
import usePageTitle from '../hooks/usePageTitle';

const FEATURES = [
  { icon: <WhatshotIcon />, text: "Browse this week's trending movies" },
  { icon: <PlayCircleOutlineIcon />, text: 'Watch trailers and meet the cast' },
  { icon: <FavoriteBorderIcon />, text: 'Save your favorites for later' },
];

export default function Login() {
  usePageTitle('Login');
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  if (getAuthState().isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Please enter your username.';
    if (!password) newErrors.password = 'Please enter your password.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Demo authentication: any non-empty credentials are accepted.
    setAuthState(username.trim());
    navigate('/', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Brand panel (hidden on small screens) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          p: 8,
          color: '#fff',
          background:
            'linear-gradient(135deg, #1b1f3a 0%, #4b2a7b 60%, #a35f00 130%)',
        }}
      >
        <MovieIcon sx={{ fontSize: 56, mb: 2 }} />
        <Typography variant="h2" component="p" sx={{ fontWeight: 800 }}>
          Movie Explorer
        </Typography>
        <Typography
          variant="h6"
          sx={{ mt: 1, mb: 5, fontWeight: 400, opacity: 0.85 }}
        >
          Discover Your Favorite Films
        </Typography>
        {FEATURES.map((feature) => (
          <Box
            key={feature.text}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
              opacity: 0.9,
            }}
          >
            {feature.icon}
            <Typography>{feature.text}</Typography>
          </Box>
        ))}
      </Box>

      {/* Form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <ThemeToggle />
        </Box>
        <Paper
          component="form"
          noValidate
          onSubmit={handleSubmit}
          variant="outlined"
          sx={{
            width: '100%',
            maxWidth: 420,
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            boxShadow: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                justifyContent: 'center',
                color: 'primary.main',
                mb: 1,
              }}
            >
              <MovieIcon sx={{ fontSize: 44 }} />
            </Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Welcome back
            </Typography>
            <Typography color="text.secondary">
              Log in to Movie Explorer
            </Typography>
          </Box>
          <TextField
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            error={Boolean(errors.username)}
            helperText={errors.username}
            autoComplete="username"
            autoFocus
            fullWidth
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
            autoComplete="current-password"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ py: 1.4 }}
          >
            Login
          </Button>
          <Typography variant="caption" color="text.secondary" align="center">
            Demo login: any username and password will work.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
