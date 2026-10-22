import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import { formatNumber } from '../../utils/format';
import ActivityChartCard from './components/ActivityChartCard';
import RecentWorkoutsCard from './components/RecentWorkoutsCard';
import RingsCard from './components/RingsCard';
import WeeklyGoalCard from './components/WeeklyGoalCard';
import {
  fetchDashboard,
  selectDashboard,
  selectDashboardError,
  selectDashboardStatus,
} from './dashboardSlice';
import styles from './DashboardPage.module.css';

const pctOf = (v, t) => (t > 0 ? Math.min(Math.round((v / t) * 100), 100) : 0);

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const dateLabel = () =>
  new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

/** Build the "today at a glance" stat cards from the composed stats. */
function buildStatCards(s) {
  return [
    {
      id: 'steps',
      label: 'Steps',
      value: formatNumber(s.steps.value),
      unit: `/ ${formatNumber(s.steps.target)}`,
      badge: `${pctOf(s.steps.value, s.steps.target)}%`,
      pct: pctOf(s.steps.value, s.steps.target),
      color: 'var(--color-ink)',
    },
    {
      id: 'active',
      label: 'Active minutes',
      value: String(s.activeMinutes.value),
      unit: `/ ${s.activeMinutes.target} min`,
      badge: `${pctOf(s.activeMinutes.value, s.activeMinutes.target)}%`,
      pct: pctOf(s.activeMinutes.value, s.activeMinutes.target),
      color: 'var(--color-orange)',
    },
    {
      id: 'calories',
      label: 'Calories burned',
      value: formatNumber(s.caloriesBurned.value),
      unit: 'kcal',
      badge: `${pctOf(s.caloriesBurned.value, s.caloriesBurned.target)}%`,
      pct: pctOf(s.caloriesBurned.value, s.caloriesBurned.target),
      color: 'var(--color-lime)',
    },
    {
      id: 'rhr',
      label: 'Resting heart rate',
      value: s.restingHr.value != null ? String(s.restingHr.value) : '—',
      unit: 'bpm',
      badge: undefined,
      pct: 0,
      color: 'var(--color-violet)',
    },
  ];
}

/** Ring legend derived from the three ring pairs. */
function buildLegend(rings) {
  return [
    { id: 'move', label: 'Move', value: `${formatNumber(rings.move[0])} / ${formatNumber(rings.move[1])} kcal`, color: 'var(--color-lime)' },
    { id: 'exercise', label: 'Exercise', value: `${rings.exercise[0]} / ${rings.exercise[1]} min`, color: 'var(--color-orange)' },
    { id: 'steps', label: 'Steps', value: `${formatNumber(rings.steps[0])} / ${formatNumber(rings.steps[1])}`, color: 'var(--color-violet)' },
  ];
}

/** Dashboard (route "/"). Composed from watch metrics, workouts and the plan. */
function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const data = useAppSelector(selectDashboard);
  const status = useAppSelector(selectDashboardStatus);
  const error = useAppSelector(selectDashboardError);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchDashboard());
  }, [status, dispatch]);

  const loading = (status === 'loading' || status === 'idle') && !data;
  const name = data?.user.name?.trim();

  return (
    <>
      <PageHeader
        eyebrow={dateLabel()}
        title={`${greeting()}${name ? `, ${name}` : ''}`}
        subtitle={
          data?.user.streakDays > 0 ? `🔥 ${data.user.streakDays}-day workout streak` : undefined
        }
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/workouts')}
            leadingIcon={<Plus size={18} strokeWidth={2.4} aria-hidden="true" />}
          >
            Log workout
          </Button>
        }
      />

      {loading && <p className={styles.state}>Loading…</p>}
      {!loading && error && (
        <p className={styles.state}>Couldn’t load your dashboard: {error}</p>
      )}

      {!loading && !error && data && (
        <>
          <section aria-label="Today at a glance" className={styles.statGrid}>
            {buildStatCards(data.stats).map((s) => (
              <StatCard key={s.id} {...s} />
            ))}
          </section>

          <section className={styles.row}>
            <ActivityChartCard week={data.week} />
            <RingsCard rings={data.rings} legend={buildLegend(data.rings)} />
          </section>

          <section className={styles.row}>
            <RecentWorkoutsCard workouts={data.recentWorkouts} />
            <WeeklyGoalCard weeklyGoal={data.weeklyGoal} />
          </section>
        </>
      )}
    </>
  );
}

export default DashboardPage;
