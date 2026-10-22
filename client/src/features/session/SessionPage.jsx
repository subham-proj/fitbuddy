import { ChevronLeft, Pause } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import ExerciseListItem from '../../components/ui/ExerciseListItem';
import RestTimer from '../../components/ui/RestTimer';
import SetRow from '../../components/ui/SetRow';
import {
  currentExercise,
  doneCount,
  exercises,
  session,
  sets as initialSets,
  totalExercises,
} from '../../mock/session';
import styles from './SessionPage.module.css';

/**
 * Live workout session (route "/workouts/session/:id"). Focus mode — a
 * standalone dark screen rendered outside the AppShell (no sidebar).
 */
function SessionPage() {
  const [setsDone, setSetsDone] = useState(() => initialSets.map((s) => s.done));

  const doneSets = setsDone.filter(Boolean).length;
  const allLogged = doneSets === initialSets.length;

  const toggleSet = (i) =>
    setSetsDone((prev) => prev.map((d, idx) => (idx === i ? !d : d)));

  const restLabel = allLogged ? 'All sets logged' : `Rest before set ${doneSets + 1}`;
  const restValue = allLogged ? 'Nice work' : '1:12';

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headLeft}>
            <Link to="/workouts" aria-label="Back to workouts" className={styles.back}>
              <ChevronLeft size={20} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <div className={styles.headTitle}>
              <span className={styles.eyebrow}>Live session</span>
              <span className={styles.sessionName}>{session.name}</span>
            </div>
          </div>
          <div className={styles.headRight}>
            <span className={styles.elapsed}>{session.elapsed}</span>
            <button type="button" aria-label="Pause" className={styles.pause}>
              <Pause size={18} fill="var(--color-on-dark)" stroke="var(--color-on-dark)" aria-hidden="true" />
            </button>
            <button type="button" className={styles.finish}>
              Finish
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.layout}>
          <aside aria-label="Exercises" className={styles.aside}>
            <div className={styles.asideHead}>
              <h2 className={styles.asideTitle}>Exercises</h2>
              <span className={styles.muted}>
                {doneCount} of {totalExercises} done
              </span>
            </div>
            {exercises.map((ex) => (
              <ExerciseListItem
                key={ex.id}
                mark={ex.mark}
                name={ex.name}
                meta={
                  ex.status === 'current'
                    ? `${doneSets} of ${initialSets.length} sets`
                    : ex.meta
                }
                status={ex.status}
              />
            ))}
            <button type="button" className={styles.addExercise}>
              + Add exercise
            </button>
          </aside>

          <section className={styles.detail}>
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseHead}>
                <div className={styles.exerciseTitle}>
                  <span className={styles.muted}>
                    Exercise {currentExercise.index} of {currentExercise.total}
                  </span>
                  <h1 className={styles.exerciseName}>{currentExercise.name}</h1>
                  <span className={styles.muted}>{currentExercise.target}</span>
                </div>
                <div className={styles.exerciseActions}>
                  <button type="button" className={styles.ghostBtn}>Technique</button>
                  <button type="button" className={styles.ghostBtn}>History</button>
                </div>
              </div>

              <div className={styles.tableScroll}>
                <div className={styles.tableInner}>
                  <div className={styles.tableHead}>
                    <span>Set</span>
                    <span>Previous</span>
                    <span>kg</span>
                    <span>Reps</span>
                    <span className={styles.doneCol}>Done</span>
                  </div>
                  {initialSets.map((s, i) => (
                    <SetRow
                      key={s.n}
                      n={s.n}
                      previous={s.previous}
                      kg={s.kg}
                      reps={s.reps}
                      done={setsDone[i]}
                      onToggle={() => toggleSet(i)}
                    />
                  ))}
                </div>
              </div>
              <button type="button" className={styles.addSet}>+ Add set</button>
            </div>

            <div className={styles.lowerRow}>
              <RestTimer label={restLabel} value={restValue} />
              <div className={styles.notesCard}>
                <label htmlFor="notes" className={styles.notesLabel}>
                  Session notes
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  placeholder="How did it feel?"
                  className={styles.notes}
                />
              </div>
            </div>

            <div className={styles.footerActions}>
              <button type="button" className={styles.skip}>Skip exercise</button>
              <button type="button" className={styles.next}>
                Next: {currentExercise.nextName}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default SessionPage;
