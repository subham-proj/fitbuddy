import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  decrement,
  increment,
  reset,
  selectCount,
} from './counterSlice';

/**
 * Example component wired to the Redux store. Serves as a reference for how
 * feature components read state with `useAppSelector` and dispatch actions
 * with `useAppDispatch`.
 */
function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <div className="counter-demo">
      <h2>Redux is wired up ✅</h2>
      <div className="counter-controls">
        <button type="button" onClick={() => dispatch(decrement())}>
          −
        </button>
        <span className="counter-value">{count}</span>
        <button type="button" onClick={() => dispatch(increment())}>
          +
        </button>
      </div>
      <button type="button" onClick={() => dispatch(reset())}>
        Reset
      </button>
    </div>
  );
}

export default Counter;
