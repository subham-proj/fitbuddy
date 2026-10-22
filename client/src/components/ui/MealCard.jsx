import { Plus, X } from 'lucide-react';

import styles from './MealCard.module.css';

/**
 * A meal with its logged food items. When no items are logged, renders an
 * empty (dashed) state with a prominent "Add" call to action.
 *
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.meta
 * @param {{ id: string, name: string, detail: string, kcal: number }[]} props.items
 * @param {() => void} [props.onAdd] - open the log-food flow for this meal
 * @param {(id: string) => void} [props.onDeleteItem] - remove a logged item
 */
function MealCard({ name, meta, items, onAdd, onDeleteItem }) {
  const empty = items.length === 0;

  if (empty) {
    return (
      <article className={`${styles.card} ${styles.empty}`}>
        <div className={styles.titleBlock}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.meta}>{meta}</span>
        </div>
        <button type="button" className={styles.addCta} onClick={onAdd}>
          Add {name.toLowerCase()}
        </button>
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <div className={styles.titleBlock}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.meta}>{meta}</span>
        </div>
        <button
          type="button"
          aria-label={`Add to ${name.toLowerCase()}`}
          className={styles.addIcon}
          onClick={onAdd}
        >
          <Plus size={18} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>
      <ul className={styles.items}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <span className={styles.itemText}>
              <b>{item.name}</b>
              {item.detail && <span className={styles.itemDetail}>{item.detail}</span>}
            </span>
            <span className={styles.itemTrailing}>
              <span className={styles.itemKcal}>{item.kcal}</span>
              {onDeleteItem && (
                <button
                  type="button"
                  className={styles.deleteItem}
                  aria-label={`Remove ${item.name}`}
                  onClick={() => onDeleteItem(item.id)}
                >
                  <X size={16} strokeWidth={2.2} aria-hidden="true" />
                </button>
              )}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default MealCard;
