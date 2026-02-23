/**
 * Calculate the remaining time until a target ISO date string.
 * Returns { days, hours, mins, secs, total } where total is ms remaining.
 */
export const getCountdown = (targetISO) => {
  const diff = Math.max(0, new Date(targetISO).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins: Math.floor((diff % 3_600_000) / 60_000),
    secs: Math.floor((diff % 60_000) / 1_000),
    total: diff,
  };
};

/**
 * Format a countdown object to a compact string like "02d 14h 05m 32s".
 */
export const formatCountdown = ({ days, hours, mins, secs }) =>
  `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
