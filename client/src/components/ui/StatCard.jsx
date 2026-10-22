import Badge from './Badge';
import Card from './Card';
import ProgressBar from './ProgressBar';
import styles from './StatCard.module.css';

/**
 * Metric summary card: label + badge, a large value with unit, and a progress
 * bar. Used in the dashboard "today at a glance" grid.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.value
 * @param {string} [props.unit]
 * @param {string} [props.badge]
 * @param {number} props.pct - fill percentage (0–100)
 * @param {string} [props.color] - progress fill color (token var)
 */
function StatCard({ label, value, unit, badge, pct, color }) {
  return (
    <Card className={styles.card}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        {badge && <Badge>{badge}</Badge>}
      </div>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      <ProgressBar
        value={pct}
        color={color}
        label={`${label}: ${value}${unit ? ` ${unit}` : ''}`}
      />
    </Card>
  );
}

export default StatCard;
