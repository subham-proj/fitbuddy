import styles from './Heatmap.module.css';

const LEVEL_COLORS = [
  'var(--color-divider)',
  'var(--color-heat-1)',
  'var(--color-olive)',
  'var(--color-ink)',
];

/**
 * Activity heatmap: cells laid out in 7 rows (days), filling by column (weeks).
 * Each cell is an intensity level 0–3.
 *
 * @param {object} props
 * @param {number[]} props.levels
 * @param {string} props.ariaLabel
 */
function Heatmap({ levels, ariaLabel }) {
  return (
    <div className={styles.scroll}>
      <div role="img" aria-label={ariaLabel} className={styles.grid}>
        {levels.map((level, i) => (
          <div
            key={i}
            className={styles.cell}
            style={{ background: LEVEL_COLORS[level] }}
          />
        ))}
      </div>
    </div>
  );
}

export default Heatmap;
