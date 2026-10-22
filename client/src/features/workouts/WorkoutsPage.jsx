import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import WeekDayCard from '../../components/ui/WeekDayCard';
import {
  formatDate,
  formatDuration,
  formatKcal,
  formatVolume,
  shiftIsoDate,
  startOfWeekMonday,
  toDateInputValue,
} from '../../utils/format';
import LogWorkoutModal from './components/LogWorkoutModal';
import PlanDayModal from './components/PlanDayModal';
import {
  fetchPlan,
  selectPlanItems,
  selectPlanStatus,
} from './planSlice';
import {
  fetchWorkouts,
  selectWorkouts,
  selectWorkoutsError,
  selectWorkoutsStatus,
} from './workoutsSlice';
import styles from './WorkoutsPage.module.css';

const HISTORY_COLS = 6;

/** Local Date from a "YYYY-MM-DD" string (no UTC shift). */
function isoToDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Derive a WeekDayCard's status/name/label from its plan entry. */
function deriveDay(iso, entry, today) {
  if (!entry) return { status: 'empty', name: 'Add plan', statusLabel: '' };
  if (entry.isRest) return { status: 'rest', name: 'Rest', statusLabel: 'Rest day' };

  const name = entry.title || 'Workout';
  if (entry.completed) return { status: 'done', name, statusLabel: 'Done' };
  if (iso === today) {
    return { status: 'today', name, statusLabel: entry.time ? `Today · ${entry.time}` : 'Today' };
  }
  return { status: 'planned', name, statusLabel: entry.time ? `Planned · ${entry.time}` : 'Planned' };
}

/** Workouts (route "/workouts"). Plan your week, log a session and review it. */
function WorkoutsPage() {
  const dispatch = useAppDispatch();
  const [logOpen, setLogOpen] = useState(false);
  const [planDay, setPlanDay] = useState(null); // { date, label, entry } | null

  const workouts = useAppSelector(selectWorkouts);
  const status = useAppSelector(selectWorkoutsStatus);
  const error = useAppSelector(selectWorkoutsError);
  const planItems = useAppSelector(selectPlanItems);
  const planStatus = useAppSelector(selectPlanStatus);

  const today = toDateInputValue();
  // Seven ISO dates for the current week, Monday → Sunday.
  const weekDates = useMemo(() => {
    const monday = startOfWeekMonday(today);
    return Array.from({ length: 7 }, (_, i) => shiftIsoDate(monday, i));
  }, [today]);

  // Load logged workouts (once) and this week's plan.
  useEffect(() => {
    if (status === 'idle') dispatch(fetchWorkouts());
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(fetchPlan({ from: weekDates[0], to: weekDates[6] }));
  }, [dispatch, weekDates]);

  const planByDate = useMemo(() => {
    const map = new Map();
    for (const entry of planItems) map.set(entry.date, entry);
    return map;
  }, [planItems]);

  const weekSummary = useMemo(() => {
    const planned = weekDates
      .map((iso) => planByDate.get(iso))
      .filter((e) => e && !e.isRest);
    if (planned.length === 0) return 'No sessions planned';
    const done = planned.filter((e) => e.completed).length;
    return `${done} of ${planned.length} planned sessions done`;
  }, [weekDates, planByDate]);

  const loading = status === 'loading' || status === 'idle';

  return (
    <>
      <PageHeader
        title="Workouts"
        subtitle="Plan your week, log a session and review what you've done."
        actions={
          <Button
            variant="primary"
            onClick={() => setLogOpen(true)}
            leadingIcon={<Plus size={18} strokeWidth={2.4} aria-hidden="true" />}
          >
            Log workout
          </Button>
        }
      />

      <Card as="section" className={styles.weekCard}>
        <div className={styles.weekHead}>
          <h2 className={styles.h2}>This week</h2>
          <span className={styles.weekSummary}>
            {planStatus === 'loading' && planItems.length === 0 ? '…' : weekSummary}
          </span>
        </div>
        <div className={styles.weekGrid}>
          {weekDates.map((iso) => {
            const dt = isoToDate(iso);
            const entry = planByDate.get(iso) || null;
            const derived = deriveDay(iso, entry, today);
            return (
              <WeekDayCard
                key={iso}
                day={dt.toLocaleDateString('en-GB', { weekday: 'short' })}
                date={String(dt.getDate())}
                {...derived}
                onClick={() =>
                  setPlanDay({
                    date: iso,
                    label: dt.toLocaleDateString('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short',
                    }),
                    entry,
                  })
                }
              />
            );
          })}
        </div>
      </Card>

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

      <PlanDayModal
        // Remount per open so the form seeds from the day's current entry.
        key={planDay ? planDay.date : 'closed'}
        open={planDay !== null}
        onClose={() => setPlanDay(null)}
        date={planDay?.date}
        dayLabel={planDay?.label}
        entry={planDay?.entry ?? null}
      />
    </>
  );
}

export default WorkoutsPage;
