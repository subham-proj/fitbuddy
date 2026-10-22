import Avatar from './Avatar';
import styles from './WorkoutRow.module.css';

/**
 * A single recent-workout row: avatar, name + meta, and kcal + when.
 *
 * @param {object} props
 * @param {string} props.initials
 * @param {string} props.color
 * @param {string} props.name
 * @param {string} props.meta
 * @param {string} props.kcal
 * @param {string} props.when
 */
function WorkoutRow({ initials, color, name, meta, kcal, when }) {
  return (
    <li className={styles.row}>
      <Avatar initials={initials} color={color} />
      <div className={styles.body}>
        <span className={styles.name}>{name}</span>
        <span className={styles.meta}>{meta}</span>
      </div>
      <div className={styles.trailing}>
        <span className={styles.kcal}>{kcal}</span>
        <span className={styles.when}>{when}</span>
      </div>
    </li>
  );
}

export default WorkoutRow;
