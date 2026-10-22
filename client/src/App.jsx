import { Navigate, Route, Routes } from 'react-router-dom';

import AppShell from './components/layout/AppShell';
import DashboardPage from './features/dashboard/DashboardPage';
import PlaceholderPage from './pages/PlaceholderPage';

/**
 * App routes. All app screens render inside the AppShell (sidebar + main).
 * Non-dashboard screens are placeholders until built.
 */
function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="workouts" element={<PlaceholderPage title="Workouts" />} />
        <Route path="progress" element={<PlaceholderPage title="Progress" />} />
        <Route path="nutrition" element={<PlaceholderPage title="Nutrition" />} />
        <Route path="goals" element={<PlaceholderPage title="Goals" />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
