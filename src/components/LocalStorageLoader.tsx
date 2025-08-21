'use client';

import { useLoadFromLocalStorage } from '@/hooks/use-localStorage';

export default function LocalStorageLoader({ children }: { children: React.ReactNode }) {
  useLoadFromLocalStorage();
  return <>{children}</>;
}
