'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Clock } from 'lucide-react';

interface WaitingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type: 'DEPOT' | 'RETRAIT';
  autoCloseDuration?: number; // in milliseconds
}

export function WaitingModal({
  isOpen,
  onClose,
  title,
  message,
  type,
  autoCloseDuration = 5000,
}: WaitingModalProps) {
  const [timeLeft, setTimeLeft] = useState(autoCloseDuration / 1000);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(autoCloseDuration / 1000);
      return;
    }

    // Auto-close timer
    const closeTimer = setTimeout(() => {
      onClose();
    }, autoCloseDuration);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      clearTimeout(closeTimer);
      clearInterval(countdownInterval);
    };
  }, [isOpen, autoCloseDuration, onClose]);

  const defaultTitle = type === 'DEPOT'
    ? '✅ Dépôt créé avec succès !'
    : '✅ Retrait créé avec succès !';

  const defaultMessage = type === 'DEPOT'
    ? 'Votre demande de dépôt a été envoyée à un agent. Vous serez notifié dès qu\'elle sera traitée.'
    : 'Votre demande de retrait a été envoyée à un agent. Vous serez notifié dès qu\'elle sera traitée.';

  const progress = (timeLeft / (autoCloseDuration / 1000)) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className={`p-4 sm:p-6 ${type === 'DEPOT' ? 'bg-primary/5' : 'bg-secondary/5'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-full ${type === 'DEPOT' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                    <CheckCircle className={`h-6 w-6 sm:h-8 sm:w-8 ${type === 'DEPOT' ? 'text-primary' : 'text-secondary'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      {title || defaultTitle}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3.5 w-3.5 text-gray-500" />
                      <p className="text-xs sm:text-sm text-gray-600">
                        Fermeture dans {timeLeft.toFixed(1)}s
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition active:scale-95"
                  title="Fermer"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {message || defaultMessage}
              </p>

              {/* Info cards */}
              <div className={`mt-4 p-3 sm:p-4 rounded-xl ${type === 'DEPOT' ? 'bg-blue-50' : 'bg-purple-50'} border ${type === 'DEPOT' ? 'border-blue-100' : 'border-purple-100'}`}>
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-gray-700 font-medium mb-1">
                      Que faire maintenant ?
                    </p>
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-1 list-disc list-inside">
                      <li>Vérifiez l'historique pour suivre votre demande</li>
                      <li>Un agent vous contactera bientôt</li>
                      <li>Vous recevrez une notification à chaque étape</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-100">
              <motion.div
                className={`h-full ${type === 'DEPOT' ? 'bg-primary' : 'bg-secondary'}`}
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 flex justify-end">
              <button
                onClick={onClose}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base transition active:scale-95 ${
                  type === 'DEPOT'
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'bg-secondary hover:bg-secondary/90 text-white'
                }`}
              >
                J'ai compris
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
