/**
 * Mock data for the Progress screen. Mirrors figma/source/Progress.dc.html.
 * The weight series and heatmap are generated deterministically to match the
 * design's sample output.
 */

export const rangeOptions = [
  { value: '4W', label: '4W' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
];

const RANGE_CONFIG = {
  '4W': { n: 28, from: 73.3, label: '4 weeks ago' },
  '3M': { n: 90, from: 74.2, label: '3 months ago' },
  '6M': { n: 180, from: 76.0, label: '6 months ago' },
  '1Y': { n: 365, from: 78.5, label: '1 year ago' },
};

const END_WEIGHT = 72.4;

/**
 * Body-weight data for a given range: the raw values plus display labels.
 * @param {'4W'|'3M'|'6M'|'1Y'} range
 */
export function weightSeries(range) {
  const { n, from, label } = RANGE_CONFIG[range];
  const values = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    values.push(
      from +
        (END_WEIGHT - from) * t +
        Math.sin(i * 0.9) * 0.25 +
        Math.sin(i * 0.23) * 0.35 * (1 - t),
    );
  }
  values[values.length - 1] = END_WEIGHT;

  const diff = (END_WEIGHT - from).toFixed(1);
  const startLabel = label;
  const summary = `${from.toFixed(1)} → ${END_WEIGHT} kg (${diff} kg)`;
  const ariaLabel = `Body weight went from ${from.toFixed(
    1,
  )} kg to ${END_WEIGHT} kg over ${label.replace(' ago', '')}`;

  return { values, diff, startLabel, summary, ariaLabel };
}

/** Summary stat cards. Body-weight delta depends on the selected range. */
export function summaryStats(range) {
  const { diff } = weightSeries(range);
  return [
    { id: 'weight', label: 'Body weight', value: '72.4 kg', delta: `${diff} kg in range` },
    { id: 'fat', label: 'Body fat', value: '18.2%', delta: '−1.4 pts in range' },
    { id: 'workouts', label: 'Workouts', value: '46', delta: '3.8 per week' },
    { id: 'volume', label: 'Total volume', value: '312 t', delta: '+12% vs previous' },
  ];
}

export const personalRecords = [
  { id: 'pr1', name: 'Deadlift', when: '12 Oct', value: '140 kg' },
  { id: 'pr2', name: 'Back squat', when: '17 Oct', value: '100 kg' },
  { id: 'pr3', name: 'Bench press', when: '21 Oct', value: '80 kg' },
  { id: 'pr4', name: 'Pull-ups', when: '8 Oct', value: '14 reps' },
  { id: 'pr5', name: '5 km run', when: '3 Oct', value: '26:12' },
];

export const muscleVolume = [
  { name: 'Quads', sets: 16, pct: 100 },
  { name: 'Back', sets: 14, pct: 88 },
  { name: 'Chest', sets: 12, pct: 75 },
  { name: 'Hamstrings', sets: 10, pct: 63 },
  { name: 'Shoulders', sets: 9, pct: 56 },
  { name: 'Arms', sets: 8, pct: 50 },
];

/** 84 heatmap cells (12 weeks × 7 days), each a level 0–3. */
export const heatmapLevels = (() => {
  const cells = [];
  for (let c = 0; c < 84; c++) {
    const v = (c * 7 + (c % 5) * 3 + Math.floor(c / 9)) % 10;
    let level = v < 3 ? 0 : v < 6 ? 1 : v < 8 ? 2 : 3;
    if (c % 7 === 4 || c % 7 === 6) level = Math.min(level, 1);
    cells.push(level);
  }
  return cells;
})();
