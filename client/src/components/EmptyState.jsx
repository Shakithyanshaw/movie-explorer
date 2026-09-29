import { Box, Button, Typography } from '@mui/material';
import { MovieFilter as MovieFilterIcon } from '@mui/icons-material';

export default function EmptyState({ message, actionLabel, onAction }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
      <Box
        sx={{
          width: 96,
          height: 96,
          mx: 'auto',
          mb: 2,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'action.hover',
          color: 'text.secondary',
        }}
      >
        <MovieFilterIcon sx={{ fontSize: 48 }} />
      </Box>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mb: 2, fontWeight: 500 }}
      >
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
