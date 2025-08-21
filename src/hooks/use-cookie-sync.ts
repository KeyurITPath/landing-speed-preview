'use client';
import { useEffect } from 'react';
import { setLanguageCookie, setCountryCookie, getLanguageCookie, getCountryCookie, setLanguagesCookie, getLanguagesCookie } from '@/utils/cookies';

/**
 * Hook to sync cookies with values from server-side props
 * This ensures cookies are set on client-side if they don't exist
 */
export const useCookieSync = (serverLanguageId?: number, serverCountryCode?: string, serverLanguages?: any[]) => {
  useEffect(() => {
    // Only set cookies if they don't already exist on client-side
    const clientLanguageId = getLanguageCookie();
    const clientCountryCode = getCountryCookie();
    const clientLanguages = getLanguagesCookie();

    // Set language cookie if not exists and server provided one
    if (!clientLanguageId && serverLanguageId) {
      setLanguageCookie(serverLanguageId);
    }

    // Set country cookie if not exists and server provided one
    if (!clientCountryCode && serverCountryCode) {
      setCountryCookie(serverCountryCode);
    }

    // Set languages cache if not exists and server provided them
    if (!clientLanguages && serverLanguages && serverLanguages.length > 0) {
      setLanguagesCookie(serverLanguages);
      console.log('🍪 Client: Cached languages from server', serverLanguages.length);
    }
  }, [serverLanguageId, serverCountryCode, serverLanguages]);
};
