import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import HBar from '../../components/ui/HBar';
import Heatmap from '../../components/ui/Heatmap';
import LineChart from '../../components/ui/LineChart';
import SegmentedControl from '../../components/ui/SegmentedControl';
import { formatDate, formatNumber } from '../../utils/format';
import LogMeasurementModal from './components/LogMeasurementModal';
import styles from './ProgressPage.module.css';
import {
  fetchProgress,
  selectProgress,
  selectProgressError,
  selectProgressRange,
  selectProgressStatus,
  setRange,
} from './progressSlice';

const RANGE_OPTIONS = [
  { value: '4W', label: '4W' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const signed = (n) => `${n > 0 ? '+' : ''}${n}`;

const formatVolumeKg = (kg) =>
  kg >= 1000 ? `${Math.round(kg / 100) / 10} t` : `${formatNumber(kg)} kg`;

/** Build the four summary stat cards from the composed summary. */
function buildStats(summary) {
  const { weight, bodyFat, workouts, volume } = summary;
  return [
    {
      id: 'weight',
      label: 'Body weight',
      value: weight.value != null ? `${weight.value} kg` : '—',
      delta: weight.deltaKg != null ? `${signed(weight.deltaKg)} kg in range` : 'No data yet',
    },
    {
      id: 'fat',
      label: 'Body fat',
      value: bodyFat.value != null ? `${bodyFat.value}%` : '—',
      delta:
        bodyFat.deltaPts != null ? `${signed(bodyFat.deltaPts)} pts in range` : 'No data yet',
    },
    {
      id: 'workouts',
      label: 'Workouts',
      value: String(workouts.count),
      delta: `${workouts.perWeek} per week`,
    },
    {
      id: 'volume',
      label: 'Total volume',
      value: formatVolumeKg(volume.totalKg),
      delta: volume.deltaPct != null ? `${signed(volume.deltaPct)}% vs previous` : '—',
    },
  ];
}

/** Progress (route "/progress"). Body, strength and consistency trends. */
function ProgressPage() {
  const dispatch = useAppDispatch();
  const range = useAppSelector(selectProgressRange);
  const data = useAppSelector(selectProgress);
  const status = useAppSelector(selectProgressStatus);
  const error = useAppSelector(selectProgressError);
  const [logOpen, setLogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProgress(range));
  }, [range, dispatch]);

  const loading = (status === 'loading' || status === 'idle') && !data;

  const weightValues = data?.weightSeries.values ?? [];
  const hasTrend = weightValues.length >= 2;
  const ws = data?.weightSeries;
  const weightSummary =
    ws && ws.start != null && ws.end != null
      ? `${ws.start} → ${ws.end} kg (${signed(ws.diff)} kg)`
      : 'No weigh-ins in range';

  return (
    <>
      <PageHeader
        title="Progress"
        subtitle="Body, strength and consistency trends."
        actions={
          <>
            <SegmentedControl
              ariaLabel="Time range"
              options={RANGE_OPTIONS}
              value={range}
              onChange={(v) => dispatch(setRange(v))}
            />
            <Button
              variant="primary"
              onClick={() => setLogOpen(true)}
              leadingIcon={<Plus size={18} strokeWidth={2.4} aria-hidden="true" />}
            >
              Log weight
            </Button>
          </>
        }
      />

      {loading && <p className={styles.muted}>Loading…</p>}
      {!loading && error && (
        <p className={styles.muted}>Couldn’t load progress: {error}</p>
      )}

      {!loading && !error && data && (
        <>
          <section aria-label="Summary" className={styles.statGrid}>
            {buildStats(data.summary).map((s) => (
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
                <span className={styles.muted}>{weightSummary}</span>
              </div>
              {hasTrend ? (
                <>
                  <LineChart values={weightValues} ariaLabel={`Body weight, ${weightSummary}`} />
                  <div className={styles.axis}>
                    <span>{ws.startLabel}</span>
                    <span>Today</span>
                  </div>
                </>
              ) : (
                <p className={styles.empty}>
                  Log at least two weigh-ins to see your trend. Use “Log weight”.
                </p>
              )}
            </Card>

            <Card className={styles.prCard}>
              <h2 className={styles.h2}>Personal records</h2>
              {data.prs.length === 0 ? (
                <p className={styles.empty}>
                  No records yet — log a workout with weights to set one.
                </p>
              ) : (
                <ul className={styles.prList}>
                  {data.prs.map((pr) => (
                    <li key={pr.name} className={styles.prRow}>
                      <div className={styles.prName}>
                        <span className={styles.strong}>{pr.name}</span>
                        <span className={styles.muted}>{formatDate(pr.date)}</span>
                      </div>
                      <span className={styles.prValue}>{pr.weightKg} kg</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </section>

          <section className={styles.row}>
            <Card className={styles.muscleCard}>
              <h2 className={styles.h2}>Volume by workout type</h2>
              {data.volumeByType.length === 0 ? (
                <p className={styles.empty}>No workouts logged in this range.</p>
              ) : (
                <div className={styles.muscleList}>
                  {data.volumeByType.map((v) => (
                    <HBar key={v.type} name={cap(v.type)} value={`${v.sets} sets`} pct={v.pct} />
                  ))}
                </div>
              )}
            </Card>

            <Card className={styles.heatCard}>
              <div className={styles.cardHead}>
                <h2 className={styles.h2}>Consistency</h2>
                <span className={styles.muted}>
                  Last {data.heatmap.weeks} weeks · {data.heatmap.activeDays} active days
                </span>
              </div>
              <Heatmap
                levels={data.heatmap.levels}
                ariaLabel={`Activity heatmap for the last ${data.heatmap.weeks} weeks`}
              />
            </Card>
          </section>
        </>
      )}

      <LogMeasurementModal
        key={logOpen ? 'open' : 'closed'}
        open={logOpen}
        onClose={() => setLogOpen(false)}
      />
    </>
  );
}

export default ProgressPage;
