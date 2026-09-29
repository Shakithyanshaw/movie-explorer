import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
  params: { api_key: API_KEY, language: 'en-US' },
});

// Build a full image URL, or return null so components can show a placeholder.
export const imageUrl = (path, size = 'w500') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : null;

export const getTrendingMovies = async () => {
  const { data } = await api.get('/trending/movie/week');
  return data.results || [];
};

export const searchMovies = async (query, page = 1) => {
  const { data } = await api.get('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return {
    results: data.results || [],
    page: data.page,
    totalPages: data.total_pages || 0,
  };
};

export const getMovieDetails = async (movieId) => {
  const { data } = await api.get(`/movie/${movieId}`);
  return data;
};

export const getMovieCredits = async (movieId) => {
  const { data } = await api.get(`/movie/${movieId}/credits`);
  return data;
};

export const getMovieVideos = async (movieId) => {
  const { data } = await api.get(`/movie/${movieId}/videos`);
  return data;
};

// Official YouTube trailer, then any YouTube trailer.
export const findTrailer = (videos = []) => {
  const trailers = videos.filter(
    (video) => video.site === 'YouTube' && video.type === 'Trailer',
  );
  return trailers.find((video) => video.official) || trailers[0] || null;
};

// Axios error into a friendly message.
export const getErrorMessage = (error) => {
  if (!API_KEY) {
    return 'TMDb API key is missing. Add REACT_APP_TMDB_API_KEY to your .env file and restart the server.';
  }
  if (error?.response?.status === 401) {
    return 'The TMDb API key is invalid. Please check REACT_APP_TMDB_API_KEY.';
  }
  if (error?.response) {
    return 'Something went wrong while loading movies.';
  }
  if (error?.request) {
    return 'Unable to connect to TMDb. Please check your internet connection.';
  }
  return 'Something went wrong while loading movies.';
};
