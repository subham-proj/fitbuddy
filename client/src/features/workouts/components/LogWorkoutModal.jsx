import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { useAppDispatch } from '../../../app/hooks';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { toDateInputValue } from '../../../utils/format';
import { createWorkout } from '../workoutsSlice';
import styles from './LogWorkoutModal.module.css';

const TYPE_OPTIONS = [
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'other', label: 'Other' },
];

const emptyExercise = () => ({ name: '', sets: '', reps: '', weightKg: '' });

const initialForm = () => ({
  title: '',
  type: 'strength',
  date: toDateInputValue(),
  durationMin: '',
  caloriesBurned: '',
  notes: '',
  exercises: [emptyExercise()],
});

/** Coerce a form string to a number, treating '' as 0. */
const toNum = (v) => (v === '' ? 0 : Number(v));

/**
 * "Log workout" dialog. A workout is logged in one go — title, type, when,
 * effort and an optional list of exercises — then POSTed to the API. There is
 * no live-session tracking in this app.
 */
function LogWorkoutModal({ open, onClose }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const setExercise = (i, key) => (e) =>
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((ex, idx) =>
        idx === i ? { ...ex, [key]: e.target.value } : ex,
      ),
    }));

  const addExercise = () =>
    setForm((f) => ({ ...f, exercises: [...f.exercises, emptyExercise()] }));

  const removeExercise = (i) =>
    setForm((f) => ({
      ...f,
      exercises: f.exercises.filter((_, idx) => idx !== i),
    }));

  const close = () => {
    if (submitting) return;
    setForm(initialForm());
    setError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await dispatch(
        createWorkout({
          title: form.title.trim(),
          type: form.type,
          // Store at local noon so the date is stable across time zones.
          performedAt: new Date(`${form.date}T12:00:00`).toISOString(),
          durationMin: toNum(form.durationMin),
          caloriesBurned: toNum(form.caloriesBurned),
          notes: form.notes.trim(),
          exercises: form.exercises
            .filter((ex) => ex.name.trim())
            .map((ex) => ({
              name: ex.name.trim(),
              sets: toNum(ex.sets),
              reps: toNum(ex.reps),
              weightKg: toNum(ex.weightKg),
            })),
        }),
      ).unwrap();
      setForm(initialForm());
      onClose();
    } catch (err) {
      setError(err.message || 'Could not save the workout. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Log workout">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="w-title" className={styles.label}>
            Workout name
          </label>
          <input
            id="w-title"
            className={styles.control}
            value={form.title}
            onChange={setField('title')}
            placeholder="e.g. Upper body strength"
            required
            maxLength={200}
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="w-type" className={styles.label}>
              Type
            </label>
            <select
              id="w-type"
              className={styles.control}
              value={form.type}
              onChange={setField('type')}
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="w-date" className={styles.label}>
              Date
            </label>
            <input
              id="w-date"
              type="date"
              className={styles.control}
              value={form.date}
              onChange={setField('date')}
              max={toDateInputValue()}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="w-duration" className={styles.label}>
              Duration (min)
            </label>
            <input
              id="w-duration"
              type="number"
              min="0"
              inputMode="numeric"
              className={styles.control}
              value={form.durationMin}
              onChange={setField('durationMin')}
              placeholder="0"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="w-calories" className={styles.label}>
              Calories burned
            </label>
            <input
              id="w-calories"
              type="number"
              min="0"
              inputMode="numeric"
              className={styles.control}
              value={form.caloriesBurned}
              onChange={setField('caloriesBurned')}
              placeholder="0"
            />
          </div>
        </div>

        <fieldset className={styles.exercises}>
          <legend className={styles.label}>Exercises</legend>
          <div className={styles.exerciseHead} aria-hidden="true">
            <span>Exercise</span>
            <span>Sets</span>
            <span>Reps</span>
            <span>Kg</span>
            <span />
          </div>
          {form.exercises.map((ex, i) => (
            // eslint-disable-next-line react/no-array-index-key -- rows have no stable id before save
            <div key={i} className={styles.exerciseRow}>
              <input
                className={styles.control}
                value={ex.name}
                onChange={setExercise(i, 'name')}
                placeholder="Exercise name"
                aria-label={`Exercise ${i + 1} name`}
                maxLength={120}
              />
              <input
                type="number"
                min="0"
                inputMode="numeric"
                className={styles.control}
                value={ex.sets}
                onChange={setExercise(i, 'sets')}
                aria-label={`Exercise ${i + 1} sets`}
              />
              <input
                type="number"
                min="0"
                inputMode="numeric"
                className={styles.control}
                value={ex.reps}
                onChange={setExercise(i, 'reps')}
                aria-label={`Exercise ${i + 1} reps`}
              />
              <input
                type="number"
                min="0"
                inputMode="decimal"
                className={styles.control}
                value={ex.weightKg}
                onChange={setExercise(i, 'weightKg')}
                aria-label={`Exercise ${i + 1} weight in kg`}
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeExercise(i)}
                disabled={form.exercises.length === 1}
                aria-label={`Remove exercise ${i + 1}`}
              >
                <Trash2 size={18} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>
          ))}
          <button type="button" className={styles.addBtn} onClick={addExercise}>
            <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
            Add exercise
          </button>
        </fieldset>

        <div className={styles.field}>
          <label htmlFor="w-notes" className={styles.label}>
            Notes
          </label>
          <textarea
            id="w-notes"
            className={`${styles.control} ${styles.textarea}`}
            value={form.notes}
            onChange={setField('notes')}
            placeholder="How did it go?"
            rows={3}
            maxLength={2000}
          />
        </div>

        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}

        <div className={styles.actions}>
          <Button variant="secondary" onClick={close} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save workout'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default LogWorkoutModal;
