import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import HBar from '../../components/ui/HBar';
import MealCard from '../../components/ui/MealCard';
import WaterTracker from '../../components/ui/WaterTracker';
import { formatDayLabel, shiftIsoDate, toDateInputValue } from '../../utils/format';
import CaloriesCard from './components/CaloriesCard';
import LogFoodModal from './components/LogFoodModal';
import styles from './NutritionPage.module.css';
import {
  deleteFood,
  fetchNutritionDay,
  selectNutritionDate,
  selectNutritionDay,
  selectNutritionError,
  selectNutritionStatus,
  setDate,
  setWater,
} from './nutritionSlice';

/** Meal render order + display names + macro accent colours. */
const MEAL_ORDER = [
  { key: 'breakfast', name: 'Breakfast' },
  { key: 'lunch', name: 'Lunch' },
  { key: 'snacks', name: 'Snacks' },
  { key: 'dinner', name: 'Dinner' },
];

const MACRO_META = [
  { key: 'protein', name: 'Protein', color: 'var(--color-ink)' },
  { key: 'carbs', name: 'Carbs', color: 'var(--color-orange)' },
  { key: 'fat', name: 'Fat', color: 'var(--color-violet)' },
  { key: 'fibre', name: 'Fibre', color: 'var(--color-olive)' },
];

const pct = (value, target) =>
  target > 0 ? Math.min(Math.round((value / target) * 100), 100) : 0;

const sumKcal = (items) => items.reduce((t, it) => t + (it.calories || 0), 0);

/** Nutrition (route "/nutrition"). Calories, macros, water and meals. */
function NutritionPage() {
  const dispatch = useAppDispatch();
  const date = useAppSelector(selectNutritionDate);
  const day = useAppSelector(selectNutritionDay);
  const status = useAppSelector(selectNutritionStatus);
  const error = useAppSelector(selectNutritionError);

  const [logOpen, setLogOpen] = useState(false);
  const [logMeal, setLogMeal] = useState('breakfast');

  // Fetch whenever the viewed day changes (day nav dispatches setDate).
  useEffect(() => {
    dispatch(fetchNutritionDay(date));
  }, [date, dispatch]);

  const openLog = (meal) => {
    setLogMeal(meal);
    setLogOpen(true);
  };

  const goToDay = (delta) => dispatch(setDate(shiftIsoDate(date, delta)));

  const isToday = date === toDateInputValue();
  // Only show stale data while a refetch is in flight; a first load has none.
  const loading = status === 'loading' && !day;

  const waterGoal = day?.goals.water.goalGlasses ?? 0;
  const glassMl = day?.goals.water.glassMl ?? 250;
  const glasses = day?.water.glasses ?? 0;
  const litres = ((glasses * glassMl) / 1000).toFixed(2).replace(/0$/, '');
  const waterGoalL = (waterGoal * glassMl) / 1000;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Nutrition</h1>
          <div className={styles.dayNav}>
            <button
              type="button"
              aria-label="Previous day"
              className={styles.dayBtn}
              onClick={() => goToDay(-1)}
            >
              <ChevronLeft size={18} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <span className={styles.dayLabel}>{formatDayLabel(date)}</span>
            <button
              type="button"
              aria-label="Next day"
              className={styles.dayBtn}
              onClick={() => goToDay(1)}
              disabled={isToday}
            >
              <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => openLog('breakfast')}
          leadingIcon={<Plus size={18} strokeWidth={2.4} aria-hidden="true" />}
        >
          Log food
        </Button>
      </header>

      {loading && <p className={styles.state}>Loading…</p>}
      {!loading && error && (
        <p className={styles.state}>Couldn’t load nutrition: {error}</p>
      )}

      {!loading && !error && day && (
        <>
          <section className={styles.topRow}>
            <CaloriesCard calories={day.summary} />

            <Card className={styles.panel}>
              <h2 className={styles.h2}>Macros</h2>
              <div className={styles.macroList}>
                {MACRO_META.map((m) => {
                  const eaten = Math.round(day.summary.macros[m.key]);
                  const target = day.goals.macros[m.key];
                  return (
                    <HBar
                      key={m.key}
                      name={m.name}
                      value={`${eaten} / ${target} g`}
                      pct={pct(eaten, target)}
                      color={m.color}
                    />
                  );
                })}
              </div>
            </Card>

            <Card className={styles.panel}>
              <div className={styles.waterHead}>
                <h2 className={styles.h2}>Water</h2>
                <span className={styles.waterCount}>
                  {litres} / {waterGoalL} L
                </span>
              </div>
              <WaterTracker
                goal={waterGoal}
                logged={glasses}
                onChange={(next) => dispatch(setWater({ date, glasses: next }))}
              />
              <span className={styles.waterHint}>
                Each glass is {glassMl} ml. Tap to log.
              </span>
            </Card>
          </section>

          <section className={styles.mealsGrid}>
            {MEAL_ORDER.map(({ key, name }) => {
              const entries = day.meals[key] || [];
              const meta =
                entries.length === 0
                  ? 'Nothing logged yet'
                  : `${sumKcal(entries).toLocaleString()} kcal`;
              return (
                <MealCard
                  key={key}
                  name={name}
                  meta={meta}
                  items={entries.map((e) => ({
                    id: e.id,
                    name: e.name,
                    detail: e.detail,
                    kcal: e.calories,
                  }))}
                  onAdd={() => openLog(key)}
                  onDeleteItem={(id) => dispatch(deleteFood({ id, date }))}
                />
              );
            })}
          </section>
        </>
      )}

      <LogFoodModal
        // Remount with fresh form state (and the right preselected meal) each open.
        key={logOpen ? `${date}-${logMeal}` : 'closed'}
        open={logOpen}
        onClose={() => setLogOpen(false)}
        date={date}
        defaultMeal={logMeal}
      />
    </>
  );
}

export default NutritionPage;
