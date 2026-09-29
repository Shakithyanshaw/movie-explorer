import { useEffect, useState } from 'react';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getLastSearch, saveLastSearch } from '../utils/storage';

export default function SearchBar({ initialValue }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initialValue ?? getLastSearch());
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValue !== undefined) setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = value.trim();
    if (!query) {
      setError('Please enter a movie title.');
      return;
    }
    setError('');
    saveLastSearch(query);
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleClear = () => {
    setValue('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
      <TextField
        fullWidth
        placeholder="Search for a movie..."
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          if (error) setError('');
        }}
        error={Boolean(error)}
        helperText={error}
        FormHelperTextProps={{ sx: { ml: 2 } }}
        inputProps={{ 'aria-label': 'Search movies' }}
        InputProps={{
          sx: {
            borderRadius: 999,
            pl: 1.5,
            pr: 0.75,
            py: 0.5,
            bgcolor: 'background.paper',
            boxShadow: 3,
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {value && (
                <IconButton
                  aria-label="Clear search"
                  size="small"
                  onClick={handleClear}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
              <Button type="submit" variant="contained" sx={{ ml: 0.5, px: 3 }}>
                Search
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}
