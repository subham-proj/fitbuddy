import styles from './WeekDayCard.module.css';

/**
 * A single day in the weekly plan strip. Appearance varies by status:
 * done (muted), today (lime), planned (outlined), rest (muted text),
 * empty (dashed add state). The whole card is a button that opens the
 * day's plan editor.
 *
 * @param {object} props
 * @param {string} props.day - short weekday, e.g. "Mon"
 * @param {string} props.date - day of month, e.g. "19"
 * @param {string} props.name - planned workout name (or placeholder)
 * @param {'done'|'today'|'planned'|'rest'|'empty'} props.status
 * @param {string} props.statusLabel
 * @param {() => void} [props.onClick]
 */
function WeekDayCard({ day, date, name, status, statusLabel, onClick }) {
  const label = `${day} ${date}: ${name}${statusLabel ? `, ${statusLabel}` : ''}. Edit plan`;

  return (
    <button
      type="button"
      className={`${styles.card} ${styles[status]}`}
      onClick={onClick}
      aria-label={label}
    >
      <div className={styles.top}>
        <span className={styles.day}>{day}</span>
        <span className={styles.date}>{date}</span>
      </div>
      <span className={styles.name}>{name}</span>
      <span className={styles.status}>{statusLabel}</span>
    </button>
  );
}

export default WeekDayCard;
