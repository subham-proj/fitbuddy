import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import FilterChip from '../../components/ui/FilterChip';
import WeekDayCard from '../../components/ui/WeekDayCard';
import WorkoutTemplateCard from '../../components/ui/WorkoutTemplateCard';
import {
  formatDate,
  formatDuration,
  formatKcal,
  formatVolume,
} from '../../utils/format';
// NOTE: `week` and `templates` are still mock fixtures — the weekly plan and
// saved templates are separate features, wired in a later pass. Only the
// History table below is backed by the API in this pass.
import {
  templates,
  typeChipColor,
  typeFilters,
  week,
  weekSummary,
} from '../../mock/workouts';
import LogWorkoutModal from './components/LogWorkoutModal';
import {
  fetchWorkouts,
  selectWorkouts,
  selectWorkoutsError,
  selectWorkoutsStatus,
} from './workoutsSlice';
import styles from './WorkoutsPage.module.css';

const HISTORY_COLS = 6;

/** Workouts (route "/workouts"). Plan, log, and review workouts. */
function WorkoutsPage() {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState('All');
  const [logOpen, setLogOpen] = useState(false);

  const workouts = useAppSelector(selectWorkouts);
  const status = useAppSelector(selectWorkoutsStatus);
  const error = useAppSelector(selectWorkoutsError);

  // Load the owner's logged workouts once.
  useEffect(() => {
    if (status === 'idle') dispatch(fetchWorkouts());
  }, [status, dispatch]);

  const visibleTemplates =
    filter === 'All' ? templates : templates.filter((t) => t.type === filter);

  const loading = status === 'loading' || status === 'idle';

  return (
    <>
      <PageHeader
        title="Workouts"
        subtitle="Plan your week, log a session and review what you've done."
        actions={
          <>
            <Button variant="secondary">Browse programs</Button>
            <Button
              variant="primary"
              onClick={() => setLogOpen(true)}
              leadingIcon={<Plus size={18} strokeWidth={2.4} aria-hidden="true" />}
            >
              Log workout
            </Button>
          </>
        }
      />

      <Card as="section" className={styles.weekCard}>
        <div className={styles.weekHead}>
          <h2 className={styles.h2}>This week</h2>
          <span className={styles.weekSummary}>{weekSummary}</span>
        </div>
        <div className={styles.weekGrid}>
          {week.map((d) => (
            <WeekDayCard key={d.day} {...d} />
          ))}
        </div>
      </Card>

      <section className={styles.templatesSection}>
        <div className={styles.templatesHead}>
          <h2 className={styles.h2}>Your workouts</h2>
          <div role="group" aria-label="Filter by type" className={styles.filters}>
            {typeFilters.map((f) => (
              <FilterChip key={f} selected={f === filter} onClick={() => setFilter(f)}>
                {f}
              </FilterChip>
            ))}
          </div>
        </div>
        <div className={styles.templatesGrid}>
          {visibleTemplates.map((t) => (
            <WorkoutTemplateCard
              key={t.id}
              id={t.id}
              type={t.type}
              chipColor={typeChipColor[t.type]}
              name={t.name}
              meta={t.meta}
              focus={t.focus}
              duration={t.duration}
            />
          ))}
        </div>
      </section>

      <Card as="section" className={styles.historyCard}>
        <div className={styles.historyHead}>
          <h2 className={styles.h2}>History</h2>
          <a href="#" className={styles.export}>
            Export CSV
          </a>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Workout</th>
                <th>Duration</th>
                <th>Volume</th>
                <th>Calories</th>
                <th>PRs</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={HISTORY_COLS} className={styles.cellMuted}>
                    Loading workouts…
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={HISTORY_COLS} className={styles.cellMuted}>
                    Couldn’t load workouts: {error}
                  </td>
                </tr>
              )}

              {!loading && !error && workouts.length === 0 && (
                <tr>
                  <td colSpan={HISTORY_COLS} className={styles.cellMuted}>
                    No workouts logged yet. Use “Log workout” to add your first one.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                workouts.map((w) => (
                  <tr key={w.id}>
                    <td className={styles.cellMuted}>{formatDate(w.performedAt)}</td>
                    <td className={styles.cellStrong}>{w.title}</td>
                    <td>{formatDuration(w.durationMin)}</td>
                    <td>{formatVolume(w.volumeKg)}</td>
                    <td>{formatKcal(w.caloriesBurned)}</td>
                    <td className={styles.cellStrong}>—</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      <LogWorkoutModal open={logOpen} onClose={() => setLogOpen(false)} />
    </>
  );
}

export default WorkoutsPage;
