import { Link } from 'react-router-dom';

import Card from '../../../components/ui/Card';
import { weeklyGoal } from '../../../mock/dashboard';
import styles from './WeeklyGoalCard.module.css';

/** Weekly workout goal: progress segments + an "up next" session callout. */
function WeeklyGoalCard() {
  const { done, target, upNext } = weeklyGoal;
  const segments = Array.from({ length: target }, (_, i) => i < done);

  return (
    <Card className={styles.card}>
      <h2 className={styles.title}>Weekly goal</h2>
      <div className={styles.countRow}>
        <span className={styles.count}>{done}</span>
        <span className={styles.countLabel}>of {target} workouts</span>
      </div>
      <div
        className={styles.segments}
        style={{ gridTemplateColumns: `repeat(${target}, minmax(0, 1fr))` }}
        role="img"
        aria-label={`${done} of ${target} workouts completed this week`}
      >
        {segments.map((filled, i) => (
          <span
            key={i}
            className={`${styles.segment} ${filled ? styles.segmentFilled : ''}`}
          />
        ))}
      </div>
      <div className={styles.upNext}>
        <span className={styles.eyebrow}>Up next</span>
        <span className={styles.upNextTitle}>{upNext.title}</span>
        <span className={styles.upNextDetail}>{upNext.detail}</span>
        <Link to="/workouts/session/t2" className={styles.start}>
          Start session
        </Link>
      </div>
    </Card>
  );
}

export default WeeklyGoalCard;
