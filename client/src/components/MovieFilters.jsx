import { Box, Button, MenuItem, TextField } from '@mui/material';
import { FilterListOff as FilterListOffIcon } from '@mui/icons-material';
const RATING_OPTIONS = [0, 5, 6, 7, 8, 9];
const OLDEST_YEAR = 1950;

const YEAR_OPTIONS = Array.from(
  { length: new Date().getFullYear() - OLDEST_YEAR + 1 },
  (_, index) => new Date().getFullYear() - index,
);

// Controlled filter bar: the parent owns the filter values.
export default function MovieFilters({
  filters,
  genres,
  onChange,
  onClear,
  hasActiveFilters,
}) {
  const selectProps = {
    select: true,
    size: 'small',
    InputLabelProps: { shrink: true },
    SelectProps: { displayEmpty: true },
    sx: { minWidth: 140, flex: { xs: '1 1 140px', sm: '0 0 auto' } },
  };

  return (
    <Box
      sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}
    >
      <TextField
        {...selectProps}
        label="Genre"
        value={filters.genre}
        onChange={(event) => onChange({ genre: event.target.value })}
      >
        <MenuItem value="">Any</MenuItem>
        {genres.map((genre) => (
          <MenuItem key={genre.id} value={genre.id}>
            {genre.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        {...selectProps}
        label="Year"
        value={filters.year}
        onChange={(event) => onChange({ year: event.target.value })}
        SelectProps={{
          displayEmpty: true,
          MenuProps: { PaperProps: { sx: { maxHeight: 320 } } },
        }}
      >
        <MenuItem value="">Any</MenuItem>
        {YEAR_OPTIONS.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        {...selectProps}
        label="Min rating"
        value={filters.minRating}
        onChange={(event) =>
          onChange({ minRating: Number(event.target.value) })
        }
      >
        {RATING_OPTIONS.map((rating) => (
          <MenuItem key={rating} value={rating}>
            {rating === 0 ? 'Any' : `${rating}+`}
          </MenuItem>
        ))}
      </TextField>

      {hasActiveFilters && (
        <Button
          startIcon={<FilterListOffIcon />}
          onClick={onClear}
          size="small"
        >
          Clear filters
        </Button>
      )}
    </Box>
  );
}
