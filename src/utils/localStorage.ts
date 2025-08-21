import { LOCAL_STORAGE_KEY } from './constants';

// Type definitions for the slices we want to persist
export interface AuthState {
  isLoggedIn: boolean;
  user: {
    subscription_type: string;
    role: any;
    token: string;
    last_login_at: any;
    consecutive_days: number;
    has_collected_reward: boolean;
    [key: string]: any;
  };
  activeUI: string;
  redirect: any;
  resetKey: any;
}

export interface DefaultsState {
  course: {
    analyticsMetaCredentials: any[];
    isFbAnalyticsCredentialsExists: boolean;
    isTiktokAnalyticsCredentialsExists: boolean;
    isTiktokAnalyticsCredentialsAPICalled: boolean;
    isFbAnalyticsCredentialsAPICalled: boolean;
  };
  language: {
    id: number;
  };
  currency: any;
  domainDetails: any;
  languages: any;
  country: any;
  domain_logo: any;
}

// Helper function to safely access localStorage only on client side
const isClient = typeof window !== 'undefined';

// Get stored state from localStorage
export const getStoredState = (): { auth?: AuthState; defaults?: DefaultsState } => {
  if (!isClient) return {};

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to parse stored state:', error);
    return {};
  }
};

// Save specific slice to localStorage
export const saveToLocalStorage = (sliceName: 'auth' | 'defaults', state: any): void => {
  if (!isClient) return;

  try {
    const currentStored = getStoredState();
    const newStored = {
      ...currentStored,
      [sliceName]: state,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStored));
  } catch (error) {
    console.warn(`Failed to save ${sliceName} to localStorage:`, error);
  }
};

// Remove specific slice from localStorage
export const removeFromLocalStorage = (sliceName: 'auth' | 'defaults'): void => {
  if (!isClient) return;

  try {
    const currentStored = getStoredState();
    delete currentStored[sliceName];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentStored));
  } catch (error) {
    console.warn(`Failed to remove ${sliceName} from localStorage:`, error);
  }
};

// Clear all stored state
export const clearStoredState = (): void => {
  if (!isClient) return;

  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear stored state:', error);
  }
};

// Throttle function to prevent excessive localStorage writes
export const throttle = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return (...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};
