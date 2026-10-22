import styles from './Badge.module.css';

/**
 * Small pill badge (e.g. "84%", "+6%", status labels).
 *
 * @param {object} props
 * @param {'neutral'|'onTrack'|'behind'|'done'} [props.tone]
 */
function Badge({ tone = 'neutral', className = '', children, ...rest }) {
  return (
    <span className={`${styles.badge} ${styles[tone]} ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}

export default Badge;
