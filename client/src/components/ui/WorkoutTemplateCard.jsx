import { Link } from 'react-router-dom';

import Button from './Button';
import styles from './WorkoutTemplateCard.module.css';

/**
 * A saved workout template: type chip + duration, name + meta, focus, and
 * Start / Edit actions. "Start" links to the live session.
 *
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.type
 * @param {string} props.chipColor
 * @param {string} props.name
 * @param {string} props.meta
 * @param {string} props.focus
 * @param {string} props.duration
 */
function WorkoutTemplateCard({ id, type, chipColor, name, meta, focus, duration }) {
  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <span className={styles.chip} style={{ background: chipColor }}>
          {type}
        </span>
        <span className={styles.duration}>{duration}</span>
      </div>
      <div className={styles.titleBlock}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.meta}>{meta}</span>
      </div>
      <span className={styles.focus}>{focus}</span>
      <div className={styles.actions}>
        <Link to={`/workouts/session/${id}`} className={styles.start}>
          Start
        </Link>
        <Button variant="secondary">Edit</Button>
      </div>
    </article>
  );
}

export default WorkoutTemplateCard;
