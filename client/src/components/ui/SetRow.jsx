import { Check } from 'lucide-react';

import styles from './SetRow.module.css';

/**
 * A set row in the live-session set table: set number, previous, kg, reps, and
 * a done toggle. Dark-screen component.
 *
 * @param {object} props
 * @param {number} props.n
 * @param {string} props.previous
 * @param {string} props.kg
 * @param {string} props.reps
 * @param {boolean} props.done
 * @param {() => void} props.onToggle
 */
function SetRow({ n, previous, kg, reps, done, onToggle }) {
  return (
    <div className={styles.row}>
      <span className={styles.n}>{n}</span>
      <span className={styles.previous}>{previous}</span>
      <span className={`${styles.cell} ${done ? styles.cellDone : ''}`}>{kg}</span>
      <span className={`${styles.cell} ${done ? styles.cellDone : ''}`}>{reps}</span>
      <button
        type="button"
        aria-pressed={done}
        aria-label={`Mark set ${n} ${done ? 'not done' : 'done'}`}
        onClick={onToggle}
        className={`${styles.toggle} ${done ? styles.toggleDone : ''}`}
      >
        <Check
          size={22}
          strokeWidth={2.8}
          color={done ? 'var(--color-ink)' : 'var(--color-ink-muted)'}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export default SetRow;
