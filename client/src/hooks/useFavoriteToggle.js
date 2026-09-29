import { useMovies } from '../context/MovieContext';
import { useNotify } from '../context/NotificationContext';

// Shared by MovieCard and MovieDetails so favorite behavior stays consistent.
export default function useFavoriteToggle(movie) {
  const { isFavorite, addFavorite, removeFavorite } = useMovies();
  const notify = useNotify();
  const favorite = isFavorite(movie.id);
  const title = movie.title || 'this movie';

  const toggle = () => {
    if (favorite) {
      removeFavorite(movie.id);
      notify(`Removed "${title}" from favorites`, 'info');
    } else {
      addFavorite(movie);
      notify(`Added "${title}" to favorites`);
    }
  };

  return { favorite, toggle };
}
