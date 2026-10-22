import Card from '../../../components/ui/Card';
import { calories } from '../../../mock/nutrition';
import styles from './CaloriesCard.module.css';

const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Dark card: calorie budget donut + target/eaten/burned breakdown. */
function CaloriesCard() {
  const offset = CIRCUMFERENCE * (1 - calories.pct / 100);

  return (
    <Card tone="dark" className={styles.card}>
      <h2 className={styles.title}>Calories</h2>
      <div className={styles.body}>
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          role="img"
          aria-label={`${calories.eaten.toLocaleString()} of ${calories.target.toLocaleString()} kcal eaten, ${calories.left} remaining`}
          className={styles.ring}
        >
          <g transform="rotate(-90 70 70)" fill="none" strokeWidth="14" strokeLinecap="round">
            <circle cx="70" cy="70" r={RADIUS} stroke="var(--color-dark-track)" />
            <circle
              cx="70"
              cy="70"
              r={RADIUS}
              stroke="var(--color-lime)"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </g>
          <text x="70" y="68" textAnchor="middle" className={styles.ringValue}>
            {calories.left}
          </text>
          <text x="70" y="90" textAnchor="middle" className={styles.ringLabel}>
            kcal left
          </text>
        </svg>
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Target</dt>
            <dd className={styles.statValue}>{calories.target.toLocaleString()} kcal</dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Eaten</dt>
            <dd className={styles.statValue}>{calories.eaten.toLocaleString()} kcal</dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Burned</dt>
            <dd className={styles.statValue}>{calories.burned} kcal</dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}

export default CaloriesCard;
