/**
 * Small, dependency-free formatting helpers for displaying server data.
 * Kept pure so they're trivially reusable across features.
 */

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

/** ISO string / Date → "Wed, 21 Oct". Returns '' for missing/invalid input. */
export function formatDate(value) {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  // en-GB gives "Wed, 21 Oct" once we re-insert the comma.
  return dateFmt.format(d).replace(/^(\w+)\s/, '$1, ');
}

/** Date → "YYYY-MM-DD" in local time, for <input type="date"> values. */
export function toDateInputValue(value = new Date()) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const offsetMs = d.getTimezoneOffset() * 60 * 1000;
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 10);
}

/** Shift a "YYYY-MM-DD" string by whole days, returning the same format. */
export function shiftIsoDate(dateStr, deltaDays) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d + deltaDays);
  return toDateInputValue(dt);
}

/**
 * Human day label for the nutrition header, relative where it helps:
 * "Today, 22 October", "Yesterday, 21 October", else "Thursday, 22 October".
 */
export function formatDayLabel(dateStr) {
  const today = toDateInputValue();
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const rest = dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

  if (dateStr === today) return `Today, ${rest}`;
  if (dateStr === shiftIsoDate(today, -1)) return `Yesterday, ${rest}`;

  const weekday = dt.toLocaleDateString('en-GB', { weekday: 'long' });
  return `${weekday}, ${rest}`;
}

/** Thousands-separated integer, e.g. 8450 → "8,450". */
export function formatNumber(n) {
  return Number(n || 0).toLocaleString('en-US');
}

/** Minutes → "52 min", or an em dash when there's nothing to show. */
export function formatDuration(min) {
  return min > 0 ? `${Math.round(min)} min` : '—';
}

/** Kilograms of volume → "8,450 kg", or em dash when zero. */
export function formatVolume(kg) {
  return kg > 0 ? `${formatNumber(Math.round(kg))} kg` : '—';
}

/** Calories → "412 kcal", or em dash when zero. */
export function formatKcal(kcal) {
  return kcal > 0 ? `${formatNumber(Math.round(kcal))} kcal` : '—';
}
