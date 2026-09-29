import { Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';
import { useMovies } from '../context/MovieContext';

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites } = useMovies();

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
        Your Favorites
      </Typography>
      {favorites.length === 0 ? (
        <EmptyState
          message="You haven't added any favorite movies yet."
          actionLabel="Discover Movies"
          onAction={() => navigate('/')}
        />
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </Container>
  );
}
