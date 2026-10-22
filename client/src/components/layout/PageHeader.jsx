import styles from './PageHeader.module.css';

/**
 * Page header: an eyebrow line, a title, and an optional actions slot that
 * wraps below on narrow screens.
 *
 * @param {object} props
 * @param {string} [props.eyebrow] - small line above the title
 * @param {string} props.title
 * @param {string} [props.subtitle] - supporting line below the title
 * @param {React.ReactNode} [props.actions]
 */
function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <header className={styles.header}>
      <div className={styles.titleBlock}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}

export default PageHeader;
