import { Box, Skeleton } from '@mui/material';
import { gridSx } from './MovieGrid';

export default function MovieGridSkeleton({ count = 10 }) {
  return (
    <Box sx={gridSx} aria-busy="true" aria-label="Loading movies">
      {Array.from({ length: count }, (_, index) => (
        <Box key={index}>
          <Box sx={{ aspectRatio: '2 / 3' }}>
            <Skeleton
              variant="rounded"
              animation="wave"
              width="100%"
              height="100%"
            />
          </Box>
          <Skeleton width="80%" sx={{ mt: 1 }} />
          <Skeleton width="40%" />
        </Box>
      ))}
    </Box>
  );
}
