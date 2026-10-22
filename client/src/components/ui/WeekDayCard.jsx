import styles from './WeekDayCard.module.css';

/**
 * A single day in the weekly plan strip. Appearance varies by status:
 * done (muted), today (lime), planned (outlined), rest (muted text).
 *
 * @param {object} props
 * @param {string} props.day
 * @param {string} props.date
 * @param {string} props.name
 * @param {'done'|'today'|'planned'|'rest'} props.status
 * @param {string} props.statusLabel
 */
function WeekDayCard({ day, date, name, status, statusLabel }) {
  return (
    <div className={`${styles.card} ${styles[status]}`}>
      <div className={styles.top}>
        <span className={styles.day}>{day}</span>
        <span className={styles.date}>{date}</span>
      </div>
      <span className={styles.name}>{name}</span>
      <span className={styles.status}>{statusLabel}</span>
    </div>
  );
}

export default WeekDayCard;
