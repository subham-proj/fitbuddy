import { useState } from 'react';

import { useAppDispatch } from '../../../app/hooks';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { toDateInputValue } from '../../../utils/format';
import { logMeasurement } from '../progressSlice';
import styles from './LogMeasurementModal.module.css';

const initialForm = () => ({
  date: toDateInputValue(),
  weightKg: '',
  bodyFatPct: '',
});

/**
 * Log a weigh-in (weight required, body fat optional). The parent remounts
 * this per open via `key`, so initial state is seeded once.
 */
function LogMeasurementModal({ open, onClose }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const close = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await dispatch(
        logMeasurement({
          date: form.date,
          weightKg: Number(form.weightKg),
          bodyFatPct: form.bodyFatPct === '' ? null : Number(form.bodyFatPct),
        }),
      ).unwrap();
      onClose();
    } catch (err) {
      setError(err.message || 'Could not log the measurement. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Log measurement">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="m-date" className={styles.label}>
            Date
          </label>
          <input
            id="m-date"
            type="date"
            className={styles.control}
            value={form.date}
            onChange={setField('date')}
            max={toDateInputValue()}
            required
          />
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label htmlFor="m-weight" className={styles.label}>
              Weight (kg)
            </label>
            <input
              id="m-weight"
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              className={styles.control}
              value={form.weightKg}
              onChange={setField('weightKg')}
              placeholder="e.g. 72.4"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="m-fat" className={styles.label}>
              Body fat (%) — optional
            </label>
            <input
              id="m-fat"
              type="number"
              min="0"
              max="100"
              step="0.1"
              inputMode="decimal"
              className={styles.control}
              value={form.bodyFatPct}
              onChange={setField('bodyFatPct')}
              placeholder="e.g. 18.2"
            />
          </div>
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
            {submitting ? 'Saving…' : 'Save measurement'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default LogMeasurementModal;
