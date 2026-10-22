import { Navigate, Route, Routes } from 'react-router-dom';

import AppShell from './components/layout/AppShell';
import DashboardPage from './features/dashboard/DashboardPage';
import GoalsPage from './features/goals/GoalsPage';
import NutritionPage from './features/nutrition/NutritionPage';
import ProgressPage from './features/progress/ProgressPage';
import SettingsPage from './features/settings/SettingsPage';
import WorkoutsPage from './features/workouts/WorkoutsPage';

/**
 * App routes. All screens render inside the AppShell (sidebar + main). This
 * app logs workouts in one go — there is no live-session screen.
 */
function App() {
  return (
    <Routes>
      {/* Main app shell */}
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="workouts" element={<WorkoutsPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="nutrition" element={<NutritionPage />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
