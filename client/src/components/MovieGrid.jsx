import { Box } from '@mui/material';
import MovieCard from './MovieCard';

// Exported so the skeleton loader uses the exact same layout.
export const gridSx = {
  display: 'grid',
  gap: { xs: 1.5, sm: 2.5 },
  gridTemplateColumns: {
    xs: 'repeat(2, minmax(0, 1fr))',
    sm: 'repeat(3, minmax(0, 1fr))',
    md: 'repeat(4, minmax(0, 1fr))',
    lg: 'repeat(5, minmax(0, 1fr))',
  },
};

export default function MovieGrid({ movies }) {
  return (
    <Box sx={gridSx}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </Box>
  );
}
