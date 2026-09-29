import { Alert, Button } from '@mui/material';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <Alert
      severity="error"
      sx={{ my: 3 }}
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        )
      }
    >
      {message || 'Something went wrong while loading movies.'}
    </Alert>
  );
}
