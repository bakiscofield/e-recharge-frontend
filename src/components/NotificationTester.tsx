'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Send, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface NotificationTesterProps {
  onClose?: () => void;
}

export function NotificationTester({ onClose }: NotificationTesterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    title: '🧪 Test de notification',
    body: `Notification de test envoyée à ${new Date().toLocaleTimeString('fr-FR')}`,
  });
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSendTest = async () => {
    setIsSending(true);
    setLastResult(null);

    try {
      const payload: any = {
        title: formData.title,
        body: formData.body,
      };

      // Ajouter userId seulement s'il est renseigné
      if (formData.userId.trim()) {
        payload.userId = formData.userId.trim();
      }

      const response = await api.post('/notifications/test', payload);

      setLastResult({
        success: true,
        message: 'Notification de test envoyée avec succès !',
      });

      toast.success('✅ Notification envoyée !', {
        icon: '🔔',
        duration: 4000,
      });

      // Fermer après 2 secondes
      setTimeout(() => {
        setIsOpen(false);
        setLastResult(null);
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Erreur lors de l\'envoi';

      setLastResult({
        success: false,
        message: errorMessage,
      });

      toast.error(`❌ ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setLastResult(null);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Bouton pour ouvrir le modal */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
      >
        <Bell size={20} />
        <span className="font-medium">Tester les notifications</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Bell size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Test de notification
                      </h2>
                      <p className="text-sm text-gray-500">
                        Envoyer une notification de test
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* User ID (optionnel) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.userId}
                      onChange={(e) =>
                        setFormData({ ...formData, userId: e.target.value })
                      }
                      placeholder="Laisser vide pour s'envoyer à soi-même"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Si vide, la notification sera envoyée à votre compte
                    </p>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      value={formData.body}
                      onChange={(e) =>
                        setFormData({ ...formData, body: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Result */}
                  {lastResult && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg flex items-start gap-3 ${
                        lastResult.success
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      {lastResult.success ? (
                        <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            lastResult.success ? 'text-green-900' : 'text-red-900'
                          }`}
                        >
                          {lastResult.message}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSendTest}
                      disabled={isSending || !formData.title || !formData.body}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSending ? (
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
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Envoyer le test
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleClose}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>ℹ️ Info :</strong> La notification sera créée en base de données.
                    Actualisez la page pour la voir apparaître.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
