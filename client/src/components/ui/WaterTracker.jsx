import styles from './WaterTracker.module.css';

/**
 * Tap-to-log water glasses. Tapping a glass sets the count to it; tapping the
 * last filled glass clears it (matches the design's toggle behaviour).
 *
 * @param {object} props
 * @param {number} props.goal - total glasses
 * @param {number} props.logged - glasses currently logged
 * @param {(next: number) => void} props.onChange
 */
function WaterTracker({ goal, logged, onChange }) {
  return (
    <div role="group" aria-label="Glasses of water" className={styles.grid}>
      {Array.from({ length: goal }, (_, i) => {
        const filled = i < logged;
        return (
          <button
            key={i}
            type="button"
            aria-pressed={filled}
            aria-label={`Glass ${i + 1}${filled ? ', logged' : ''}`}
            onClick={() => onChange(logged === i + 1 ? i : i + 1)}
            className={`${styles.glass} ${filled ? styles.filled : ''}`}
          >
            <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden="true">
              <path
                d="M2 2h18l-2.5 22h-13z"
                fill={filled ? 'var(--color-water)' : 'none'}
                stroke={filled ? 'var(--color-water-stroke)' : 'var(--color-control-off)'}
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export default WaterTracker;
