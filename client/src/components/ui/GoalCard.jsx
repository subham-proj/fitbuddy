import Badge from './Badge';
import styles from './GoalCard.module.css';

const STATUS_TONE = {
  'On track': 'onTrack',
  Behind: 'behind',
  Done: 'done',
};

/**
 * A goal with an area eyebrow, status badge, title, and a progress bar with
 * progress + due labels.
 *
 * @param {object} props
 * @param {string} props.area
 * @param {string} props.title
 * @param {string} props.progress
 * @param {number} props.pct
 * @param {string} props.due
 * @param {'On track'|'Behind'|'Done'} props.status
 * @param {string} props.barColor - fill color (token var)
 */
function GoalCard({ area, title, progress, pct, due, status, barColor }) {
  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <span className={styles.area}>{area}</span>
        <Badge tone={STATUS_TONE[status]}>{status}</Badge>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.progressBlock}>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${pct}%`, background: barColor }} />
        </div>
        <div className={styles.labels}>
          <span>{progress}</span>
          <span>{due}</span>
        </div>
      </div>
    </article>
  );
}

export default GoalCard;
