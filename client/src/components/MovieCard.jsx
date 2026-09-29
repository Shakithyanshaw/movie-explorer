import {
  Box,
  Card,
  CardActionArea,
  CardContent,
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
import { imageUrl } from '../services/tmdbApi';
import { formatRating, getYear, ratingColor } from '../utils/format';
import useFavoriteToggle from '../hooks/useFavoriteToggle';
import { useState } from 'react';

export default function MovieCard({ movie }) {
  const { favorite, toggle } = useFavoriteToggle(movie);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const title = movie.title || 'Untitled';
  const poster = imageUrl(movie.poster_path, 'w342');
  const showPoster = Boolean(poster) && !failed;

  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 10,
          '& .poster-img': { transform: 'scale(1.06)' },
          '& .card-overlay': { opacity: 1 },
        },
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
        <Box
          sx={{
            position: 'relative',
            aspectRatio: '2 / 3',
            overflow: 'hidden',
            bgcolor: 'action.hover',
          }}
        >
          {showPoster ? (
            <Box
              component="img"
              className="poster-img"
              src={poster}
              alt={`${title} poster`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}
            />
          ) : (
            <Box
              role="img"
              aria-label={`${title} poster not available`}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                color: 'text.secondary',
              }}
            >
              <MovieIcon sx={{ fontSize: 48 }} />
              <Typography variant="caption">No poster</Typography>
            </Box>
          )}

          <Box
            className="card-overlay"
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              pb: 2,
              opacity: 0,
              transition: 'opacity 0.25s ease',
              background:
                'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0) 60%)',
              color: '#fff',
            }}
          >
            <Typography variant="button">View details</Typography>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: 999,
              bgcolor: 'rgba(0,0,0,0.72)',
              color: '#fff',
            }}
          >
            <StarIcon
              sx={{ fontSize: 16, color: ratingColor(movie.vote_average) }}
            />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {formatRating(movie.vote_average)}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ pb: '14px !important' }}>
          <Typography
            variant="subtitle1"
            noWrap
            title={title}
            sx={{ fontWeight: 600 }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getYear(movie.release_date)}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* Sibling of the link (not a child), so clicking it never navigates. */}
      <IconButton
        onClick={toggle}
        aria-label={
          favorite
            ? `Remove ${title} from favorites`
            : `Add ${title} to favorites`
        }
        sx={{
          position: 'absolute',
          top: 6,
          right: 6,
          zIndex: 1,
          bgcolor: 'rgba(0,0,0,0.65)',
          color: favorite ? '#ff5252' : '#fff',
          transition: 'transform 0.15s ease, background-color 0.2s',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.85)', transform: 'scale(1.1)' },
          '&:active': { transform: 'scale(0.85)' },
        }}
      >
        {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Card>
  );
}
