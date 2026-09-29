import { Box, Button, Typography } from '@mui/material';
import { MovieFilter as MovieFilterIcon } from '@mui/icons-material';

export default function EmptyState({ message, actionLabel, onAction }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
      <MovieFilterIcon sx={{ fontSize: 64, mb: 1, opacity: 0.6 }} />
      <Typography variant="h6" sx={{ mb: 2 }}>
        {message}
      </Typography>
      {actionLabel && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
