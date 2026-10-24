import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchStreak, selectStreak } from '../../features/streak/streakSlice';
import Sidebar from './Sidebar';
import styles from './AppShell.module.css';

/**
 * App shell: sidebar + main content. A flex row that wraps so the sidebar
 * becomes a top bar on narrow screens (see Sidebar.module.css). Routed pages
 * render through <Outlet />. The workout streak is loaded once here so the
 * sidebar can show it on every page.
 */
function AppShell() {
  const dispatch = useAppDispatch();
  const streak = useAppSelector(selectStreak);

  useEffect(() => {
    dispatch(fetchStreak());
  }, [dispatch]);

  return (
    <div className={styles.shell}>
      <Sidebar streak={streak} />
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppShell;
