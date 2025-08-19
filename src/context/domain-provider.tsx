'use client';
import { createContext, useContext } from 'react';

const DomainContext = createContext<any>(null);

export default function DomainProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: any;
}) {
  return (
    <DomainContext.Provider value={value}>{children}</DomainContext.Provider>
  );
}

export function useDomain() {
  return useContext(DomainContext);
}
