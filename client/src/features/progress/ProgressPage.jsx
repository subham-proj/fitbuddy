import { useState } from 'react';

import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import HBar from '../../components/ui/HBar';
import Heatmap from '../../components/ui/Heatmap';
import LineChart from '../../components/ui/LineChart';
import SegmentedControl from '../../components/ui/SegmentedControl';
import {
  heatmapLevels,
  muscleVolume,
  personalRecords,
  rangeOptions,
  summaryStats,
  weightSeries,
} from '../../mock/progress';
import styles from './ProgressPage.module.css';

/** Progress (route "/progress"). Body, strength and consistency trends. */
function ProgressPage() {
  const [range, setRange] = useState('3M');

  const series = weightSeries(range);
  const stats = summaryStats(range);

  return (
    <>
      <PageHeader
        title="Progress"
        subtitle="Body, strength and consistency trends."
        actions={
          <SegmentedControl
            ariaLabel="Time range"
            options={rangeOptions}
            value={range}
            onChange={setRange}
          />
        }
      />

      <section aria-label="Summary" className={styles.statGrid}>
        {stats.map((s) => (
          <Card key={s.id} className={styles.statCard}>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statDelta}>{s.delta}</span>
          </Card>
        ))}
      </section>

      <section className={styles.row}>
        <Card className={styles.chartCard}>
          <div className={styles.cardHead}>
            <h2 className={styles.h2}>Body weight</h2>
            <span className={styles.muted}>{series.summary}</span>
          </div>
          <LineChart values={series.values} ariaLabel={series.ariaLabel} />
          <div className={styles.axis}>
            <span>{series.startLabel}</span>
            <span>Today</span>
          </div>
        </Card>

        <Card className={styles.prCard}>
          <h2 className={styles.h2}>Personal records</h2>
          <ul className={styles.prList}>
            {personalRecords.map((pr) => (
              <li key={pr.id} className={styles.prRow}>
                <div className={styles.prName}>
                  <span className={styles.strong}>{pr.name}</span>
                  <span className={styles.muted}>{pr.when}</span>
                </div>
                <span className={styles.prValue}>{pr.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className={styles.row}>
        <Card className={styles.muscleCard}>
          <h2 className={styles.h2}>Weekly volume by muscle group</h2>
          <div className={styles.muscleList}>
            {muscleVolume.map((m) => (
              <HBar key={m.name} name={m.name} value={`${m.sets} sets`} pct={m.pct} />
            ))}
          </div>
        </Card>

        <Card className={styles.heatCard}>
          <div className={styles.cardHead}>
            <h2 className={styles.h2}>Consistency</h2>
            <span className={styles.muted}>Last 12 weeks · 46 active days</span>
          </div>
          <Heatmap
            levels={heatmapLevels}
            ariaLabel="Activity heatmap for the last 12 weeks"
          />
        </Card>
      </section>
    </>
  );
}

export default ProgressPage;
