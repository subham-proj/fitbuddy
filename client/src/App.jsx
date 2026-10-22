import { Navigate, Route, Routes } from 'react-router-dom';

import AppShell from './components/layout/AppShell';
import DashboardPage from './features/dashboard/DashboardPage';
import GoalsPage from './features/goals/GoalsPage';
import NutritionPage from './features/nutrition/NutritionPage';
import ProgressPage from './features/progress/ProgressPage';
import SessionPage from './features/session/SessionPage';
import SettingsPage from './features/settings/SettingsPage';
import WorkoutsPage from './features/workouts/WorkoutsPage';

/**
 * App routes. App screens render inside the AppShell (sidebar + main); the
 * live session is a standalone focus-mode screen with no sidebar.
 */
function App() {
  return (
    <Routes>
      {/* Focus-mode session — outside the shell */}
      <Route path="/workouts/session/:id" element={<SessionPage />} />

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
