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

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

export const formatCurrency = (amount) =>
  amount
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(amount)
    : 'N/A';

// Green for good, amber for average, red for poor.
export const ratingColor = (rating) => {
  if (!rating) return '#9e9e9e';
  if (rating >= 7) return '#2ecc71';
  if (rating >= 5) return '#ffb400';
  return '#ff5252';
};
