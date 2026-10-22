import { Plus } from 'lucide-react';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import { stats, user } from '../../mock/dashboard';
import ActivityChartCard from './components/ActivityChartCard';
import RecentWorkoutsCard from './components/RecentWorkoutsCard';
import RingsCard from './components/RingsCard';
import WeeklyGoalCard from './components/WeeklyGoalCard';
import styles from './DashboardPage.module.css';

/** Dashboard (route "/"). Reads mock fixtures; no backend wiring yet. */
function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow={user.dateLabel}
        title={`Good morning, ${user.name}`}
        actions={
          <>
            <Button variant="secondary">Connect device</Button>
            <Button
              variant="primary"
              leadingIcon={<Plus size={18} strokeWidth={2.4} aria-hidden="true" />}
            >
              Log workout
            </Button>
          </>
        }
      />

      <section aria-label="Today at a glance" className={styles.statGrid}>
        {stats.map((s) => (
          <StatCard
            key={s.id}
            label={s.label}
            value={s.value}
            unit={s.unit}
            badge={s.badge}
            pct={s.pct}
            color={s.color}
          />
        ))}
      </section>

      <section className={styles.row}>
        <ActivityChartCard />
        <RingsCard />
      </section>

      <section className={styles.row}>
        <RecentWorkoutsCard />
        <WeeklyGoalCard />
      </section>
    </>
  );
}

export default DashboardPage;
