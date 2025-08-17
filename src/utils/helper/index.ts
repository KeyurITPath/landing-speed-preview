import { jwtDecode } from 'jwt-decode';
import { API } from '../../configs/env';
import { LOCAL_STORAGE_KEY } from '../../configs/constant';
import { SERVER_URL } from '@utils/constants';

export interface LogError {
  (error: unknown): void;
}

export const logError: LogError = error => {
  console.error('Error:', error);
};

export const isNotEmptyObject = (
  obj: unknown
): obj is Record<string, unknown> => {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0;
};

// Alternative function for use in contexts where cookies() is not available
export const getTokenSync = (): string | undefined => {
  if (typeof window !== 'undefined') {
    // client
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    return match?.[2];
  }
  // For server-side, return undefined if cookies() is not available
  return '';
};

export const decodeToken = (token: string | null = null) => {
  if (!token) {
    return null;
  }
  const decoded = jwtDecode(token);
  return decoded;
};

export const isTokenActive = (token: string | null = null): boolean => {
  if (!token) {
    return false;
  }
  try {
    const decoded = jwtDecode(token);
    return Boolean(decoded?.exp && decoded.exp > Date.now() / 1000);
  } catch {
    return false;
  }
};

export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Utility function to generate a random password
export const generateRandomPassword = () => {
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
  const allChars = upperCase + lowerCase + numbers + specialChars;

  interface GetRandomChar {
    (chars: string): string;
  }

  const getRandomChar: GetRandomChar = (chars: string): string =>
    chars[Math.floor(Math.random() * chars.length)];

  // Ensure the password includes at least one of each required character type
  const password = [
    getRandomChar(upperCase),
    getRandomChar(lowerCase),
    getRandomChar(numbers),
    getRandomChar(specialChars),
  ];

  // Fill the rest of the password with random characters
  for (let i = password.length; i < 8; i++) {
    password.push(getRandomChar(allChars));
  }

  // Shuffle the password to randomize character order
  return password.sort(() => Math.random() - 0.5).join('');
};

export const apiAsyncHandler = async (
  handleTry: () => Promise<unknown>,
  handleCatch?: (error: unknown) => unknown,
  handleFinally?: () => void
) => {
  try {
    const response = await handleTry();
    return response;
  } catch (error) {
    logError(error);
    if (handleCatch && typeof handleCatch === 'function') {
      return handleCatch(error);
    }
    return null;
  } finally {
    if (handleFinally && typeof handleFinally === 'function') {
      handleFinally();
    }
  }
};

export const errorHandler = (
  handleTry: () => unknown,
  handleCatch?: (error: unknown) => unknown,
  handleFinally?: () => void
) => {
  try {
    const response = handleTry();
    return response;
  } catch (error) {
    logError(error);
    if (handleCatch && typeof handleCatch === 'function') {
      return handleCatch(error);
    }
    return null;
  } finally {
    if (handleFinally && typeof handleFinally === 'function') {
      handleFinally();
    }
  }
};

export const getTotalPages = (totalData: number, limit: number) => {
  if (limit <= 0) {
    return 1;
  }

  return Math.ceil(totalData / limit);
};

export const formatListWithAnd = (arr: string[]) => {
  if (!Array.isArray(arr)) {
    return '';
  }

  const len = arr.length;

  if (len === 0) {
    return '';
  }
  if (len === 1) {
    return arr[0];
  }
  if (len === 2) {
    return `${arr[0]} and ${arr[1]}`;
  }

  // For 3 or more items
  const allButLast = arr.slice(0, -1).join(', ');
  const last = arr[len - 1];
  return `${allButLast} and ${last}`;
};

export const createFileUrl = (url = ''): string => {
  if (!url) {
    return '';
  }

  const absoluteUrlRegex = /^(http|https):\/\//;

  if (absoluteUrlRegex.test(url)) {
    return url;
  }
  return `${API.URL}${url}`;
};

export const isInitialSetCookies = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('refreshToken');

    // Clear cookies
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie =
      'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie =
      'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    return true;
  }
  return false;
};


export const getLocalStorage = (key:string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
};

export const getPersistReducerState = (reducer:string) => {
    const persistedData = localStorage.getItem(`persist:${LOCAL_STORAGE_KEY}`);
    if (persistedData) {
        try {
            const state = JSON.parse(persistedData);
            return JSON.parse(state[reducer]);
        } catch (error) {
            logError(error);
            return null;
        }
    }
    return null;
};

export const scrollToSection = (id:string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};


export const getDomainName = (url = '') => {
    if (!url) return '';
    // Ensure the URL is valid
    const hostname = new URL(url).hostname; // e.g. "staging.edzen.org"
    const parts = hostname.split('.');

    // Handles domains like "staging.edzen.org" or "admin.panel.eduelle.com"
    const mainDomain = parts.length >= 2 ? parts[parts.length - 2] : parts[0];

    // Capitalize first letter
    return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
};


export const formatCurrency = (amount = 0, currencyCode = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
};

export const isEmptyArray = (arr) => {
    if (!arr) return true;
    return arr.length === 0;
};

export const isEmptyObject = (obj) => {
    if (!obj) return true;
    return Object.getOwnPropertyNames(obj).length === 0;
};


export const shouldOfferTrial = (user) => {
    const { is_user_purchased_trial, subscription_end_date } = user;

    const now = new Date();
    const subEndDate = subscription_end_date ? new Date(subscription_end_date) : null;
    const isSubscriptionExpired = subEndDate && subEndDate < now;

    // Show discount modal only if both: trial was purchased AND subscription is expired
    return is_user_purchased_trial || isSubscriptionExpired;
};

export const videoURL = (url = '') => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : SERVER_URL + url;
};
