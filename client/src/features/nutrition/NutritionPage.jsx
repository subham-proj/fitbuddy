import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import HBar from '../../components/ui/HBar';
import MealCard from '../../components/ui/MealCard';
import WaterTracker from '../../components/ui/WaterTracker';
import { dateLabel, macros, meals, water } from '../../mock/nutrition';
import CaloriesCard from './components/CaloriesCard';
import styles from './NutritionPage.module.css';

/** Nutrition (route "/nutrition"). Calories, macros, water and meals. */
function NutritionPage() {
  const [glassesLogged, setGlassesLogged] = useState(water.logged);

  const litres = ((glassesLogged * water.glassMl) / 1000)
    .toFixed(2)
    .replace(/0$/, '');
  const waterGoalL = (water.goal * water.glassMl) / 1000;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Nutrition</h1>
          <div className={styles.dayNav}>
            <button type="button" aria-label="Previous day" className={styles.dayBtn}>
              <ChevronLeft size={18} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <span className={styles.dayLabel}>{dateLabel}</span>
            <button type="button" aria-label="Next day" className={styles.dayBtn}>
              <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        </div>
        <Button
          variant="primary"
          leadingIcon={<Plus size={18} strokeWidth={2.4} aria-hidden="true" />}
        >
          Log food
        </Button>
      </header>

      <section className={styles.topRow}>
        <CaloriesCard />

        <Card className={styles.panel}>
          <h2 className={styles.h2}>Macros</h2>
          <div className={styles.macroList}>
            {macros.map((m) => (
              <HBar key={m.name} name={m.name} value={m.value} pct={m.pct} color={m.color} />
            ))}
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
            goal={water.goal}
            logged={glassesLogged}
            onChange={setGlassesLogged}
          />
          <span className={styles.waterHint}>Each glass is 250 ml. Tap to log.</span>
        </Card>
      </section>

      <section className={styles.mealsGrid}>
        {meals.map((meal) => (
          <MealCard key={meal.name} name={meal.name} meta={meal.meta} items={meal.items} />
        ))}
      </section>
    </>
  );
}

export default NutritionPage;
