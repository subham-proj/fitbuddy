import { useState } from 'react';

import { useAppDispatch } from '../../../app/hooks';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Switch from '../../../components/ui/Switch';
import { deleteGoal, saveGoal } from '../goalsSlice';
import styles from './GoalFormModal.module.css';

const AREA_OPTIONS = [
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'habit', label: 'Habit' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'activity', label: 'Activity' },
  { value: 'recovery', label: 'Recovery' },
  { value: 'other', label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'on-track', label: 'On track' },
  { value: 'behind', label: 'Behind' },
  { value: 'done', label: 'Done' },
];

const initialForm = (goal) => ({
  area: goal?.area ?? 'strength',
  title: goal?.title ?? '',
  unit: goal?.unit ?? '',
  startValue: goal?.startValue ?? '',
  currentValue: goal?.currentValue ?? '',
  targetValue: goal?.targetValue ?? '',
  due: goal?.due ?? '',
  status: goal?.status ?? 'on-track',
  isPrimary: goal?.isPrimary ?? false,
});

const toNum = (v) => (v === '' ? 0 : Number(v));

/**
 * Create / edit a goal. The parent remounts this per open (via `key`), so
 * initial state is seeded once from `goal`. `goal` null means "new goal".
 */
function GoalFormModal({ open, onClose, goal }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(() => initialForm(goal));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const close = () => {
    if (busy) return;
    onClose();
  };

  const run = async (thunk) => {
    setError(null);
    setBusy(true);
    try {
      await dispatch(thunk).unwrap();
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    run(
      saveGoal({
        id: goal?.id,
        data: {
          area: form.area,
          title: form.title.trim(),
          unit: form.unit.trim(),
          startValue: toNum(form.startValue),
          currentValue: toNum(form.currentValue),
          targetValue: toNum(form.targetValue),
          due: form.due.trim(),
          status: form.status,
          isPrimary: form.isPrimary,
        },
      }),
    );
  };

  return (
    <Modal open={open} onClose={close} title={goal ? 'Edit goal' : 'New goal'}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="g-title" className={styles.label}>
            Goal
          </label>
          <input
            id="g-title"
            className={styles.control}
            value={form.title}
            onChange={setField('title')}
            placeholder="e.g. Bench press 90 kg"
            required
            maxLength={160}
          />
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label htmlFor="g-area" className={styles.label}>
              Area
            </label>
            <select
              id="g-area"
              className={styles.control}
              value={form.area}
              onChange={setField('area')}
            >
              {AREA_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="g-unit" className={styles.label}>
              Unit
            </label>
            <input
              id="g-unit"
              className={styles.control}
              value={form.unit}
              onChange={setField('unit')}
              placeholder="e.g. kg, reps, km"
              maxLength={20}
            />
          </div>
        </div>

        <div className={styles.grid3}>
          <div className={styles.field}>
            <label htmlFor="g-start" className={styles.label}>
              Start
            </label>
            <input
              id="g-start"
              type="number"
              inputMode="decimal"
              className={styles.control}
              value={form.startValue}
              onChange={setField('startValue')}
              placeholder="0"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="g-current" className={styles.label}>
              Current
            </label>
            <input
              id="g-current"
              type="number"
              inputMode="decimal"
              className={styles.control}
              value={form.currentValue}
              onChange={setField('currentValue')}
              placeholder="0"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="g-target" className={styles.label}>
              Target
            </label>
            <input
              id="g-target"
              type="number"
              inputMode="decimal"
              className={styles.control}
              value={form.targetValue}
              onChange={setField('targetValue')}
              placeholder="0"
            />
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label htmlFor="g-due" className={styles.label}>
              Due (optional)
            </label>
            <input
              id="g-due"
              className={styles.control}
              value={form.due}
              onChange={setField('due')}
              placeholder="e.g. 15 Dec, Weekly"
              maxLength={40}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="g-status" className={styles.label}>
              Status
            </label>
            <select
              id="g-status"
              className={styles.control}
              value={form.status}
              onChange={setField('status')}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <span className={styles.toggleLabel}>Primary goal</span>
            <span className={styles.toggleHint}>Feature this at the top of the page</span>
          </div>
          <Switch
            checked={form.isPrimary}
            onChange={() => setForm((f) => ({ ...f, isPrimary: !f.isPrimary }))}
            label="Primary goal"
          />
        </div>

        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}

        <div className={styles.actions}>
          {goal && (
            <Button
              variant="dangerOutline"
              onClick={() => run(deleteGoal(goal.id))}
              disabled={busy}
              className={styles.delete}
            >
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={close} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default GoalFormModal;
