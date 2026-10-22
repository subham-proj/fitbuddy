import { useState } from 'react';

import { useAppDispatch } from '../../../app/hooks';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { logFood } from '../nutritionSlice';
import styles from './LogFoodModal.module.css';

const MEAL_OPTIONS = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'dinner', label: 'Dinner' },
];

const MACRO_FIELDS = [
  { key: 'protein', label: 'Protein (g)' },
  { key: 'carbs', label: 'Carbs (g)' },
  { key: 'fat', label: 'Fat (g)' },
  { key: 'fibre', label: 'Fibre (g)' },
];

const initialForm = (meal) => ({
  meal: meal || 'breakfast',
  name: '',
  detail: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  fibre: '',
});

const toNum = (v) => (v === '' ? 0 : Number(v));

/**
 * "Log food" dialog. Adds a single food item to a meal for the given date.
 * `defaultMeal` preselects the meal when opened from a specific meal card.
 *
 * The parent remounts this via a `key` on each open, so the initial form state
 * (including the preselected meal) is set once in `useState` — no sync effect.
 */
function LogFoodModal({ open, onClose, date, defaultMeal }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(() => initialForm(defaultMeal));
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
        logFood({
          date,
          meal: form.meal,
          name: form.name.trim(),
          detail: form.detail.trim(),
          calories: toNum(form.calories),
          protein: toNum(form.protein),
          carbs: toNum(form.carbs),
          fat: toNum(form.fat),
          fibre: toNum(form.fibre),
        }),
      ).unwrap();
      onClose();
    } catch (err) {
      setError(err.message || 'Could not log the food. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Log food">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label htmlFor="f-meal" className={styles.label}>
              Meal
            </label>
            <select
              id="f-meal"
              className={styles.control}
              value={form.meal}
              onChange={setField('meal')}
            >
              {MEAL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="f-calories" className={styles.label}>
              Calories (kcal)
            </label>
            <input
              id="f-calories"
              type="number"
              min="0"
              inputMode="numeric"
              className={styles.control}
              value={form.calories}
              onChange={setField('calories')}
              placeholder="0"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="f-name" className={styles.label}>
            Food name
          </label>
          <input
            id="f-name"
            className={styles.control}
            value={form.name}
            onChange={setField('name')}
            placeholder="e.g. Chicken rice bowl"
            required
            maxLength={160}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="f-detail" className={styles.label}>
            Portion / notes
          </label>
          <input
            id="f-detail"
            className={styles.control}
            value={form.detail}
            onChange={setField('detail')}
            placeholder="e.g. 1 serving · 42 g protein"
            maxLength={200}
          />
        </div>

        <fieldset className={styles.macros}>
          <legend className={styles.label}>Macros (optional)</legend>
          <div className={styles.grid4}>
            {MACRO_FIELDS.map(({ key, label }) => (
              <div key={key} className={styles.field}>
                <label htmlFor={`f-${key}`} className={styles.macroLabel}>
                  {label}
                </label>
                <input
                  id={`f-${key}`}
                  type="number"
                  min="0"
                  inputMode="decimal"
                  className={styles.control}
                  value={form[key]}
                  onChange={setField(key)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </fieldset>

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
            {submitting ? 'Saving…' : 'Add food'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default LogFoodModal;
