import styles from './FormField.module.css';

/**
 * Labelled form control. Renders a native <select> when `options` is provided,
 * otherwise an <input>. Uncontrolled (defaultValue) — these fields are not
 * wired to state in this mock build.
 *
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.label
 * @param {string} [props.type]
 * @param {string} [props.defaultValue]
 * @param {string[]} [props.options] - options for a select
 * @param {string} [props.selected] - selected option (select only)
 */
function FormField({ id, label, type = 'text', defaultValue, options, selected }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {options ? (
        <select id={id} className={styles.control} defaultValue={selected}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input id={id} type={type} defaultValue={defaultValue} className={styles.control} />
      )}
    </div>
  );
}

export default FormField;
