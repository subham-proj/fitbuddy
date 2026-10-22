import styles from './FilterChip.module.css';

/**
 * Pill toggle used for filtering lists. Selected = ink fill.
 *
 * @param {object} props
 * @param {boolean} props.selected
 * @param {() => void} props.onClick
 */
function FilterChip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`${styles.chip} ${selected ? styles.selected : ''}`}
    >
      {children}
    </button>
  );
}

export default FilterChip;
