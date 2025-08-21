'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LANGUAGE_COOKIE, COUNTRY_COOKIE } from '@/utils/cookies';
import { LanguageService } from '@/services/language-service';

export async function changeLanguageAction(formData: FormData) {
  const languageId = formData.get('languageId') as string;
  const currentPath = formData.get('currentPath') as string || '/';

  if (!languageId) {
    throw new Error('Language ID is required');
  }
  const cookieStore = await cookies();

  cookieStore.set(LANGUAGE_COOKIE, languageId, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // Allow client-side access
  });

  try {
    const languages = await LanguageService.getLanguages();
    if (languages.length > 0) {
      await LanguageService.cacheLanguages(languages);
    }
  } catch (error) {
    console.warn('Failed to cache languages in server action:', error);
  }

  redirect(currentPath);
}

export async function changeCountryAction(formData: FormData) {
  const countryCode = formData.get('countryCode') as string;
  const currentPath = formData.get('currentPath') as string || '/';

  if (!countryCode) {
    throw new Error('Country code is required');
  }

  const cookieStore = await cookies();

  // Set the country cookie on server-side
  cookieStore.set(COUNTRY_COOKIE, countryCode, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // Allow client-side access
  });
  redirect(currentPath);
}
