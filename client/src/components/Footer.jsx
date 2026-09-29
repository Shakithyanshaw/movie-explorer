import { Box, Container, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 4,
        borderTop: 1,
        borderColor: 'divider',
        textAlign: 'center',
      }}
    >
      <Container>
        <Typography variant="body2" color="text.secondary">
          Movie Explorer · Movie data provided by TMDb. This product uses the
          TMDb API but is not endorsed or certified by TMDb.
        </Typography>
      </Container>
    </Box>
  );
}
