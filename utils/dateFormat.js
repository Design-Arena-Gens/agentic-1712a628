const isValidDate = (date) => {
  if (!date) return false;
  const parsed = date instanceof Date ? date : new Date(date);
  return !Number.isNaN(parsed.getTime());
};

export const formatDistanceToNow = (input) => {
  if (!isValidDate(input)) return 'recently';
  const date = input instanceof Date ? input : new Date(input);
  const now = new Date();
  const diff = Math.max(0, now.getTime() - date.getTime());

  const durations = [
    { label: 'year', milliseconds: 1000 * 60 * 60 * 24 * 365 },
    { label: 'month', milliseconds: 1000 * 60 * 60 * 24 * 30 },
    { label: 'week', milliseconds: 1000 * 60 * 60 * 24 * 7 },
    { label: 'day', milliseconds: 1000 * 60 * 60 * 24 },
    { label: 'hour', milliseconds: 1000 * 60 * 60 },
    { label: 'minute', milliseconds: 1000 * 60 },
  ];

  for (const duration of durations) {
    const value = Math.floor(diff / duration.milliseconds);
    if (value >= 1) {
      return `${value} ${duration.label}${value > 1 ? 's' : ''} ago`;
    }
  }

  return 'moments ago';
};
