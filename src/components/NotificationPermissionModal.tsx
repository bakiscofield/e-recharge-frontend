'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check } from 'lucide-react';

/**
 * Modal pour demander la permission des notifications
 * S'affiche une seule fois au premier lancement de l'application
 */
export function NotificationPermissionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Vérifier si on doit afficher le modal
    const shouldShowModal = checkShouldShowModal();
    if (shouldShowModal) {
      // Afficher le modal après 2 secondes (laisser l'app se charger)
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const checkShouldShowModal = (): boolean => {
    // Ne pas afficher côté serveur
    if (typeof window === 'undefined') return false;

    // Vérifier si les notifications sont supportées
    if (!('Notification' in window)) return false;

    // Si la permission est déjà accordée ou refusée, ne pas afficher
    if (Notification.permission !== 'default') return false;

    // Vérifier si l'utilisateur a déjà refusé le modal
    const hasDeclined = localStorage.getItem('notification_modal_declined');
    if (hasDeclined) {
      // Si refusé il y a moins de 7 jours, ne pas afficher
      const declinedDate = new Date(hasDeclined);
      const daysSinceDeclined =
        (Date.now() - declinedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDeclined < 7) return false;
    }

    // Vérifier si c'est le premier lancement
    const hasSeenModal = localStorage.getItem('notification_modal_seen');
    return !hasSeenModal;
  };

  const handleAccept = async () => {
    setIsLoading(true);

    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        localStorage.setItem('notification_modal_seen', 'true');
        localStorage.removeItem('notification_modal_declined');

        // Afficher un message de succès
        setTimeout(() => {
          setIsOpen(false);
        }, 1000);
      } else {
        console.log('⚠️ Notification permission denied');
        handleDecline();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      handleDecline();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = () => {
    localStorage.setItem('notification_modal_declined', new Date().toISOString());
    localStorage.setItem('notification_modal_seen', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDecline}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
              {/* Bouton fermer */}
              <button
                onClick={handleDecline}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fermer"
              >
                <X size={24} />
              </button>

              {/* Icône */}
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bell size={40} className="text-blue-600" />
                </div>
              </div>

              {/* Titre */}
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Restez informé en temps réel
              </h2>

              {/* Description */}
              <p className="text-center text-gray-600 mb-6">
                Recevez des notifications instantanées pour :
              </p>

              {/* Liste des avantages */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>Validation</strong> ou rejet de vos transactions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>Nouvelles demandes</strong> qui vous sont assignées
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>Messages</strong> du support et des clients
                  </span>
                </li>
              </ul>

              {/* Boutons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAccept}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Activation...
                    </>
                  ) : (
                    <>
                      <Bell size={20} />
                      Activer les notifications
                    </>
                  )}
                </button>

                <button
                  onClick={handleDecline}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Plus tard
                </button>
              </div>

              {/* Note */}
              <p className="text-xs text-gray-500 text-center mt-4">
                Vous pourrez toujours activer les notifications plus tard dans les paramètres
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
