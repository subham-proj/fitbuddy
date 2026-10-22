import { Link } from 'react-router-dom';

import Card from '../../../components/ui/Card';
import styles from './WeeklyGoalCard.module.css';

/**
 * Weekly workout goal, driven by the plan: progress segments + an "up next"
 * callout. `target` is the number of planned (non-rest) sessions this week.
 *
 * @param {object} props
 * @param {{ done: number, target: number, upNext: { title: string, detail: string } | null }} props.weeklyGoal
 */
function WeeklyGoalCard({ weeklyGoal }) {
  const { done, target, upNext } = weeklyGoal;
  const segments = Array.from({ length: target }, (_, i) => i < done);

  return (
    <Card className={styles.card}>
      <h2 className={styles.title}>Weekly goal</h2>
      <div className={styles.countRow}>
        <span className={styles.count}>{done}</span>
        <span className={styles.countLabel}>of {target} sessions</span>
      </div>
      {target > 0 && (
        <div
          className={styles.segments}
          style={{ gridTemplateColumns: `repeat(${target}, minmax(0, 1fr))` }}
          role="img"
          aria-label={`${done} of ${target} planned sessions done this week`}
        >
          {segments.map((filled, i) => (
            <span
              key={i}
              className={`${styles.segment} ${filled ? styles.segmentFilled : ''}`}
            />
          ))}
        </div>
      )}
      <div className={styles.upNext}>
        <span className={styles.eyebrow}>Up next</span>
        {upNext ? (
          <>
            <span className={styles.upNextTitle}>{upNext.title}</span>
            <span className={styles.upNextDetail}>{upNext.detail}</span>
          </>
        ) : (
          <span className={styles.upNextDetail}>Nothing planned — set up your week.</span>
        )}
        <Link to="/workouts" className={styles.start}>
          View this week
        </Link>
      </div>
    </Card>
  );
}

export default WeeklyGoalCard;
