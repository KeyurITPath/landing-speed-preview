import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { LOCAL_STORAGE_KEY } from '@/utils/constants';

// Hook to load initial state from localStorage
export const useLoadFromLocalStorage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);

        // Load auth state if it exists
        if (parsedData.auth) {
          dispatch({ type: 'auth/updateUser', payload: parsedData.auth.user });
          if (parsedData.auth.isLoggedIn) {
            dispatch({ type: 'auth/updateUser', payload: { isLoggedIn: true } });
          }
        }

        // Load defaults state if it exists
        if (parsedData.defaults) {
          if (parsedData.defaults.language) {
            dispatch({ type: 'defaults/setLanguage', payload: parsedData.defaults.language });
          }
          if (parsedData.defaults.currency) {
            dispatch({ type: 'defaults/setCurrency', payload: parsedData.defaults.currency });
          }
          if (parsedData.defaults.country) {
            dispatch({ type: 'defaults/setCountry', payload: parsedData.defaults.country });
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
  }, [dispatch]);
};
