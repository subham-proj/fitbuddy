import { useState } from 'react';

import BarChart7Day from '../../../components/ui/BarChart7Day';
import Card from '../../../components/ui/Card';
import SegmentedControl from '../../../components/ui/SegmentedControl';
import styles from './ActivityChartCard.module.css';

const METRIC_OPTIONS = [
  { value: 'minutes', label: 'Active min' },
  { value: 'steps', label: 'Steps' },
  { value: 'kcal', label: 'Calories' },
];

const METRIC_META = {
  minutes: { label: 'Active min', unit: 'min' },
  steps: { label: 'Steps', unit: 'steps' },
  kcal: { label: 'Calories', unit: 'kcal' },
};

const formatValue = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

/**
 * "Last 7 days" chart with a metric toggle. The week series is supplied by the
 * dashboard; the metric selection is local UI state.
 *
 * @param {object} props
 * @param {{ days: string[], minutes: number[], steps: number[], kcal: number[] }} props.week
 */
function ActivityChartCard({ week }) {
  const [metric, setMetric] = useState('minutes');
  const values = week[metric] ?? [];
  const meta = METRIC_META[metric];

  const data = week.days.map((day, i) => ({ day, value: values[i] ?? 0 }));
  const total = values.reduce((a, b) => a + b, 0);
  const avg = values.length ? Math.round(total / values.length) : 0;
  const summary = `Avg ${formatValue(avg)} ${meta.unit} per day · ${formatValue(total)} total`;
  const chartLabel = `${meta.label} for the last 7 days: ${values.join(', ')}`;

  return (
    <Card className={styles.card}>
      <div className={styles.head}>
        <div className={styles.titles}>
          <h2 className={styles.title}>Last 7 days</h2>
          <span className={styles.summary}>{summary}</span>
        </div>
        <SegmentedControl
          ariaLabel="Metric"
          options={METRIC_OPTIONS}
          value={metric}
          onChange={setMetric}
        />
      </div>
      <BarChart7Day data={data} format={formatValue} ariaLabel={chartLabel} />
    </Card>
  );
}

export default ActivityChartCard;
