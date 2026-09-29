import { useEffect, useRef, useState } from 'react';
import { Box, Container, MenuItem, TextField, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useMovies } from '../context/MovieContext';
import { saveLastSearch } from '../utils/storage';

const RATING_OPTIONS = [0, 5, 6, 7, 8];

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = (params.get('query') || '').trim();
  const {
    searchResults,
    searchLoading,
    searchError,
    searchQuery,
    currentPage,
    totalPages,
    searchMovies,
    loadMoreSearchResults,
  } = useMovies();

  const [minRating, setMinRating] = useState(0);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!query) return;
    saveLastSearch(query);
    searchMovies(query);
  }, [query, searchMovies]);

  // Ignore results left over from a previous query.
  const results = searchQuery === query ? searchResults : [];
  const filtered = results.filter((movie) => movie.vote_average >= minRating);
  const hasMore = currentPage > 0 && currentPage < totalPages;
  const isWaiting =
    !searchError &&
    results.length === 0 &&
    (searchLoading || currentPage === 0);

  // Infinite scroll: load the next page when the sentinel nears the viewport.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || searchLoading || searchError) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMoreSearchResults();
      },
      { rootMargin: '300px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, searchLoading, searchError, loadMoreSearchResults]);

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 640, mb: 4 }}>
        <SearchBar initialValue={query} />
      </Box>

      {!query ? (
        <EmptyState message="Type a movie title above to start searching." />
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{ fontWeight: 700, wordBreak: 'break-word' }}
            >
              Search Results for "{query}"
            </Typography>
            <TextField
              select
              size="small"
              label="Min rating"
              value={minRating}
              onChange={(event) => setMinRating(Number(event.target.value))}
              sx={{ minWidth: 140 }}
            >
              {RATING_OPTIONS.map((rating) => (
                <MenuItem key={rating} value={rating}>
                  {rating === 0 ? 'Any' : `${rating}+`}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {isWaiting && <Loading message="Searching..." />}

          {searchError && results.length === 0 && (
            <ErrorMessage
              message={searchError}
              onRetry={() => searchMovies(query)}
            />
          )}

          {!isWaiting && !searchError && results.length === 0 && (
            <EmptyState
              message={`No movies found for '${query}'. Try another search.`}
            />
          )}

          {results.length > 0 && (
            <>
              {filtered.length > 0 ? (
                <MovieGrid movies={filtered} />
              ) : (
                <EmptyState message="No loaded movies match this rating filter." />
              )}
              {searchLoading && <Loading message="Loading more movies..." />}
              {searchError && (
                <ErrorMessage
                  message={searchError}
                  onRetry={loadMoreSearchResults}
                />
              )}
              <Box ref={sentinelRef} sx={{ height: 1 }} aria-hidden="true" />
              {!hasMore && !searchLoading && !searchError && (
                <Typography
                  align="center"
                  color="text.secondary"
                  sx={{ py: 3 }}
                >
                  You've reached the end of the results.
                </Typography>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
}
