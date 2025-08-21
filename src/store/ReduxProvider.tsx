'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import LocalStorageLoader from '@/components/LocalStorageLoader';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <LocalStorageLoader>
        {children}
      </LocalStorageLoader>
    </Provider>
  );
}
