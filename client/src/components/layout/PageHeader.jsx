import styles from './PageHeader.module.css';

/**
 * Page header: an eyebrow line, a title, and an optional actions slot that
 * wraps below on narrow screens.
 *
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {string} props.title
 * @param {React.ReactNode} [props.actions]
 */
function PageHeader({ eyebrow, title, actions }) {
  return (
    <header className={styles.header}>
      <div className={styles.titleBlock}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}

export default PageHeader;
