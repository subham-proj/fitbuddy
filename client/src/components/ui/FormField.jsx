import styles from './FormField.module.css';

/**
 * Labelled form control. Renders a native <select> when `options` is provided,
 * otherwise an <input>. Controlled via `value` / `onChange`.
 *
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.label
 * @param {string} [props.type]
 * @param {string|number} [props.value]
 * @param {(e: Event) => void} [props.onChange]
 * @param {string} [props.placeholder]
 * @param {string} [props.inputMode]
 * @param {string[]} [props.options] - options for a select
 */
function FormField({ id, label, type = 'text', value, onChange, placeholder, inputMode, options }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {options ? (
        <select id={id} className={styles.control} value={value} onChange={onChange}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          className={styles.control}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          inputMode={inputMode}
        />
      )}
    </div>
  );
}

export default FormField;
