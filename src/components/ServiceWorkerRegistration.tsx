'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { PWAUtils } from '@/lib/pwa-utils';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!PWAUtils.isServiceWorkerSupported()) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('[SW] Service Worker registered:', registration);

        // Vérifier les mises à jour
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nouvelle version disponible
                toast(
                  (t) => (
                    <div className="flex flex-col gap-2">
                      <p className="font-medium">Mise à jour disponible</p>
                      <p className="text-sm text-gray-600">
                        Une nouvelle version d&apos;AliceBot est disponible
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                            window.location.reload();
                            toast.dismiss(t.id);
                          }}
                          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                        >
                          Mettre à jour
                        </button>
                        <button
                          onClick={() => toast.dismiss(t.id)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                        >
                          Plus tard
                        </button>
                      </div>
                    </div>
                  ),
                  {
                    duration: Infinity,
                    position: 'bottom-center',
                  }
                );
              }
            });
          }
        });

        // Vérifier périodiquement les mises à jour (toutes les heures)
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);

        // Écouter les messages du SW
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data?.type === 'SW_ACTIVATED') {
            console.log('[SW] Service Worker activated - Version:', event.data.version);
          }
        });

      } catch (error) {
        console.error('[SW] Service Worker registration failed:', error);
      }
    };

    const logPWAStatus = async () => {
      const appInfo = await PWAUtils.getAppInfo();
      console.log('[PWA] App Info:', appInfo);

      if (PWAUtils.isStandalone()) {
        console.log('[PWA] Running in standalone mode');
      }

      if (PWAUtils.isIOS()) {
        console.log('[PWA] Running on iOS');
      }

      if (PWAUtils.isAndroid()) {
        console.log('[PWA] Running on Android');
      }
    };

    // Enregistrer immédiatement si la page est déjà chargée
    if (document.readyState === 'complete') {
      registerServiceWorker();
      logPWAStatus();
    } else {
      // Sinon attendre le chargement
      window.addEventListener('load', () => {
        registerServiceWorker();
        logPWAStatus();
      });
    }
  }, []);

  // Gestion de la connexion/déconnexion
  useEffect(() => {
    const handleOnline = () => {
      toast.success('Connexion rétablie', {
        icon: '🌐',
        duration: 3000,
      });

      // Déclencher la synchronisation des données
      PWAUtils.requestBackgroundSync('sync-data').catch(console.error);
    };

    const handleOffline = () => {
      toast.error('Vous êtes hors ligne', {
        icon: '📡',
        duration: Infinity,
      });
    };

    // Vérifier l'état initial
    if (typeof window !== 'undefined' && !navigator.onLine) {
      handleOffline();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Gestion du changement de contrôleur (nouveau SW activé)
  useEffect(() => {
    if (!PWAUtils.isServiceWorkerSupported()) {
      return;
    }

    let refreshing = false;

    const handleControllerChange = () => {
      if (!refreshing) {
        refreshing = true;
        console.log('[SW] New Service Worker activated, reloading...');
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  return null;
}
