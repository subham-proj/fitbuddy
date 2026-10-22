import { Plus } from 'lucide-react';
import { useState } from 'react';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import GoalCard from '../../components/ui/GoalCard';
import MilestoneBadge from '../../components/ui/MilestoneBadge';
import SegmentedControl from '../../components/ui/SegmentedControl';
import {
  goalStatusColor,
  goalTabs,
  goals,
  mainGoal,
  milestones,
} from '../../mock/goals';
import styles from './GoalsPage.module.css';

const tabOptions = goalTabs.map((t) => ({ value: t, label: t }));

/** Goals (route "/goals"). Targets, progress and milestones. */
function GoalsPage() {
  const [tab, setTab] = useState('Active');

  const visibleGoals = goals.filter((g) =>
    tab === 'Completed' ? g.status === 'Done' : g.status !== 'Done',
  );
  const earnedCount = milestones.filter((m) => m.earned).length;

  return (
    <>
      <PageHeader
        title="Goals"
        subtitle="Set targets, track them, collect milestones."
        actions={
          <Button
            variant="primary"
            leadingIcon={<Plus size={18} strokeWidth={2.4} aria-hidden="true" />}
          >
            New goal
          </Button>
        }
      />

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.heroEyebrow}>{mainGoal.eyebrow}</span>
          <h2 className={styles.heroTitle}>{mainGoal.title}</h2>
          <span className={styles.heroDetail}>{mainGoal.detail}</span>
        </div>
        <div className={styles.heroProgress}>
          <div className={styles.heroTrack}>
            <div className={styles.heroFill} style={{ width: `${mainGoal.pct}%` }} />
          </div>
          <div className={styles.heroLabels}>
            <span>{mainGoal.start}</span>
            <span>{mainGoal.pct}%</span>
            <span>{mainGoal.target}</span>
          </div>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.listHead}>
          <h2 className={styles.h2}>All goals</h2>
          <SegmentedControl
            ariaLabel="Goal status"
            options={tabOptions}
            value={tab}
            onChange={setTab}
          />
        </div>
        <div className={styles.goalGrid}>
          {visibleGoals.map((g) => (
            <GoalCard
              key={g.id}
              area={g.area}
              title={g.title}
              progress={g.progress}
              pct={g.pct}
              due={g.due}
              status={g.status}
              barColor={goalStatusColor[g.status]}
            />
          ))}
        </div>
      </section>

      <Card as="section" className={styles.milestonesCard}>
        <div className={styles.milestonesHead}>
          <h2 className={styles.h2}>Milestones</h2>
          <span className={styles.muted}>{earnedCount} of {milestones.length} earned</span>
        </div>
        <div className={styles.milestoneGrid}>
          {milestones.map((m) => (
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
    </>
  );
}

export default GoalsPage;
