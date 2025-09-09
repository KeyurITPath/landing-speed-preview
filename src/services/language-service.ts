import { cookies } from 'next/headers';
import { fetchAllLanguages } from '@/services/course-service';
import {
  getLanguagesFromServer,
  setLanguagesOnServer,
  getLanguageFromServer,
} from '@/utils/cookies';

export class LanguageService {
  static async getLanguages(): Promise<any[]> {
    const cookieStore = await cookies();

    try {
      // Try to get cached languages first
      const cachedLanguages = getLanguagesFromServer(cookieStore);
      if (cachedLanguages && cachedLanguages.length > 0) {
        return cachedLanguages;
      }

      // If no cached languages, fetch fresh ones
      const langResponse = await fetchAllLanguages();
      const freshLanguages = langResponse?.data?.result || [];

      if (freshLanguages.length > 0) {
        // Cache the languages for future use
        await setLanguagesOnServer(cookieStore, freshLanguages);
        return freshLanguages;
      }

      throw new Error('No languages available');
    } catch (error) {
      console.error('Error fetching languages:', error);
      // Return a default language array instead of empty
      return [{ id: 1, name: 'English', code: 'en' }];
    }
  }

  /**
   * Get effective language ID with proper fallback
   */
  static async getEffectiveLanguageId(): Promise<number> {
    const cookieStore = await cookies();
    const languages = await this.getLanguages();

    // Get language from cookie
    const cookieLanguageId = getLanguageFromServer(cookieStore);

    // Return cookie value or fallback to first language
    const result = cookieLanguageId || languages?.[0]?.id || 1;
    return result;
  }

  /**
   * Cache languages (to be called from server actions)
   */
  static async cacheLanguages(languages: any[]): Promise<void> {
    try {
      const cookieStore = await cookies();
      setLanguagesOnServer(cookieStore, languages);
    } catch (error) {

    }
  }
}
