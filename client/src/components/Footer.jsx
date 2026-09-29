import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Movie as MovieIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';

const YEAR = new Date().getFullYear();

const linkSx = {
  color: 'text.secondary',
  textDecoration: 'none',
  transition: 'color 0.2s',
  '&:hover': { color: 'primary.main', textDecoration: 'underline' },
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container sx={{ py: 5 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, md: 6 }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', md: 'flex-start' }}
        >
          {/* Brand block */}
          <Box sx={{ maxWidth: 360, textAlign: { xs: 'center', md: 'left' } }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{ color: 'primary.main', mb: 1 }}
            >
              <MovieIcon />
              <Typography
                variant="h6"
                component="span"
                sx={{ fontWeight: 700 }}
              >
                Movie Explorer
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Discover your favorite films — browse trending movies, search by
              title, and save the ones you love.
            </Typography>
          </Box>

          {/* Link columns */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 3, sm: 6 }}
            textAlign={{ xs: 'center', sm: 'left' }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Explore
              </Typography>
              <Stack spacing={0.5}>
                <Typography
                  component={RouterLink}
                  to="/"
                  variant="body2"
                  sx={linkSx}
                >
                  Home
                </Typography>
                <Typography
                  component={RouterLink}
                  to="/favorites"
                  variant="body2"
                  sx={linkSx}
                >
                  Favorites
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Resources
              </Typography>
              <Stack spacing={0.5}>
                <Typography
                  component="a"
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  sx={linkSx}
                >
                  TMDb
                </Typography>
                <Typography
                  component="a"
                  href="https://developer.themoviedb.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  sx={linkSx}
                >
                  TMDb API Docs
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Attribution + copyright */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2 }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: { xs: 'center', sm: 'left' } }}
          >
            Movie data provided by TMDb. This product uses the TMDb API but is
            not endorsed or certified by TMDb.
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              whiteSpace: 'nowrap',
            }}
          >
            © {YEAR} Movie Explorer · Built with
            <FavoriteIcon sx={{ fontSize: 14, color: 'error.main' }} />
            using React &amp; MUI
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
