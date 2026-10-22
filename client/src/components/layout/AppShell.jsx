import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import styles from './AppShell.module.css';

/**
 * App shell: sidebar + main content. A flex row that wraps so the sidebar
 * becomes a top bar on narrow screens (see Sidebar.module.css). Routed pages
 * render through <Outlet />.
 */
function AppShell() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppShell;
