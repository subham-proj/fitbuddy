import styles from './ProgressBar.module.css';

/**
 * Horizontal progress bar.
 *
 * @param {object} props
 * @param {number} props.value - current value
 * @param {number} [props.max] - target value (default 100, i.e. value is a %)
 * @param {string} [props.color] - CSS color for the fill (token var). Default ink.
 * @param {number} [props.height] - track height in px
 * @param {string} [props.label] - accessible label describing the bar
 */
function ProgressBar({
  value,
  max = 100,
  color = 'var(--color-ink)',
  height = 8,
  label,
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div
      className={styles.track}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <div
        className={styles.fill}
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export default ProgressBar;
