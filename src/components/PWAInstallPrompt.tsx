'use client';

import { useEffect, useState } from 'react';
import { InstallPromptManager, PWAUtils } from '@/lib/pwa-utils';
import { X, Download, Smartphone } from 'lucide-react';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installManager] = useState(() => new InstallPromptManager());

  useEffect(() => {
    // Ne pas afficher si déjà en mode standalone
    if (PWAUtils.isStandalone()) {
      return;
    }

    // Vérifier si l'utilisateur a déjà refusé l'installation
    const hasDeclined = localStorage.getItem('pwa-install-declined');
    if (hasDeclined) {
      const declinedDate = new Date(hasDeclined);
      const daysSinceDecline = (Date.now() - declinedDate.getTime()) / (1000 * 60 * 60 * 24);

      // Réafficher après 7 jours
      if (daysSinceDecline < 7) {
        return;
      }
    }

    // Configurer le gestionnaire d'installation
    installManager.onInstallable((canInstall) => {
      if (canInstall) {
        // Afficher le prompt après 30 secondes
        setTimeout(() => {
          setShowPrompt(true);
        }, 30000);
      }
    });

    installManager.onInstalled(() => {
      setShowPrompt(false);
      localStorage.removeItem('pwa-install-declined');
    });
  }, [installManager]);

  const handleInstall = async () => {
    const result = await installManager.promptInstall();

    if (result === 'accepted') {
      console.log('[PWA] User accepted installation');
    } else if (result === 'dismissed') {
      console.log('[PWA] User dismissed installation');
      localStorage.setItem('pwa-install-declined', new Date().toISOString());
    }

    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-declined', new Date().toISOString());
  };

  // Instructions spécifiques iOS
  if (PWAUtils.isIOS() && !PWAUtils.isStandalone()) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg z-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Installer AliceBot</h3>
              </div>
              <p className="text-sm text-blue-50 mb-3">
                Installez l&apos;application sur votre iPhone pour un accès rapide et une meilleure expérience
              </p>
              <div className="text-xs text-blue-100 space-y-1">
                <p>1. Appuyez sur le bouton de partage (en bas de Safari)</p>
                <p>2. Sélectionnez &quot;Sur l&apos;écran d&apos;accueil&quot;</p>
                <p>3. Appuyez sur &quot;Ajouter&quot;</p>
              </div>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="text-white/80 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prompt standard (Android, Desktop Chrome, Edge)
  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-xl border-t border-gray-200 dark:border-gray-700 p-4 z-50 animate-slide-up">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 flex-1">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Installer AliceBot
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Installez l&apos;application pour un accès rapide et une meilleure expérience, même hors ligne
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Installer
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition"
                >
                  Plus tard
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
