import Button from './Button';
import styles from './DeviceRow.module.css';

/**
 * Connected-device row: initials tile, name + sync status, and an optional
 * action. Omit `actionLabel` for a status-only row (e.g. the push-based
 * watch, which the app can't connect or disconnect).
 *
 * @param {object} props
 * @param {string} props.initials
 * @param {string} props.name
 * @param {string} props.meta
 * @param {string} [props.actionLabel]
 * @param {'primary'|'dark'|'secondary'} [props.actionVariant]
 * @param {() => void} [props.onAction]
 */
function DeviceRow({ initials, name, meta, actionLabel, actionVariant = 'dark', onAction }) {
  return (
    <div className={styles.row}>
      <span className={styles.tile} aria-hidden="true">
        {initials}
      </span>
      <div className={styles.body}>
        <span className={styles.name}>{name}</span>
        <span className={styles.meta}>{meta}</span>
      </div>
      {actionLabel && (
        <Button variant={actionVariant} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default DeviceRow;
