import Cookies from 'js-cookie';

// Cookie names
export const LANGUAGE_COOKIE = 'language_id';
export const COUNTRY_COOKIE = 'country_code';
export const LANGUAGES_COOKIE = 'languages';


// Cookie options
const COOKIE_OPTIONS = {
  expires: 365, // 1 year
  sameSite: 'lax' as const,
  secure: false, // Force false for localhost development
};

// =======================
// CLIENT-SIDE FUNCTIONS (using js-cookie)
// =======================

/**
 * Set language ID in cookie (client-side)
 */
export const setLanguageCookie = (languageId: number | string) => {
  Cookies.set(LANGUAGE_COOKIE, String(languageId), COOKIE_OPTIONS);
};

/**
 * Get language ID from cookie (client-side)
 */
export const getLanguageCookie = (): number | null => {
  const value = Cookies.get(LANGUAGE_COOKIE);
  return value ? parseInt(value, 10) : null;
};

/**
 * Set country code in cookie (client-side)
 */
export const setCountryCookie = (countryCode: string) => {
  Cookies.set(COUNTRY_COOKIE, countryCode, COOKIE_OPTIONS);
};

/**
 * Get country code from cookie (client-side)
 */
export const getCountryCookie = (): string | null => {
  return Cookies.get(COUNTRY_COOKIE) || null;
};

/**
 * Set languages array in cookie (client-side)
 */
export const setLanguagesCookie = (languages: any[]) => {
  try {
    const languagesJson = JSON.stringify(languages);
    Cookies.set(LANGUAGES_COOKIE, languagesJson, COOKIE_OPTIONS);
  } catch (error) {
    console.warn('Failed to set languages cookie:', error);
  }
};

/**
 * Get languages array from cookie (client-side)
 */
export const getLanguagesCookie = (): any[] | null => {
  try {
    const value = Cookies.get(LANGUAGES_COOKIE);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
};

// =======================
// SERVER-SIDE FUNCTIONS (using Next.js cookies)
// =======================

/**
 * Get language ID from cookie (server-side)
 */
export const getLanguageFromServer = (cookieStore: any): number | null => {
  const cookie = cookieStore.get(LANGUAGE_COOKIE);
  const value = cookie?.value ? parseInt(cookie.value, 10) : null;
  return value;
};

/**
 * Get country code from cookie (server-side)
 */
export const getCountryFromServer = (cookieStore: any): string | null => {
  const cookie = cookieStore.get(COUNTRY_COOKIE);
  return cookie?.value || null;
};

/**
 * Set language ID cookie (server-side) - for API routes
 */
export const setLanguageOnServer = (cookieStore: any, languageId: number | string) => {
  cookieStore.set(LANGUAGE_COOKIE, String(languageId), {
    maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
};

/**
 * Set country code cookie (server-side) - for API routes
 */
export const setCountryOnServer = (cookieStore: any, countryCode: string) => {
  cookieStore.set(COUNTRY_COOKIE, countryCode, {
    maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
};

/**
 * Get languages array from cookie (server-side)
 */
export const getLanguagesFromServer = (cookieStore: any): any[] | null => {
  try {
    const cookie = cookieStore.get(LANGUAGES_COOKIE);
    return cookie?.value ? JSON.parse(cookie.value) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Set languages array cookie (server-side) - for API routes
 */
export const setLanguagesOnServer = (cookieStore: any, languages: any[]) => {
  try {
    const languagesJson = JSON.stringify(languages);
    cookieStore.set(LANGUAGES_COOKIE, languagesJson, {
      maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  } catch (error) {
    console.warn('Failed to set languages cookie on server:', error);
  }
};

export const getEffectiveLanguageId = (
  cookieStore: any,
  languages: any[] = [],
  isServer = false
): number => {
  let languageId: number | null = null;

  if (isServer) {
    languageId = getLanguageFromServer(cookieStore);
  } else {
    languageId = getLanguageCookie();
  }

  const fallback = languages?.[0]?.id || 1;
  const result = languageId || fallback;

  return result;
};

export const getEffectiveCountryCode = (
  cookieStore: any,
  defaultCountry = 'US',
  isServer = false
): string => {
  let countryCode: string | null = null;

  if (isServer) {
    countryCode = getCountryFromServer(cookieStore);
  } else {
    countryCode = getCountryCookie();
  }

  return countryCode || defaultCountry;
};

/**
 * Get languages from cache with fallback to API
 */
export const getEffectiveLanguages = (
  cookieStore: any,
  freshLanguages: any[] = [],
  isServer = false
): any[] => {
  let cachedLanguages: any[] | null = null;

  // Try to get cached languages from cookies
  if (isServer) {
    cachedLanguages = getLanguagesFromServer(cookieStore);
  } else {
    cachedLanguages = getLanguagesCookie();
  }

  // If we have fresh languages from API, cache them and return
  if (freshLanguages && freshLanguages.length > 0) {
    // Only cache on client-side (server components can't set cookies)
    if (!isServer) {
      setLanguagesCookie(freshLanguages);
    }
    return freshLanguages;
  }

  // Return cached languages or empty array
  return cachedLanguages || [];
};
