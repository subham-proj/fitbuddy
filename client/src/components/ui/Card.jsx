import styles from './Card.module.css';

/**
 * Surface container. `tone="dark"` renders the ink hero-card variant used for
 * emphasis cards (rings, etc.). `as` lets callers pick the element/tag.
 *
 * @param {object} props
 * @param {'light'|'dark'} [props.tone]
 * @param {React.ElementType} [props.as]
 */
function Card({ tone = 'light', as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag
      className={`${styles.card} ${tone === 'dark' ? styles.dark : ''} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Card;
