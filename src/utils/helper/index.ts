import { jwtDecode, JwtPayload } from 'jwt-decode';
import { LOCAL_STORAGE_KEY, SECRET_KEY, SERVER_URL } from '@utils/constants';
import moment from 'moment';

interface CustomJwtPayload extends JwtPayload {
  token: string;
  [key: string]: any;
}

const isFunction = (fn: any) => typeof fn === 'function';

const isTokenActive = (token = '') => {
  if (!token) return false;
  const decoded = jwtDecode(token);
  return decoded?.exp && decoded.exp > Date.now() / 1000;
};

const scrollToSection = (id = '') => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const decodeToken = (token = ''): CustomJwtPayload | false => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    if (decoded?.exp && decoded.exp <= Date.now() / 1000) {
      return false;
    }
    return { ...decoded, token };
  } catch (error) {
    // Invalid token
    return false;
  }
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getOnlyImage = (fileType = '') => {
  return fileType.substring(0, fileType.lastIndexOf('/') + 1) === 'image/';
};

const toCapitalCase = (string = '') => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
};

const toLowerCase = (string = '') => {
  if (!string) return '';
  const clone = string?.split('');
  return clone.map(val => val.toLowerCase()).join('');
};

const isEmptyObject = (obj: any) => {
  if (!obj) return true;
  return Object.getOwnPropertyNames(obj).length === 0;
};

const getFileName = (value = '') => {
  if (!value) return '';
  const fileName = value.replace(/^.*[\\/]/, '');
  return fileName;
};

const encrypt = (data: any) => {
  if (!data) return null;
  const text = JSON.stringify(data).concat(SECRET_KEY || '');
  return btoa(text);
};

const decrypt = (text = '') => {
  try {
    if (!text || !SECRET_KEY) return null;

    let decoded = atob(text);

    if (decoded.includes(SECRET_KEY)) {
      decoded = decoded.replace(SECRET_KEY, '');
    }

    decoded = decoded.replace(/undefined/g, '');
    return JSON.parse(decoded);
  } catch (error) {
    console.error(
      'Decryption error:',
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
};

const swapKeys = (obj = {}) => {
  if (isEmptyObject(obj)) return {};
  const clone = { ...obj };
  return Object.fromEntries(
    Object.entries(clone).map(([key, val]) => [val, key])
  );
};

const formatCurrency = (amount = 0, currencyCode = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getActualPrice = (price = 0, discount = 0) => {
  const calculatedDiscount = 100 - discount;
  const actualPrice = (price / calculatedDiscount) * 100 || 0;

  return actualPrice;
};

const getVideoType = (url = '') => {
  if (!url) return 'video/mp4';
  return url.toLowerCase().endsWith('.m3u8')
    ? 'application/x-mpegURL'
    : 'video/mp4';
};

const isHLS = (url = '') => {
  if (!url) return false;
  const hlsRegex = /\.(m3u8|m3u)/i;
  return hlsRegex.test(url);
};

const lineClamp = (lines = 1) => ({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  WebkitLineClamp: lines,
  textOverflow: 'ellipsis',
});

const getLocalStorage = (key = '') => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const resolveUrl = (url = '') => {
  const BASE_URL = SERVER_URL || 'http://localhost:3000';
  const absoluteUrlRegex = /^(http|https):\/\//;

  if (absoluteUrlRegex.test(url)) {
    return url;
  }

  const normalizedBaseUrl = BASE_URL.endsWith('/')
    ? BASE_URL.slice(0, -1)
    : BASE_URL;
  const normalizedUrl = url?.startsWith('/') ? url : `/${url}`;

  return `${normalizedBaseUrl}${normalizedUrl}`;
};

const getRandomImage = (height = 1920, width = 1080) => {
  const randomDecimal = Math.random();
  return `https://picsum.photos/${height}/${width}?random=${randomDecimal}`;
};

const logError = (error: any) => {
  console.error('Error:', error);
};

const apiAsyncHandler = async (apiCall: any, handleError?: any) => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    logError(error);
    if (handleError && typeof handleError === 'function') {
      handleError(error);
    }
    return null;
  }
};

const getStoredReducerState = (reducer: string) => {
  const persistedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (persistedData) {
    try {
      const state = JSON.parse(persistedData);
      return state[reducer] || null;
    } catch (error) {
      logError(error);
      return null;
    }
  }
  return null;
};

const isEmptyArray = (arr = []) => {
  if (!arr) return true;
  return arr.length === 0;
};

export async function sha256Hash(value = '') {
  if (!value) return null;
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase()); // FB compliance
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const shouldOfferTrial = (user: any) => {
  const { is_user_purchased_trial, subscription_end_date } = user;

  const now = new Date();
  const subEndDate = subscription_end_date
    ? new Date(subscription_end_date)
    : null;
  const isSubscriptionExpired = subEndDate && subEndDate < now;

  // Show discount modal only if both: trial was purchased AND subscription is expired
  return is_user_purchased_trial || isSubscriptionExpired;
};

const getSubscriptionPayload = () => {
  const { origin, pathname } = window.location;
  return {
    success_url: `${origin}${pathname}?payment=success`,
    cancel_url: `${origin}${pathname}?payment=failed`,
  };
};

const capitalizeEachLetter = (text = '') => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const getAvatarLetter = (str1 = '', str2 = '') => {
  if (!str1 || !str2) {
    return '';
  }

  return str1.charAt(0).toUpperCase() + str2.charAt(0).toUpperCase();
};

const getAvatarInitials = (name = '') => {
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error('Invalid input: name must be a non-empty string');
  }

  const words = name.trim().split(/\s+/); // Split by whitespace

  if (words.length === 1) {
    // If there's only one word, use the first letter twice
    return words[0][0].toUpperCase() + words[0][0].toUpperCase();
  } else {
    // If there are two or more words, use the initials of the first two
    return words[0][0].toUpperCase() + words[1][0].toUpperCase();
  }
};

