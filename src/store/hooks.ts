import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Hooks Redux typés pour TypeScript
 * Utilisez ces hooks au lieu de useDispatch et useSelector standards
 */

// Hook useDispatch typé
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Hook useSelector typé
export const useAppSelector = useSelector.withTypes<RootState>();
