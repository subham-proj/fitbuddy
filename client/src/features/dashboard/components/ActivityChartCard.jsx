import { useState } from 'react';

import BarChart7Day from '../../../components/ui/BarChart7Day';
import Card from '../../../components/ui/Card';
import SegmentedControl from '../../../components/ui/SegmentedControl';
import { metricOptions, weekSeries } from '../../../mock/dashboard';
import styles from './ActivityChartCard.module.css';

const formatValue = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

/**
 * "Last 7 days" chart with a metric toggle (Active min / Steps / Calories).
 * Selection is local UI state — deliberately not in Redux.
 */
function ActivityChartCard() {
  const [metric, setMetric] = useState('minutes');
  const series = weekSeries[metric];

  const data = weekSeries.days.map((day, i) => ({
    day,
    value: series.values[i],
  }));

  const total = series.values.reduce((a, b) => a + b, 0);
  const avg = Math.round(total / series.values.length);
  const summary = `Avg ${formatValue(avg)} ${series.unit} per day · ${formatValue(total)} total`;
  const chartLabel = `${series.label} for the last 7 days: ${series.values.join(', ')}`;

  return (
    <Card className={styles.card}>
      <div className={styles.head}>
        <div className={styles.titles}>
          <h2 className={styles.title}>Last 7 days</h2>
          <span className={styles.summary}>{summary}</span>
        </div>
        <SegmentedControl
          ariaLabel="Metric"
          options={metricOptions}
          value={metric}
          onChange={setMetric}
        />
      </div>
      <BarChart7Day data={data} format={formatValue} ariaLabel={chartLabel} />
    </Card>
  );
}

export default ActivityChartCard;
