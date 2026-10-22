import Button from './Button';
import styles from './DeviceRow.module.css';

/**
 * Connected-device row: initials tile, name + sync status, and a connect or
 * disconnect action.
 *
 * @param {object} props
 * @param {string} props.initials
 * @param {string} props.name
 * @param {string} props.meta
 * @param {boolean} props.connected
 */
function DeviceRow({ initials, name, meta, connected }) {
  return (
    <div className={styles.row}>
      <span className={styles.tile} aria-hidden="true">
        {initials}
      </span>
      <div className={styles.body}>
        <span className={styles.name}>{name}</span>
        <span className={styles.meta}>{meta}</span>
      </div>
      <Button variant={connected ? 'secondary' : 'dark'}>
        {connected ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  );
}

export default DeviceRow;
