import { useEffect, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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

  return (
    <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
      <TextField
        fullWidth
        label="Search movies"
        placeholder="Search for a movie..."
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          if (error) setError('');
        }}
        error={Boolean(error)}
        helperText={error}
        sx={{ bgcolor: 'background.paper', borderRadius: 3 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="submit"
                aria-label="Search"
                edge="end"
                color="primary"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}
