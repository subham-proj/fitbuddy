import { useDispatch, useSelector } from 'react-redux';

/**
 * Pre-typed Redux hooks.
 *
 * Use these throughout the app instead of importing `useDispatch` /
 * `useSelector` directly. It keeps imports consistent and gives us a single
 * place to swap in typed versions if the project migrates to TypeScript.
 */
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
