'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function useStoreAllUtmParams() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
       if (key.startsWith("utm_") || ['fbclid', 'gclid', 'ttclid'].includes(key)) {
        params[key] = value;
      }
    });

    if (Object.keys(params).length > 0) {
      sessionStorage.setItem('utm_params', JSON.stringify(params));
    }
  }, [searchParams]);

  return null;
}
