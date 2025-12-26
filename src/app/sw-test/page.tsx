'use client';

import { useEffect, useState } from 'react';
import { PWAUtils } from '@/lib/pwa-utils';

interface SWState {
  supported: boolean;
  registered: boolean;
  active: boolean;
  version: string | null;
  scope: string | null;
  state: string | null;
  updateAvailable: boolean;
}

export default function ServiceWorkerTestPage() {
  const [swState, setSwState] = useState<SWState>({
    supported: false,
    registered: false,
    active: false,
    version: null,
    scope: null,
    state: null,
    updateAvailable: false,
  });

  const [caches, setCaches] = useState<{ name: string; count: number }[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  useEffect(() => {
    const checkServiceWorker = async () => {
      addLog('Début de la vérification du Service Worker...');

      if (!PWAUtils.isServiceWorkerSupported()) {
        addLog('❌ Service Workers non supportés par ce navigateur');
        return;
      }

      addLog('✅ Service Workers supportés');

      try {
        const registration = await navigator.serviceWorker.getRegistration();

        if (!registration) {
          addLog('❌ Aucun Service Worker enregistré');
          setSwState((prev) => ({ ...prev, supported: true }));
          return;
        }

        addLog('✅ Service Worker enregistré');

        const version = await PWAUtils.getServiceWorkerVersion();
        const isActive = registration.active !== null;
        const state = registration.active?.state || registration.waiting?.state || registration.installing?.state || null;

        setSwState({
          supported: true,
          registered: true,
          active: isActive,
          version,
          scope: registration.scope,
          state,
          updateAvailable: registration.waiting !== null,
        });

        addLog(`✅ Service Worker actif: ${isActive ? 'Oui' : 'Non'}`);
        addLog(`📌 Version: ${version || 'Inconnue'}`);
        addLog(`🔍 Scope: ${registration.scope}`);
        addLog(`📊 État: ${state || 'Inconnu'}`);

        if (registration.waiting) {
          addLog('⚠️ Mise à jour disponible!');
        }

        // Récupérer les informations de cache
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          const cacheData = await Promise.all(
            cacheNames.map(async (name) => {
              const cache = await caches.open(name);
              const keys = await cache.keys();
              return { name, count: keys.length };
            })
          );
          setCaches(cacheData);
          addLog(`💾 ${cacheNames.length} cache(s) trouvé(s)`);
        }
      } catch (error) {
        addLog(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    };

    checkServiceWorker();

    // Écouter les changements de Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        addLog('🔄 Nouveau Service Worker activé');
        checkServiceWorker();
      });
    }
  }, []);

  const handleUnregister = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        addLog('✅ Service Worker désenregistré');
        setSwState({
          supported: true,
          registered: false,
          active: false,
          version: null,
          scope: null,
          state: null,
          updateAvailable: false,
        });
      }
    } catch (error) {
      addLog(`❌ Erreur lors du désenregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleUpdate = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        addLog('🔄 Vérification des mises à jour...');
        await registration.update();
        addLog('✅ Vérification terminée');
      }
    } catch (error) {
      addLog(`❌ Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleClearCaches = async () => {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      addLog(`✅ ${cacheNames.length} cache(s) supprimé(s)`);
      setCaches([]);
    } catch (error) {
      addLog(`❌ Erreur lors de la suppression des caches: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleSkipWaiting = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        addLog('✅ Message SKIP_WAITING envoyé');
      } else {
        addLog('⚠️ Aucune mise à jour en attente');
      }
    } catch (error) {
      addLog(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test du Service Worker
          </h1>
          <p className="text-gray-600 mb-8">
            Vérifiez l'état et le fonctionnement du Service Worker de votre PWA
          </p>

          {/* État du Service Worker */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📊 État du Service Worker
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Support navigateur:</span>
                  <span className={`font-medium ${swState.supported ? 'text-green-600' : 'text-red-600'}`}>
                    {swState.supported ? '✅ Supporté' : '❌ Non supporté'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Enregistrement:</span>
                  <span className={`font-medium ${swState.registered ? 'text-green-600' : 'text-red-600'}`}>
                    {swState.registered ? '✅ Enregistré' : '❌ Non enregistré'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">État:</span>
                  <span className={`font-medium ${swState.active ? 'text-green-600' : 'text-yellow-600'}`}>
                    {swState.state || 'Inconnu'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Version:</span>
                  <span className="font-mono text-sm font-medium text-blue-600">
                    {swState.version || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Scope:</span>
                  <span className="font-mono text-xs text-gray-600">
                    {swState.scope || 'N/A'}
                  </span>
                </div>
                {swState.updateAvailable && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                    <p className="text-yellow-800 text-sm font-medium">
                      ⚠️ Mise à jour disponible
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🛠️ Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={handleUpdate}
                  disabled={!swState.registered}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  🔄 Vérifier les mises à jour
                </button>

                <button
                  onClick={handleSkipWaiting}
                  disabled={!swState.updateAvailable}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  ⚡ Activer la mise à jour
                </button>

                <button
                  onClick={handleClearCaches}
                  disabled={caches.length === 0}
                  className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  🗑️ Vider les caches ({caches.length})
                </button>

                <button
                  onClick={handleUnregister}
                  disabled={!swState.registered}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  ❌ Désenregistrer le SW
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
                >
                  🔃 Recharger la page
                </button>
              </div>
            </div>
          </div>

          {/* Caches */}
          {caches.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                💾 Caches ({caches.length})
              </h2>
              <div className="space-y-2">
                {caches.map((cache) => (
                  <div
                    key={cache.name}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200"
                  >
                    <span className="font-mono text-sm text-gray-700">{cache.name}</span>
                    <span className="text-sm text-gray-600">{cache.count} entrée(s)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logs */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                📝 Logs ({logs.length})
              </h2>
              <button
                onClick={() => setLogs([])}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Effacer
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun log</p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="font-mono text-xs text-green-400">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Retour à l'accueil
            </a>
            <span className="mx-4 text-gray-400">|</span>
            <a
              href="/pwa-debug"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Page de diagnostic PWA →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
