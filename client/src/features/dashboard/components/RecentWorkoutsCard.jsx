import { Link } from 'react-router-dom';

import Card from '../../../components/ui/Card';
import WorkoutRow from '../../../components/ui/WorkoutRow';
import { formatDate, formatNumber } from '../../../utils/format';
import styles from './RecentWorkoutsCard.module.css';

const TYPE_COLOR = {
  strength: 'var(--color-chip-lime)',
  cardio: 'var(--color-chip-orange)',
  mobility: 'var(--color-chip-violet)',
  other: 'var(--color-chip-lime)',
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Two-letter initials from a workout title. */
function initialsOf(title) {
  const words = title.trim().split(/\s+/).slice(0, 2);
  return words.map((w) => w[0]?.toUpperCase() ?? '').join('') || 'W';
}

/**
 * Recent workouts list with a "View all" link to the workouts page.
 *
 * @param {object} props
 * @param {object[]} props.workouts
 */
function RecentWorkoutsCard({ workouts }) {
  return (
    <Card className={styles.card}>
      <div className={styles.head}>
        <h2 className={styles.title}>Recent workouts</h2>
        <Link to="/workouts" className={styles.viewAll}>
          View all
        </Link>
      </div>
      {workouts.length === 0 ? (
        <p className={styles.empty}>No workouts logged yet.</p>
      ) : (
        <ul className={styles.list}>
          {workouts.map((w) => {
            const parts = [`${w.durationMin} min`, cap(w.type)];
            if (w.volumeKg > 0) parts.push(`${formatNumber(Math.round(w.volumeKg))} kg`);
            return (
              <WorkoutRow
                key={w.id}
                initials={initialsOf(w.title)}
                color={TYPE_COLOR[w.type] ?? TYPE_COLOR.other}
                name={w.title}
                meta={parts.join(' · ')}
                kcal={w.caloriesBurned > 0 ? `${formatNumber(w.caloriesBurned)} kcal` : '—'}
                when={formatDate(w.performedAt)}
              />
            );
          })}
        </ul>
      )}
    </Card>
  );
}

export default RecentWorkoutsCard;
