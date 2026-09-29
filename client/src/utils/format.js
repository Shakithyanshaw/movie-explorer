export const getYear = (dateString) =>
  dateString ? dateString.slice(0, 4) : 'N/A';

export const formatRating = (rating) =>
  typeof rating === 'number' && rating > 0 ? rating.toFixed(1) : 'N/A';

export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours}h ${mins}m` : `${mins}m`;
};
