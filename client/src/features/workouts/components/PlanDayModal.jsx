import { useState } from 'react';

import { useAppDispatch } from '../../../app/hooks';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Switch from '../../../components/ui/Switch';
import { removePlanDay, setPlanDay } from '../planSlice';
import styles from './PlanDayModal.module.css';

const TYPE_OPTIONS = [
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'other', label: 'Other' },
];

const formFromEntry = (entry) => ({
  isRest: entry?.isRest ?? false,
  title: entry?.title ?? '',
  type: entry?.type ?? 'strength',
  time: entry?.time ?? '',
  completed: entry?.completed ?? false,
});

/**
 * Edit one day's plan entry: a planned workout (title/type/time, done-state)
 * or a rest day. The parent remounts this per open (via `key`), so initial
 * state is taken from `entry` once in `useState`.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {string} props.date - YYYY-MM-DD
 * @param {string} props.dayLabel - human label for the dialog title
 * @param {object|null} props.entry - existing plan entry for the day, if any
 */
function PlanDayModal({ open, onClose, date, dayLabel, entry }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(() => formFromEntry(entry));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggle = (key) => () => setForm((f) => ({ ...f, [key]: !f[key] }));

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
      setPlanDay({
        date,
        data: {
          isRest: form.isRest,
          title: form.title.trim(),
          type: form.type,
          time: form.time.trim(),
          completed: form.completed,
        },
      }),
    );
  };

  return (
    <Modal open={open} onClose={close} title={`Plan — ${dayLabel}`}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.toggleRow}>
          <div>
            <span className={styles.toggleLabel}>Rest day</span>
            <span className={styles.toggleHint}>No workout planned for this day</span>
          </div>
          <Switch
            checked={form.isRest}
            onChange={toggle('isRest')}
            label="Rest day"
          />
        </div>

        {!form.isRest && (
          <>
            <div className={styles.field}>
              <label htmlFor="p-title" className={styles.label}>
                Workout name
              </label>
              <input
                id="p-title"
                className={styles.control}
                value={form.title}
                onChange={setField('title')}
                placeholder="e.g. Lower body hypertrophy"
                required
                maxLength={160}
              />
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label htmlFor="p-type" className={styles.label}>
                  Type
                </label>
                <select
                  id="p-type"
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
                <label htmlFor="p-time" className={styles.label}>
                  Time (optional)
                </label>
                <input
                  id="p-time"
                  className={styles.control}
                  value={form.time}
                  onChange={setField('time')}
                  placeholder="e.g. 6:30 PM"
                  maxLength={40}
                />
              </div>
            </div>

            <div className={styles.toggleRow}>
              <div>
                <span className={styles.toggleLabel}>Completed</span>
                <span className={styles.toggleHint}>Mark this session as done</span>
              </div>
              <Switch
                checked={form.completed}
                onChange={toggle('completed')}
                label="Completed"
              />
            </div>
          </>
        )}

        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}

        <div className={styles.actions}>
          {entry && (
            <Button
              variant="dangerOutline"
              onClick={() => run(removePlanDay(date))}
              disabled={busy}
              className={styles.clear}
            >
              Clear day
            </Button>
          )}
          <Button variant="secondary" onClick={close} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default PlanDayModal;
