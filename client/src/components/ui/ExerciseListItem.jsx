import styles from './ExerciseListItem.module.css';

/**
 * An exercise entry in the live-session list. Visual state varies:
 * done (lime check), current (highlighted, white marker), next (muted marker).
 *
 * @param {object} props
 * @param {string} props.mark - marker glyph/number
 * @param {string} props.name
 * @param {string} props.meta
 * @param {'done'|'current'|'next'} props.status
 */
function ExerciseListItem({ mark, name, meta, status }) {
  return (
    <div className={`${styles.item} ${styles[status]}`}>
      <span className={styles.marker}>{mark}</span>
      <div className={styles.body}>
        <span className={styles.name}>{name}</span>
        <span className={styles.meta}>{meta}</span>
      </div>
    </div>
  );
}

export default ExerciseListItem;
