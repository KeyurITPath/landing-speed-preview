import { getRequestConfig } from 'next-intl/server';
import { LanguageService } from '../services/language-service';
import { SERVER_URL } from '@/utils/constants';

const LANGUAGE_URLS: Record<string, string> = {
  en: SERVER_URL + '/languages/en.json',
  fr: SERVER_URL + '/languages/fr.json',
  es: SERVER_URL + '/languages/es.json',
};

export default getRequestConfig(async () => {

  const languages = await LanguageService.getLanguages();

  const localeCode = await LanguageService.getEffectiveLanguageId();
  const locale = languages.find(lang => lang.id === localeCode)?.code || 'en';

  // Fetch the JSON from remote URL
  const response = await fetch(LANGUAGE_URLS[locale]);
  if (!response.ok) {
    throw new Error(`Failed to fetch language file for ${locale}`);
  }
  const messages = await response.json();
  return { locale, messages };
});
