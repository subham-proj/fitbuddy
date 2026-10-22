import {
  BarChart3,
  Dumbbell,
  LayoutDashboard,
  Leaf,
  Settings,
  Target,
} from 'lucide-react';

/**
 * Primary navigation items. `end` marks routes that should only be active on
 * an exact path match (the dashboard index route).
 */
export const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/nutrition', label: 'Nutrition', icon: Leaf },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/settings', label: 'Settings', icon: Settings },
];
