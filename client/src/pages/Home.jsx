import { useEffect } from 'react';
import { Box, Chip, Container, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useMovies } from '../context/MovieContext';
import { getLastSearch } from '../utils/storage';

export default function Home() {
  const navigate = useNavigate();
  const { trendingMovies, loading, error, fetchTrendingMovies } = useMovies();
  const lastSearch = getLastSearch();

  useEffect(() => {
    fetchTrendingMovies();
  }, [fetchTrendingMovies]);

  return (
    <>
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: 800, fontSize: { xs: '2.2rem', md: '3.5rem' } }}
          >
            Movie Explorer
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mt: 1, mb: 4, fontWeight: 400 }}
          >
            Discover Your Favorite Films
          </Typography>
          <Box sx={{ maxWidth: 640, mx: 'auto' }}>
            <SearchBar />
          </Box>
          {lastSearch && (
            <Chip
              icon={<HistoryIcon />}
              label={`Last search: ${lastSearch}`}
              onClick={() =>
                navigate(`/search?query=${encodeURIComponent(lastSearch)}`)
              }
              sx={{ mt: 2, maxWidth: '100%' }}
            />
          )}
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
          Trending Movies
        </Typography>
        {loading && <Loading message="Loading trending movies..." />}
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
