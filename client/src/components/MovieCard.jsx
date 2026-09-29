import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { imageUrl } from '../services/tmdbApi';
import { formatRating, getYear } from '../utils/format';

export default function MovieCard({ movie }) {
  const { isFavorite, addFavorite, removeFavorite } = useMovies();
  const favorite = isFavorite(movie.id);
  const title = movie.title || 'Untitled';
  const poster = imageUrl(movie.poster_path, 'w342');

  const toggleFavorite = () =>
    favorite ? removeFavorite(movie.id) : addFavorite(movie);

  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/movie/${movie.id}`}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}
      >
        {poster ? (
          <CardMedia
            component="img"
            image={poster}
            alt={`${title} poster`}
            loading="lazy"
            sx={{ aspectRatio: '2 / 3', objectFit: 'cover' }}
          />
        ) : (
          <Box
            role="img"
            aria-label={`${title} poster not available`}
            sx={{
              aspectRatio: '2 / 3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
              color: 'text.secondary',
            }}
          >
            <MovieIcon sx={{ fontSize: 56 }} />
          </Box>
        )}
        <CardContent sx={{ pb: '16px !important' }}>
          <Typography
            variant="subtitle1"
            noWrap
            title={title}
            sx={{ fontWeight: 600 }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 0.5,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {getYear(movie.release_date)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 18, color: '#ffb400' }} />
              <Typography variant="body2">
                {formatRating(movie.vote_average)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Sibling of the link (not a child), so clicking it never navigates. */}
      <IconButton
        onClick={toggleFavorite}
        aria-label={
          favorite
            ? `Remove ${title} from favorites`
            : `Add ${title} to favorites`
        }
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'rgba(0,0,0,0.65)',
          color: favorite ? '#ff5252' : '#fff',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
        }}
      >
        {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Card>
  );
}
