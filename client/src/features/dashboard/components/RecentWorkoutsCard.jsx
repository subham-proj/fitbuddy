import { Link } from 'react-router-dom';

import Card from '../../../components/ui/Card';
import WorkoutRow from '../../../components/ui/WorkoutRow';
import { recentWorkouts } from '../../../mock/dashboard';
import styles from './RecentWorkoutsCard.module.css';

/** Recent workouts list with a "View all" link to the workouts page. */
function RecentWorkoutsCard() {
  return (
    <Card className={styles.card}>
      <div className={styles.head}>
        <h2 className={styles.title}>Recent workouts</h2>
        <Link to="/workouts" className={styles.viewAll}>
          View all
        </Link>
      </div>
      <ul className={styles.list}>
        {recentWorkouts.map((w) => (
          <WorkoutRow
            key={w.id}
            initials={w.initials}
            color={w.color}
            name={w.name}
            meta={w.meta}
            kcal={w.kcal}
            when={w.when}
          />
        ))}
      </ul>
    </Card>
  );
}

export default RecentWorkoutsCard;
