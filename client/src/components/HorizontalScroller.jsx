import { Box } from '@mui/material';

// Scrollable row used for cast and recommendations.
export default function HorizontalScroller({ children, label }) {
  return (
    <Box
      role="region"
      aria-label={label}
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        pb: 2,
        scrollSnapType: 'x proximity',
        '& > *': { flexShrink: 0, scrollSnapAlign: 'start' },
      }}
    >
      {children}
    </Box>
  );
}
