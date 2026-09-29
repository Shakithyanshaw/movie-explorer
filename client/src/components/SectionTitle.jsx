import { Box, Typography } from '@mui/material';

export default function SectionTitle({
  children,
  subtitle,
  action,
  component = 'h2',
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}
      >
        <Box
          sx={{
            width: 4,
            height: 30,
            borderRadius: 2,
            bgcolor: 'primary.main',
            flexShrink: 0,
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h5"
            component={component}
            sx={{ fontWeight: 700, wordBreak: 'break-word' }}
          >
            {children}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {action}
    </Box>
  );
}
