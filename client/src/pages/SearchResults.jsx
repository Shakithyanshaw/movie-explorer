import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useMovies } from '../context/MovieContext';
import { saveLastSearch } from '../utils/storage';
import MovieFilters from '../components/MovieFilters';
import { getMovieGenres } from '../services/tmdbApi';
import usePageTitle from '../hooks/usePageTitle';
import SectionTitle from '../components/SectionTitle';
import MovieGridSkeleton from '../components/MovieGridSkeleton';

const DEFAULT_FILTERS = { genre: '', year: '', minRating: 0 };

const matchesFilters = (movie, { genre, year, minRating }) => {
  if (genre && !(movie.genre_ids || []).includes(genre)) return false;
  if (year && (movie.release_date || '').slice(0, 4) !== String(year))
    return false;
  return (movie.vote_average || 0) >= minRating;
};

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = (params.get('query') || '').trim();
  usePageTitle(query ? `Results for "${query}"` : 'Search');

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

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [genres, setGenres] = useState([]);
  const sentinelRef = useRef(null);

  // Genre list is optional: if it fails, the genre filter just stays empty.
  useEffect(() => {
    let cancelled = false;
    getMovieGenres()
      .then((list) => {
        if (!cancelled) setGenres(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!query) return;
    saveLastSearch(query);
    setFilters(DEFAULT_FILTERS);
    searchMovies(query);
  }, [query, searchMovies]);

  // Ignore results left over from a previous query.
  const results = searchQuery === query ? searchResults : [];
  const filtered = useMemo(
    () => results.filter((movie) => matchesFilters(movie, filters)),
    [results, filters],
  );
  const hasActiveFilters = Boolean(
    filters.genre || filters.year || filters.minRating > 0,
  );
  const hasMore = currentPage > 0 && currentPage < totalPages;
  const isWaiting =
    !searchError &&
    results.length === 0 &&
    (searchLoading || currentPage === 0);

  const updateFilters = (changes) =>
    setFilters((prev) => ({ ...prev, ...changes }));
  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  // Infinite scroll: load the next page when the sentinel nears the viewport.
  // If filters hide everything, the sentinel stays visible and pages keep loading.
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
  }, [
    hasMore,
    searchLoading,
    searchError,
    loadMoreSearchResults,
    filtered.length,
  ]);

  const subtitle =
    results.length > 0
      ? `${results.length} movies loaded${hasMore ? ' · keep scrolling for more' : ''}`
      : undefined;

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 680, mb: 4 }}>
        <SearchBar initialValue={query} />
      </Box>

      {!query ? (
        <EmptyState message="Type a movie title above to start searching." />
      ) : (
        <>
          <SectionTitle component="h1" subtitle={subtitle}>
            Search Results for "{query}"
          </SectionTitle>

          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <MovieFilters
              filters={filters}
              genres={genres}
              onChange={updateFilters}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
            {hasActiveFilters && results.length > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1.5 }}
              >
                Showing {filtered.length} of {results.length} loaded movies
              </Typography>
            )}
          </Paper>

          {isWaiting && <MovieGridSkeleton />}

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
              {filtered.length > 0 && <MovieGrid movies={filtered} />}
              {filtered.length === 0 && !hasMore && !searchLoading && (
                <EmptyState
                  message="No movies match the selected filters."
                  actionLabel="Clear filters"
                  onAction={clearFilters}
                />
              )}
              {searchLoading && <Loading message="Loading more movies..." />}
              {searchError && (
                <ErrorMessage
                  message={searchError}
                  onRetry={loadMoreSearchResults}
                />
              )}
              <Box ref={sentinelRef} sx={{ height: 1 }} aria-hidden="true" />
              {!hasMore &&
                !searchLoading &&
                !searchError &&
                filtered.length > 0 && (
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
