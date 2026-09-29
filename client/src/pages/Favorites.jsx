import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { Delet as DeleteSweepIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';
import { useMovies } from '../context/MovieContext';
import usePageTitle from '../hooks/usePageTitle';
import { useNotify } from '../context/NotificationContext';
import { useMemo, useState } from 'react';
import SectionTitle from '../components/SectionTitle';

const SORT_OPTIONS = {
  added: 'Recently added',
  title: 'Title (A–Z)',
  rating: 'Highest rated',
};

export default function Favorites() {
  usePageTitle('Favorites');
  const navigate = useNavigate();
  const notify = useNotify();
  const { favorites, clearFavorites } = useMovies();
  const [sort, setSort] = useState('added');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const sortedFavorites = useMemo(() => {
    const list = [...favorites];
    if (sort === 'title')
      return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    if (sort === 'rating')
      return list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    return list.reverse();
  }, [favorites, sort]);

  const handleClearAll = () => {
    clearFavorites();
    setConfirmOpen(false);
    notify('Favorites cleared', 'info');
  };

  return (
    <Container sx={{ py: 4 }}>
      <SectionTitle
        component="h1"
        subtitle={
          favorites.length > 0
            ? `${favorites.length} saved ${favorites.length === 1 ? 'movie' : 'movies'}`
            : undefined
        }
        action={
          favorites.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TextField
                select
                size="small"
                label="Sort by"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                sx={{ minWidth: 170 }}
              >
                {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                color="error"
                startIcon={<DeleteSweepIcon />}
                onClick={() => setConfirmOpen(true)}
              >
                Clear all
              </Button>
            </Box>
          )
        }
      >
        Your Favorites
      </SectionTitle>

      {favorites.length === 0 ? (
        <EmptyState
          message="You haven't added any favorite movies yet."
          actionLabel="Discover Movies"
          onAction={() => navigate('/')}
        />
      ) : (
        <MovieGrid movies={sortedFavorites} />
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Clear all favorites?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This removes all {favorites.length} saved movies. This can't be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleClearAll}>
            Clear all
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
