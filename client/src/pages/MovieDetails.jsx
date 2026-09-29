import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  Movie as MovieIcon,
  Person as PersonIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import {
  findTrailer,
  getErrorMessage,
  getMovieCredits,
  getMovieDetails,
  getMovieRecommendations,
  getMovieVideos,
  imageUrl,
} from '../services/tmdbApi';
import {
  formatCurrency,
  formatDate,
  formatRating,
  formatRuntime,
  getYear,
  ratingColor,
} from '../utils/format';
import useFavoriteToggle from '../hooks/useFavoriteToggle';
import usePageTitle from '../hooks/usePageTitle';
import SectionTitle from '../components/SectionTitle';
import HorizontalScroller from '../components/HorizontalScroller';
import MovieCard from '../components/MovieCard';

function DetailsSkeleton() {
  return (
    <Box aria-busy="true" aria-label="Loading movie details">
      <Skeleton variant="rectangular" sx={{ height: { xs: 200, md: 380 } }} />
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 3, md: 5 },
            mt: { xs: -10, md: -18 },
          }}
        >
          <Skeleton
            variant="rounded"
            sx={{
              width: { xs: 200, md: 300 },
              height: { xs: 300, md: 450 },
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1, width: '100%', pt: { md: 20 } }}>
            <Skeleton
              variant="text"
              sx={{ fontSize: '2.8rem', width: '60%' }}
            />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="95%" />
            <Skeleton variant="text" width="90%" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function RatingRing({ value }) {
  const score = Math.round((value || 0) * 10);
  return (
    <Box
      sx={{ position: 'relative', display: 'inline-flex' }}
      role="img"
      aria-label={`User score ${score} percent`}
    >
      <CircularProgress
        variant="determinate"
        value={100}
        size={64}
        thickness={4}
        sx={{ color: 'divider', position: 'absolute' }}
      />
      <CircularProgress
        variant="determinate"
        value={score}
        size={64}
        thickness={4}
        sx={{ color: ratingColor(value) }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {value ? `${score}%` : 'NR'}
        </Typography>
      </Box>
    </Box>
  );
}

function FavoriteButton({ movie }) {
  const { favorite, toggle } = useFavoriteToggle(movie);
  return (
    <Button
      variant={favorite ? 'outlined' : 'contained'}
      size="large"
      startIcon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      onClick={toggle}
    >
      {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
    </Button>
  );
}

function CastMember({ person }) {
  const photo = imageUrl(person.profile_path, 'w185');
  return (
    <Paper variant="outlined" sx={{ width: 140, overflow: 'hidden' }}>
      {photo ? (
        <Box
          component="img"
          src={photo}
          alt={person.name}
          loading="lazy"
          sx={{
            width: '100%',
            aspectRatio: '2 / 3',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <Box
          role="img"
          aria-label={`${person.name} photo not available`}
          sx={{
            aspectRatio: '2 / 3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'action.hover',
            color: 'text.secondary',
          }}
        >
          <PersonIcon sx={{ fontSize: 48 }} />
        </Box>
      )}
      <Box sx={{ p: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {person.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {person.character || 'Unknown role'}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const trailerRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  usePageTitle(movie?.title);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        // Everything except the main details is optional, so those failures don't break the page.
        const [details, credits, videos, recs] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id).catch(() => null),
          getMovieVideos(id).catch(() => null),
          getMovieRecommendations(id).catch(() => []),
        ]);
        if (cancelled) return;
        setMovie(details);
        setCast((credits?.cast || []).slice(0, 10));
        setTrailer(findTrailer(videos?.results || []));
        setRecommendations(recs.slice(0, 12));
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.status === 404
              ? "We couldn't find that movie."
              : getErrorMessage(err),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  // Go back in history, or home when the page was opened directly.
  const handleBack = () =>
    location.key !== 'default' ? navigate(-1) : navigate('/');

  if (loading) return <DetailsSkeleton />;

  if (error || !movie) {
    return (
      <Container sx={{ py: 4 }}>
        <ErrorMessage
          message={error}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const backdrop = imageUrl(movie.backdrop_path, 'w1280');
  const poster = imageUrl(movie.poster_path, 'w500');
  const facts = [
    ['Release date', formatDate(movie.release_date)],
    ['Status', movie.status || 'N/A'],
    [
      'Language',
      movie.original_language ? movie.original_language.toUpperCase() : 'N/A',
    ],
    ['Budget', formatCurrency(movie.budget)],
    ['Revenue', formatCurrency(movie.revenue)],
  ];
  const centerOnMobile = { xs: 'center', md: 'flex-start' };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Backdrop */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 200, md: 380 },
          bgcolor: 'action.hover',
          overflow: 'hidden',
        }}
      >
        {backdrop && (
          <Box
            component="img"
            src={backdrop}
            alt={`${movie.title} backdrop`}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, ${theme.palette.background.default} 100%)`,
          }}
        />
        <IconButton
          onClick={handleBack}
          aria-label="Go back"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Container>
        {/* Poster + info */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 3, md: 5 },
            mt: { xs: -10, md: -18 },
            position: 'relative',
          }}
        >
          <Box sx={{ width: { xs: 200, md: 300 }, flexShrink: 0 }}>
            {poster ? (
              <Box
                component="img"
                src={poster}
                alt={`${movie.title} poster`}
                sx={{
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: 10,
                  display: 'block',
                }}
              />
            ) : (
              <Box
                role="img"
                aria-label="Poster not available"
                sx={{
                  aspectRatio: '2 / 3',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                  color: 'text.secondary',
                }}
              >
                <MovieIcon sx={{ fontSize: 64 }} />
              </Box>
            )}
          </Box>

          <Box sx={{ minWidth: 0, pt: { md: 20 } }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.9rem', md: '2.8rem' },
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              {movie.title}
            </Typography>
            {movie.tagline && (
              <Typography
                color="text.secondary"
                sx={{
                  fontStyle: 'italic',
                  mt: 0.5,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                {movie.tagline}
              </Typography>
            )}

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: centerOnMobile,
                alignItems: 'center',
                gap: 1.5,
                mt: 2,
              }}
            >
              <RatingRing value={movie.vote_average} />
              <Chip label={getYear(movie.release_date)} />
              <Chip
                icon={<StarIcon sx={{ color: '#ffb400 !important' }} />}
                label={formatRating(movie.vote_average)}
              />
              <Chip label={formatRuntime(movie.runtime)} />
            </Box>

            {movie.genres?.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: centerOnMobile,
                  gap: 1,
                  mt: 2,
                }}
              >
                {movie.genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                ))}
              </Box>
            )}

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: centerOnMobile,
                gap: 1.5,
                mt: 3,
              }}
            >
              <FavoriteButton movie={movie} />
              {trailer && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  onClick={() =>
                    trailerRef.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                  }
                >
                  Watch Trailer
                </Button>
              )}
            </Box>

            <Typography
              variant="h6"
              component="h2"
              sx={{ mt: 4, mb: 1, fontWeight: 700 }}
            >
              Overview
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
              {movie.overview || 'Overview not available.'}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
                mt: 3,
                gridTemplateColumns: {
                  xs: 'repeat(2, minmax(0, 1fr))',
                  sm: 'repeat(3, minmax(0, 1fr))',
                },
              }}
            >
              {facts.map(([label, value]) => (
                <Paper key={label} variant="outlined" sx={{ p: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {value}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Cast */}
        <Box sx={{ mt: 7 }}>
          <SectionTitle>Cast</SectionTitle>
          {cast.length > 0 ? (
            <HorizontalScroller label="Cast members">
              {cast.map((person) => (
                <CastMember
                  key={person.credit_id || person.id}
                  person={person}
                />
              ))}
            </HorizontalScroller>
          ) : (
            <Typography color="text.secondary">
              Cast information not available.
            </Typography>
          )}
        </Box>

        {/* Trailer */}
        <Box ref={trailerRef} sx={{ mt: 5, scrollMarginTop: 80 }}>
          <SectionTitle>Trailer</SectionTitle>
          {trailer ? (
            <Box
              sx={{
                position: 'relative',
                pt: '56.25%',
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: '#000',
                boxShadow: 6,
              }}
            >
              <Box
                component="iframe"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={`${movie.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
              />
            </Box>
          ) : (
            <Typography color="text.secondary">
              Trailer not available.
            </Typography>
          )}
        </Box>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Box sx={{ mt: 7 }}>
            <SectionTitle>You might also like</SectionTitle>
            <HorizontalScroller label="Recommended movies">
              {recommendations.map((item) => (
                <Box key={item.id} sx={{ width: { xs: 150, sm: 180 } }}>
                  <MovieCard movie={item} />
                </Box>
              ))}
            </HorizontalScroller>
          </Box>
        )}
      </Container>
    </Box>
  );
}
