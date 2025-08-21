import { Middleware } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_KEY } from '@/utils/constants';

// Simple localStorage middleware
export const localStorageMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);
  
  // Only sync on client side
  if (typeof window === 'undefined') return result;
  
  const state = store.getState();
  
  // Save auth and defaults to localStorage on every relevant action
  if (action.type?.startsWith('auth/') || action.type?.startsWith('defaults/')) {
    try {
      const dataToStore = {
        auth: state.auth,
        defaults: state.defaults,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }
  
  // Clear localStorage on logout or reset
  if (action.type === 'auth/logout' || action.type === 'RESET') {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
  
  return result;
};
