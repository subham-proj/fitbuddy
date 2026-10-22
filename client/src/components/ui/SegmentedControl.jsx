import styles from './SegmentedControl.module.css';

/**
 * Segmented toggle. Controlled via `value` / `onChange`.
 *
 * @param {object} props
 * @param {{ value: string, label: string }[]} props.options
 * @param {string} props.value - currently selected option value
 * @param {(value: string) => void} props.onChange
 * @param {string} props.ariaLabel - label for the group
 */
function SegmentedControl({ options, value, onChange, ariaLabel }) {
  return (
    <div role="group" aria-label={ariaLabel} className={styles.group}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            className={`${styles.segment} ${selected ? styles.selected : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