const getDomainName = (url = '') => {
  if (!url) return '';
  // Ensure the URL is valid
  const hostname = new URL(url).hostname; // e.g. "staging.edzen.org"
  const parts = hostname.split('.');

  // Handles domains like "staging.edzen.org" or "admin.panel.eduelle.com"
  const mainDomain = parts.length >= 2 ? parts[parts.length - 2] : parts[0];

  // Capitalize first letter
  return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
};

const isAfter24Hours = (lastLoginAt = '') => {
  if (!lastLoginAt) return false;
  return moment().diff(moment(lastLoginAt), 'hours') >= 24;
};

export const getDeviceType = () => {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

  if (/android/i.test(ua)) return 'mobile';
  if (/iPhone|iPod/.test(ua)) return 'mobile';
  if (/mobile/i.test(ua)) return 'mobile';

  return 'desktop';
};

const videoURL = (url = '') => {
  if (!url) return '';
  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : SERVER_URL + url;
};

export const debounced = (callback: any, wait = 300) => {
  let timerId: string | number | NodeJS.Timeout | null | undefined = null;
  const debouncedFunction = (...args: any[]) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      callback(...args);
    }, wait);
  };

  debouncedFunction.cancel = () => {
    if (timerId) {
      clearTimeout(timerId);
    }
  };

  return debouncedFunction;
};

const getVideoId = (url = '') => {
  if (!url) return '';
  const id = `https://player.vimeo.com${url}`;
  const updatedId = id.replace(/videos/g, 'video');
  return updatedId;
};

// Utility function to convert array to object with same key-value pairs
const arrayToKeyValueObject = (array = []) => {
  if (!array.length) return {};
  return array.reduce((acc, item) => {
    acc[item] = item;
    return acc;
  }, {});
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

export {
  getDomainName,
  isHLS,
  videoURL,
  getSubscriptionPayload,
  shouldOfferTrial,
  getVideoType,
  isFunction,
  isTokenActive,
  decodeToken,
  getOnlyImage,
  toCapitalCase,
  toLowerCase,
  isEmptyObject,
  getFileName,
  encrypt,
  decrypt,
  swapKeys,
  formatCurrency,
  lineClamp,
  getActualPrice,
  getLocalStorage,
  resolveUrl,
  getRandomImage,
  apiAsyncHandler,
  getStoredReducerState,
  logError,
  isEmptyArray,
  capitalizeEachLetter,
  getAvatarLetter,
  getAvatarInitials,
  isAfter24Hours,
  getVideoId,
  arrayToKeyValueObject,
  scrollToSection,
};
