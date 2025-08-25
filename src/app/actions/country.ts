'use server';
import { cookies } from 'next/headers';
import { COUNTRY_COOKIE } from '@/utils/cookies';
import { fetchCountryCodeHandler } from '@/services/course-service';

export async function getAndSetCountryCode() {
  const cookieStore = await cookies();
  const country_code = await fetchCountryCodeHandler();
  return country_code;
}
