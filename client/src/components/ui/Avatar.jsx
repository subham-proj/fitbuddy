import styles from './Avatar.module.css';

/**
 * Rounded initials tile used in workout rows.
 *
 * @param {object} props
 * @param {string} props.initials
 * @param {string} [props.color] - background color (token var)
 */
function Avatar({ initials, color = 'var(--color-chip-lime)' }) {
  return (
    <span className={styles.avatar} style={{ background: color }} aria-hidden="true">
      {initials}
    </span>
  );
}

export default Avatar;
