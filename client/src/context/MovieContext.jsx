import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as tmdb from '../services/tmdbApi';
import { getFavorites, saveFavorites, getLastSearch } from '../utils/storage';

const MovieContext = createContext(null);

export function MovieProvider({ children }) {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState(getFavorites);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchQuery, setSearchQuery] = useState(getLastSearch);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Refs prevent duplicate requests and ignore responses from outdated searches.
  const trendingStatus = useRef('idle');
  const searchInFlight = useRef(false);
  const activeQuery = useRef('');

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const fetchTrendingMovies = useCallback(async (force = false) => {
    if (
      trendingStatus.current === 'loading' ||
      (trendingStatus.current === 'loaded' && !force)
    ) {
      return;
    }
    trendingStatus.current = 'loading';
    setLoading(true);
    setError('');
    try {
      setTrendingMovies(await tmdb.getTrendingMovies());
      trendingStatus.current = 'loaded';
    } catch (err) {
      trendingStatus.current = 'idle';
      setError(tmdb.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const searchMovies = useCallback(async (query) => {
    activeQuery.current = query;
    searchInFlight.current = true;
    setSearchQuery(query);
    setSearchResults([]);
    setCurrentPage(0);
    setTotalPages(0);
    setSearchError('');
    setSearchLoading(true);
    try {
      const data = await tmdb.searchMovies(query, 1);
      if (activeQuery.current !== query) return;
      setSearchResults(data.results);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      if (activeQuery.current === query)
        setSearchError(tmdb.getErrorMessage(err));
    } finally {
      if (activeQuery.current === query) {
        searchInFlight.current = false;
        setSearchLoading(false);
      }
    }
  }, []);

  const loadMoreSearchResults = useCallback(async () => {
    if (
      searchInFlight.current ||
      currentPage === 0 ||
      currentPage >= totalPages
    )
      return;
    const query = activeQuery.current;
    searchInFlight.current = true;
    setSearchError('');
    setSearchLoading(true);
    try {
      const data = await tmdb.searchMovies(query, currentPage + 1);
      if (activeQuery.current !== query) return;
      // Append new results, skipping any movie that is already listed.
      setSearchResults((prev) => {
        const knownIds = new Set(prev.map((movie) => movie.id));
        return [
          ...prev,
          ...data.results.filter((movie) => !knownIds.has(movie.id)),
        ];
      });
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      if (activeQuery.current === query)
        setSearchError(tmdb.getErrorMessage(err));
    } finally {
      if (activeQuery.current === query) {
        searchInFlight.current = false;
        setSearchLoading(false);
      }
    }
  }, [currentPage, totalPages]);

  const addFavorite = useCallback((movie) => {
    // Store only the fields the cards need.
    const { id, title, poster_path, release_date, vote_average } = movie;
    setFavorites((prev) =>
      prev.some((item) => item.id === id)
        ? prev
        : [...prev, { id, title, poster_path, release_date, vote_average }],
    );
  }, []);

  const removeFavorite = useCallback((movieId) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
  }, []);

  const isFavorite = useCallback(
    (movieId) => favorites.some((movie) => movie.id === movieId),
    [favorites],
  );

  const value = useMemo(
    () => ({
      trendingMovies,
      searchResults,
      favorites,
      loading,
      searchLoading,
      error,
      searchError,
      searchQuery,
      currentPage,
      totalPages,
      fetchTrendingMovies,
      searchMovies,
      loadMoreSearchResults,
      addFavorite,
      removeFavorite,
      isFavorite,
    }),
    [
      trendingMovies,
      searchResults,
      favorites,
      loading,
      searchLoading,
      error,
      searchError,
      searchQuery,
      currentPage,
      totalPages,
      fetchTrendingMovies,
      searchMovies,
      loadMoreSearchResults,
      addFavorite,
      removeFavorite,
      isFavorite,
    ],
  );

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
}

export const useMovies = () => useContext(MovieContext);
