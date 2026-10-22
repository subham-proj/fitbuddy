import styles from './Switch.module.css';

/**
 * Toggle switch (role="switch"). Controlled via `checked` / `onChange`.
 *
 * @param {object} props
 * @param {boolean} props.checked
 * @param {() => void} props.onChange
 * @param {string} props.label - accessible name
 */
function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`${styles.switch} ${checked ? styles.on : ''}`}
    >
      <span className={styles.knob} />
    </button>
  );
}

export default Switch;
