import styles from './Button.module.css';

/**
 * Button with the variants from the design system.
 *
 * @param {object} props
 * @param {'primary'|'dark'|'secondary'|'ghostDark'|'dangerOutline'} [props.variant]
 * @param {React.ReactNode} [props.leadingIcon] - decorative icon rendered before the label
 * @param {string} [props.className]
 */
function Button({
  variant = 'secondary',
  leadingIcon,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className}`.trim()}
      {...rest}
    >
      {leadingIcon}
      {children}
    </button>
  );
}

export default Button;
