'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { loadFromStorage } from '@/store/slices/authSlice';
import { fetchConfig } from '@/store/slices/configSlice';
import { fetchUnreadCount } from '@/store/slices/notificationsSlice';
import { AppConfigProvider } from '@/components/AppConfigProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Charger les données de session
    store.dispatch(loadFromStorage());
    store.dispatch(fetchConfig());

    // Charger le compteur de notifications uniquement si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (token) {
      store.dispatch(fetchUnreadCount());
      const interval = setInterval(() => {
        store.dispatch(fetchUnreadCount());
      }, 30000);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <Provider store={store}>
      <AppConfigProvider>
        {children}
      </AppConfigProvider>
    </Provider>
  );
}
