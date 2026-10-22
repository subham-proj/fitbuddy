import { Plus } from 'lucide-react';
import { useState } from 'react';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import FilterChip from '../../components/ui/FilterChip';
import WeekDayCard from '../../components/ui/WeekDayCard';
import WorkoutTemplateCard from '../../components/ui/WorkoutTemplateCard';
import {
  history,
  templates,
  typeChipColor,
  typeFilters,
  week,
  weekSummary,
} from '../../mock/workouts';
import styles from './WorkoutsPage.module.css';

/** Workouts (route "/workouts"). Plan, start, and review workouts. */
function WorkoutsPage() {
  const [filter, setFilter] = useState('All');

  const visibleTemplates =
    filter === 'All' ? templates : templates.filter((t) => t.type === filter);

  return (
    <>
      <PageHeader
        title="Workouts"
        subtitle="Plan your week, start a session and review what you've done."
        actions={
          <>
            <Button variant="secondary">Browse programs</Button>
            <Button
              variant="primary"
              leadingIcon={<Plus size={18} strokeWidth={2.4} aria-hidden="true" />}
            >
              Create workout
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
              {history.map((row) => (
                <tr key={row.id}>
                  <td className={styles.cellMuted}>{row.date}</td>
                  <td className={styles.cellStrong}>{row.name}</td>
                  <td>{row.duration}</td>
                  <td>{row.volume}</td>
                  <td>{row.kcal}</td>
                  <td className={styles.cellStrong}>{row.prs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

export default WorkoutsPage;
