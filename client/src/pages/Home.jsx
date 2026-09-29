import { useEffect } from 'react';
import { Box, Button, Chip, Container, Typography } from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import { Whatshot as WhatshotIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useMovies } from '../context/MovieContext';
import { getLastSearch } from '../utils/storage';
import usePageTitle from '../hooks/usePageTitle';
import { imageUrl } from '../services/tmdbApi';
import SectionTitle from '../components/SectionTitle';
import MovieGridSkeleton from '../components/MovieGridSkeleton';

const glassSx = {
  color: '#fff',
  bgcolor: 'rgba(255,255,255,0.14)',
  backdropFilter: 'blur(6px)',
  maxWidth: '100%',
  '&:hover': { bgcolor: 'rgba(255,255,255,0.26)' },
};

export default function Home() {
  usePageTitle('Discover Your Favorite Films');
  const navigate = useNavigate();
  const { trendingMovies, loading, error, fetchTrendingMovies } = useMovies();
  const lastSearch = getLastSearch();

  useEffect(() => {
    fetchTrendingMovies();
  }, [fetchTrendingMovies]);

  // The hero background is the backdrop of the first trending movie that has one.
  const heroMovie = trendingMovies.find((movie) => movie.backdrop_path);
  const heroImage = heroMovie
    ? imageUrl(heroMovie.backdrop_path, 'w1280')
    : null;

  return (
    <>
      <Box
        sx={{
          color: '#fff',
          textAlign: 'center',
          py: { xs: 8, md: 14 },
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: (theme) =>
            `linear-gradient(to bottom, rgba(5,7,15,0.65) 0%, rgba(5,7,15,0.55) 55%, ${theme.palette.background.default} 100%), ${
              heroImage
                ? `url(${heroImage})`
                : 'linear-gradient(135deg, #1b1f3a, #4b2a7b)'
            }`,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.4rem', md: '3.8rem' },
              background: 'linear-gradient(90deg, #ffffff, #ffc46b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Movie Explorer
          </Typography>
          <Typography
            variant="h6"
            sx={{ mt: 1, mb: 4, fontWeight: 400, opacity: 0.9 }}
          >
            Discover Your Favorite Films
          </Typography>
          <Box sx={{ maxWidth: 680, mx: 'auto' }}>
            <SearchBar />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 1.5,
              mt: 3,
            }}
          >
            {lastSearch && (
              <Chip
                icon={<HistoryIcon sx={{ color: 'inherit !important' }} />}
                label={`Last search: ${lastSearch}`}
                onClick={() =>
                  navigate(`/search?query=${encodeURIComponent(lastSearch)}`)
                }
                sx={glassSx}
              />
            )}
            {heroMovie && (
              <Button
                component={RouterLink}
                to={`/movie/${heroMovie.id}`}
                size="small"
                startIcon={<WhatshotIcon />}
                sx={{ ...glassSx, px: 2 }}
              >
                Trending now: {heroMovie.title}
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 5 }}>
        <SectionTitle subtitle="The most popular movies this week">
          Trending Movies
        </SectionTitle>
        {loading && <MovieGridSkeleton />}
        {!loading && error && (
          <ErrorMessage
            message={error}
            onRetry={() => fetchTrendingMovies(true)}
          />
        )}
        {!loading && !error && trendingMovies.length === 0 && (
          <EmptyState message="No trending movies to show right now." />
        )}
        {!loading && !error && trendingMovies.length > 0 && (
          <MovieGrid movies={trendingMovies} />
        )}
      </Container>
    </>
  );
}
