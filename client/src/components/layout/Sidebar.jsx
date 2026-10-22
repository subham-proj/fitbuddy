import { Activity } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { navItems } from './navItems';
import styles from './Sidebar.module.css';

/**
 * Primary navigation. Full-height sidebar on wide screens; collapses to a
 * horizontally scrolling top bar under 760px (streak card hidden).
 */
function Sidebar({ streakDays = 12 }) {
  return (
    <nav className={styles.sidebar} aria-label="Main">
      <NavLink to="/" className={styles.brand}>
        <span className={styles.brandMark}>
          <Activity size={20} strokeWidth={2.4} color="var(--color-lime)" aria-hidden="true" />
        </span>
        <span className={styles.brandName}>Stride</span>
      </NavLink>

      <div className={styles.links}>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
          >
            <span className={styles.linkIcon}>
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
            </span>
            <span className={styles.linkLabel}>{label}</span>
          </NavLink>
        ))}
      </div>

      <div className={styles.streak}>
        <span className={styles.streakLabel}>Streak</span>
        <span className={styles.streakValue}>{streakDays} days</span>
        <span className={styles.streakHint}>
          Log a workout today to keep it going.
        </span>
      </div>
    </nav>
  );
}

export default Sidebar;
