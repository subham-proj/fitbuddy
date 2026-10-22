import styles from './BarChart7Day.module.css';

const CHART_HEIGHT = 170; // max bar pixel height (matches design)

/**
 * Seven-day bar chart. The last bar is treated as "today" and highlighted.
 *
 * @param {object} props
 * @param {{ day: string, value: number }[]} props.data
 * @param {(value: number) => string} [props.format] - value label formatter
 * @param {string} props.ariaLabel - describes the series for screen readers
 */
function BarChart7Day({ data, format = (v) => String(v), ariaLabel }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const lastIndex = data.length - 1;

  return (
    <div role="img" aria-label={ariaLabel} className={styles.chart}>
      {data.map((d, i) => {
        const isToday = i === lastIndex;
        const height = Math.max(6, Math.round((d.value / max) * CHART_HEIGHT));
        return (
          <div key={d.day} className={styles.column}>
            <span className={styles.value}>{format(d.value)}</span>
            <div
              className={`${styles.bar} ${isToday ? styles.today : ''}`}
              style={{ height }}
            />
            <span className={`${styles.day} ${isToday ? styles.dayToday : ''}`}>
              {d.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default BarChart7Day;
