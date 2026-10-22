import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import GoalCard from '../../components/ui/GoalCard';
import MilestoneBadge from '../../components/ui/MilestoneBadge';
import SegmentedControl from '../../components/ui/SegmentedControl';
import {
  fetchAchievements,
  selectAchievements,
} from './achievementsSlice';
import GoalFormModal from './components/GoalFormModal';
import {
  fetchGoals,
  selectGoals,
  selectGoalsError,
  selectGoalsStatus,
  selectPrimaryGoal,
} from './goalsSlice';
import styles from './GoalsPage.module.css';

const TAB_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Completed', label: 'Completed' },
];

/** Server status → display label, badge tone key, and bar colour. */
const STATUS_META = {
  'on-track': { label: 'On track', color: 'var(--color-ink)' },
  behind: { label: 'Behind', color: 'var(--color-orange)' },
  done: { label: 'Done', color: 'var(--color-olive)' },
};

/** Trim float noise for display (72.400000001 → 72.4, 80 → 80). */
const fmt = (n) => (Number.isInteger(n) ? n : Number(Number(n).toFixed(1)));

const withUnit = (value, unit) => `${fmt(value)}${unit ? ` ${unit}` : ''}`;

/** Goals (route "/goals"). Targets, progress and milestones. */
function GoalsPage() {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState('Active');
  const [modal, setModal] = useState(null); // { goal } | null (goal null = new)

  const goals = useAppSelector(selectGoals);
  const status = useAppSelector(selectGoalsStatus);
  const error = useAppSelector(selectGoalsError);
  const primary = useAppSelector(selectPrimaryGoal);
  const achievements = useAppSelector(selectAchievements);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchGoals());
  }, [status, dispatch]);

  // Milestones reflect workout stats; refetch on mount so they stay current.
  useEffect(() => {
    dispatch(fetchAchievements());
  }, [dispatch]);

  const loading = status === 'loading' || status === 'idle';
  const visibleGoals = goals.filter((g) =>
    tab === 'Completed' ? g.status === 'done' : g.status !== 'done',
  );
  const earnedCount = achievements.filter((m) => m.earned).length;

  return (
    <>
      <PageHeader
        title="Goals"
        subtitle="Set targets, track them, collect milestones."
        actions={
          <Button
            variant="primary"
            onClick={() => setModal({ goal: null })}
            leadingIcon={<Plus size={18} strokeWidth={2.4} aria-hidden="true" />}
          >
            New goal
          </Button>
        }
      />

      {primary && (
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.heroEyebrow}>Main goal</span>
            <h2 className={styles.heroTitle}>{primary.title}</h2>
            <span className={styles.heroDetail}>
              {withUnit(primary.currentValue, primary.unit)} now ·{' '}
              {withUnit(Math.abs(primary.targetValue - primary.currentValue), primary.unit)} to go
              {primary.due ? ` · ${primary.due}` : ''}
            </span>
          </div>
          <div className={styles.heroProgress}>
            <div className={styles.heroTrack}>
              <div className={styles.heroFill} style={{ width: `${primary.pct}%` }} />
            </div>
            <div className={styles.heroLabels}>
              <span>Start {withUnit(primary.startValue, primary.unit)}</span>
              <span>{primary.pct}%</span>
              <span>Target {withUnit(primary.targetValue, primary.unit)}</span>
            </div>
          </div>
        </section>
      )}

      <section className={styles.listSection}>
        <div className={styles.listHead}>
          <h2 className={styles.h2}>All goals</h2>
          <SegmentedControl
            ariaLabel="Goal status"
            options={TAB_OPTIONS}
            value={tab}
            onChange={setTab}
          />
        </div>

        {loading && <p className={styles.state}>Loading goals…</p>}
        {!loading && error && (
          <p className={styles.state}>Couldn’t load goals: {error}</p>
        )}
        {!loading && !error && goals.length === 0 && (
          <p className={styles.state}>
            No goals yet. Use “New goal” to set your first target.
          </p>
        )}
        {!loading && !error && goals.length > 0 && visibleGoals.length === 0 && (
          <p className={styles.state}>
            No {tab.toLowerCase()} goals.
          </p>
        )}

        <div className={styles.goalGrid}>
          {!loading &&
            !error &&
            visibleGoals.map((g) => {
              const meta = STATUS_META[g.status] ?? STATUS_META['on-track'];
              return (
                <GoalCard
                  key={g.id}
                  area={g.area}
                  title={g.title}
                  progress={`${withUnit(g.currentValue, g.unit)} / ${fmt(g.targetValue)}`}
                  pct={g.pct}
                  due={g.due}
                  status={meta.label}
                  barColor={meta.color}
                  onClick={() => setModal({ goal: g })}
                />
              );
            })}
        </div>
      </section>

      <Card as="section" className={styles.milestonesCard}>
        <div className={styles.milestonesHead}>
          <h2 className={styles.h2}>Milestones</h2>
          <span className={styles.muted}>
            {earnedCount} of {achievements.length} earned
          </span>
        </div>
        <div className={styles.milestoneGrid}>
          {achievements.map((m) => (
            <MilestoneBadge
              key={m.id}
              mark={m.mark}
              name={m.name}
              note={m.note}
              earned={m.earned}
            />
          ))}
        </div>
      </Card>

      <GoalFormModal
        key={modal ? (modal.goal?.id ?? 'new') : 'closed'}
        open={modal !== null}
        onClose={() => setModal(null)}
        goal={modal?.goal ?? null}
      />
    </>
  );
}

export default GoalsPage;
