/**
 * Mock data for the Nutrition screen. Mirrors figma/source/Nutrition.dc.html.
 */

export const dateLabel = 'Today, 22 October';

export const calories = {
  target: 2300,
  eaten: 1460,
  burned: 504,
  left: 840,
  pct: 63, // eaten / target, for the ring
};

export const macros = [
  { name: 'Protein', value: '112 / 150 g', pct: 75, color: 'var(--color-ink)' },
  { name: 'Carbs', value: '148 / 250 g', pct: 59, color: 'var(--color-orange)' },
  { name: 'Fat', value: '48 / 75 g', pct: 64, color: 'var(--color-violet)' },
  { name: 'Fibre', value: '21 / 30 g', pct: 70, color: 'var(--color-olive)' },
];

export const water = {
  goal: 8, // glasses
  logged: 5, // default logged
  glassMl: 250,
};

export const meals = [
  {
    name: 'Breakfast',
    meta: '420 kcal · 8:10 AM',
    items: [
      { id: 'b1', name: 'Overnight oats', detail: '1 bowl · 18 g protein', kcal: 310 },
      { id: 'b2', name: 'Banana', detail: '1 medium', kcal: 110 },
    ],
  },
  {
    name: 'Lunch',
    meta: '680 kcal · 1:15 PM',
    items: [
      { id: 'l1', name: 'Chicken rice bowl', detail: '1 serving · 42 g protein', kcal: 560 },
      { id: 'l2', name: 'Greek yogurt', detail: '150 g', kcal: 120 },
    ],
  },
  {
    name: 'Snacks',
    meta: '360 kcal',
    items: [
      { id: 's1', name: 'Protein shake', detail: '1 scoop + milk · 32 g protein', kcal: 240 },
      { id: 's2', name: 'Almonds', detail: '20 g', kcal: 120 },
    ],
  },
  {
    name: 'Dinner',
    meta: 'Nothing logged yet · about 840 kcal left',
    items: [],
  },
];
