import styles from './HBar.module.css';

/**
 * Labeled horizontal bar: a name + trailing value above a filled track.
 * Used for muscle-group volume.
 *
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.value - trailing label (e.g. "16 sets")
 * @param {number} props.pct - fill percentage (0–100)
 * @param {string} [props.color] - fill color (token var); defaults to ink
 */
function HBar({ name, value, pct, color = 'var(--color-ink)' }) {
  return (
    <div className={styles.row}>
      <div className={styles.labels}>
        <span className={styles.name}>{name}</span>
        <span className={styles.value}>{value}</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default HBar;
