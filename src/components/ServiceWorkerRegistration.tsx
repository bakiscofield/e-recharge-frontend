'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      // Enregistrement manuel du Service Worker
      window.addEventListener('load', () => {
        registerServiceWorker();
      });
    }
  }, []);

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
                    <p className="font-medium">Mise à jour disponible !</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          newWorker.postMessage({ type: 'SKIP_WAITING' });
                          window.location.reload();
                          toast.dismiss(t.id);
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                      >
                        Mettre à jour
                      </button>
                      <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
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

    } catch (error) {
      console.error('[SW] Service Worker registration failed:', error);
    }
  };

  // Gestion de la connexion/déconnexion
  useEffect(() => {
    const handleOnline = () => {
      toast.success('Connexion rétablie !', {
        icon: '🌐',
      });
    };

    const handleOffline = () => {
      toast.error('Vous êtes hors ligne', {
        icon: '📡',
        duration: Infinity,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
}
