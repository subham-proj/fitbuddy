import styles from './MilestoneBadge.module.css';

/**
 * A milestone award. Earned milestones have a lime mark and white surface;
 * locked ones are muted.
 *
 * @param {object} props
 * @param {string} props.mark - short label inside the medallion
 * @param {string} props.name
 * @param {string} props.note
 * @param {boolean} props.earned
 */
function MilestoneBadge({ mark, name, note, earned }) {
  return (
    <div className={`${styles.card} ${earned ? styles.earned : styles.locked}`}>
      <span className={styles.medallion}>{mark}</span>
      <span className={styles.name}>{name}</span>
      <span className={styles.note}>{note}</span>
    </div>
  );
}

export default MilestoneBadge;
