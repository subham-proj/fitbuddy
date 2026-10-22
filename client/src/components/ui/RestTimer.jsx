import { Timer } from 'lucide-react';

import styles from './RestTimer.module.css';

/**
 * Rest countdown block for the live session (dark screen).
 *
 * @param {object} props
 * @param {string} props.label - e.g. "Rest before set 3"
 * @param {string} props.value - e.g. "1:12"
 * @param {() => void} [props.onAddTime]
 */
function RestTimer({ label, value, onAddTime }) {
  return (
    <div className={styles.timer}>
      <div className={styles.ring}>
        <Timer size={22} strokeWidth={2.2} color="var(--color-orange)" aria-hidden="true" />
      </div>
      <div className={styles.body}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </div>
      <button type="button" className={styles.add} onClick={onAddTime}>
        +15 s
      </button>
    </div>
  );
}

export default RestTimer;
