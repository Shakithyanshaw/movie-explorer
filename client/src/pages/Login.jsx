import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Movie as MovieIcon } from '@mui/icons-material';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAuthState, setAuthState } from '../utils/storage';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <Box
      sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}
    >
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <ThemeToggle />
      </Box>
      <Container maxWidth="xs">
        <Paper
          component="form"
          noValidate
          onSubmit={handleSubmit}
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Box sx={{ textAlign: 'center', color: 'primary.main' }}>
            <MovieIcon sx={{ fontSize: 48 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Movie Explorer
            </Typography>
            <Typography color="text.secondary">
              Discover Your Favorite Films
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
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
            autoComplete="current-password"
            fullWidth
          />
          <Button type="submit" variant="contained" size="large">
            Login
          </Button>
          <Typography variant="caption" color="text.secondary" align="center">
            Demo login: any username and password will work.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
