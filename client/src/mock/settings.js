/**
 * Mock data for the Settings screen. Mirrors figma/source/Settings.dc.html.
 */

export const profile = {
  initials: 'AB',
  name: '[Your name]',
  email: '[you@example.com]',
  yearOfBirth: '1996',
  activityLevels: ['Lightly active', 'Active', 'Very active'],
  activityLevel: 'Active',
};

/** Unit-dependent field values for the Metric/Imperial toggle. */
export const unitValues = {
  metric: {
    height: { label: 'Height (cm)', value: '176' },
    weight: { label: 'Weight (kg)', value: '72.4' },
    water: { label: 'Water (L)', value: '2.0' },
  },
  imperial: {
    height: { label: 'Height (ft/in)', value: '5′ 9″' },
    weight: { label: 'Weight (lb)', value: '159.6' },
    water: { label: 'Water (fl oz)', value: '68' },
  },
};

/** Fixed daily targets (not unit-dependent). */
export const fixedTargets = [
  { id: 't-steps', label: 'Steps', value: '10,000' },
  { id: 't-move', label: 'Move (kcal)', value: '600' },
  { id: 't-ex', label: 'Exercise (min)', value: '60' },
];

export const devices = [
  { id: 'd1', initials: 'AW', name: 'Apple Health', meta: 'Synced 5 min ago · steps, heart rate, sleep', connected: true },
  { id: 'd2', initials: 'GF', name: 'Google Fit', meta: 'Not connected', connected: false },
  { id: 'd3', initials: 'GA', name: 'Garmin Connect', meta: 'Synced yesterday · runs', connected: true },
  { id: 'd4', initials: 'ST', name: 'Strava', meta: 'Not connected', connected: false },
];

export const notifications = [
  { id: 'n1', name: 'Workout reminders', meta: '30 minutes before a planned session', enabled: true },
  { id: 'n2', name: 'Goal milestones', meta: 'When you hit or fall behind on a goal', enabled: true },
  { id: 'n3', name: 'Weekly summary', meta: 'Every Monday morning by email', enabled: false },
  { id: 'n4', name: 'Hydration nudges', meta: 'Every 2 hours between 9 AM and 7 PM', enabled: true },
];
