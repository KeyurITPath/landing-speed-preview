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

    // Try to get cached languages first
    const cachedLanguages = getLanguagesFromServer(cookieStore);

    if (cachedLanguages && cachedLanguages.length > 0) {
      return cachedLanguages;
    }

    try {
      const langResponse = await fetchAllLanguages();
      const freshLanguages = langResponse?.data?.result || [];

      return freshLanguages;
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
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
      console.warn('Failed to cache languages:', error);
    }
  }
}
