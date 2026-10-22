import ActivityRings from '../../../components/ui/ActivityRings';
import Card from '../../../components/ui/Card';
import styles from './RingsCard.module.css';

/**
 * Dark emphasis card showing today's activity rings and a legend.
 *
 * @param {object} props
 * @param {{ move: number[], exercise: number[], steps: number[] }} props.rings
 * @param {{ id: string, label: string, value: string, color: string }[]} props.legend
 */
function RingsCard({ rings, legend }) {
  return (
    <Card tone="dark" className={styles.card}>
      <h2 className={styles.title}>Today's rings</h2>
      <div className={styles.ringWrap}>
        <ActivityRings move={rings.move} exercise={rings.exercise} stand={rings.steps} />
      </div>
      <ul className={styles.legend}>
        {legend.map((item) => (
          <li key={item.id} className={styles.legendRow}>
            <span className={styles.legendLabel}>
              <span className={styles.dot} style={{ background: item.color }} />
              {item.label}
            </span>
            <span className={styles.legendValue}>{item.value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default RingsCard;
