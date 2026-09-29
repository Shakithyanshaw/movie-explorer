import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Paper,
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
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useMovies } from '../context/MovieContext';
import {
  findTrailer,
  getErrorMessage,
  getMovieCredits,
  getMovieDetails,
  getMovieVideos,
  imageUrl,
} from '../services/tmdbApi';
import { formatRating, formatRuntime, getYear } from '../utils/format';

function CastMember({ person }) {
  const photo = imageUrl(person.profile_path, 'w185');
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', height: '100%' }}>
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
  const theme = useTheme();
  const { isFavorite, addFavorite, removeFavorite } = useMovies();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [details, credits, videos] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id).catch(() => null),
          getMovieVideos(id).catch(() => null),
        ]);
        if (cancelled) return;
        setMovie(details);
        setCast((credits?.cast || []).slice(0, 10));
        setTrailer(findTrailer(videos?.results || []));
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

  if (loading) return <Loading message="Loading movie details..." />;

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

  const favorite = isFavorite(movie.id);
  const backdrop = imageUrl(movie.backdrop_path, 'w1280');
  const poster = imageUrl(movie.poster_path, 'w500');

  const toggleFavorite = () =>
    favorite ? removeFavorite(movie.id) : addFavorite(movie);

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
          onClick={() => navigate(-1)}
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
                  boxShadow: 8,
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

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', md: 'flex-start' },
                alignItems: 'center',
                gap: 1,
                mt: 2,
              }}
            >
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
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  gap: 1,
                  mt: 1.5,
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

            <Typography
              variant="h6"
              component="h2"
              sx={{ mt: 3, mb: 1, fontWeight: 700 }}
            >
              Overview
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {movie.overview || 'Overview not available.'}
            </Typography>

            <Button
              variant={favorite ? 'outlined' : 'contained'}
              size="large"
              startIcon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={toggleFavorite}
              sx={{ mt: 3 }}
            >
              {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </Box>
        </Box>

        {/* Cast */}
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 700, mt: 6, mb: 2 }}
        >
          Cast
        </Typography>
        {cast.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(3, minmax(0, 1fr))',
                md: 'repeat(5, minmax(0, 1fr))',
              },
            }}
          >
            {cast.map((person) => (
              <CastMember key={person.credit_id || person.id} person={person} />
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">
            Cast information not available.
          </Typography>
        )}

        {/* Trailer */}
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 700, mt: 6, mb: 2 }}
        >
          Trailer
        </Typography>
        {trailer ? (
          <Box
            sx={{
              position: 'relative',
              pt: '56.25%',
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: '#000',
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
          <Typography color="text.secondary">Trailer not available.</Typography>
        )}
      </Container>
    </Box>
  );
}
