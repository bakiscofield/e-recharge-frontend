'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import api from '@/lib/api';

interface Announcement {
  id: string;
  title: string;
  fileUrl: string;
  fileType: 'IMAGE' | 'PDF';
  displayType: 'ONCE' | 'DAILY' | 'EVERY_LOGIN';
  isActive: boolean;
  createdAt: string;
}

export function AnnouncementModal() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    checkAndLoadAnnouncement();
  }, []);

  const checkAndLoadAnnouncement = async () => {
    try {
      // Récupérer l'annonce active
      const response = await api.get('/announcements/active');
      const activeAnnouncement = response.data;

      console.log('📢 Annonce active:', activeAnnouncement);

      if (!activeAnnouncement) {
        console.log('Aucune annonce active trouvée');
        return;
      }

      // Vérifier si on doit afficher l'annonce
      const shouldShow = checkShouldShowAnnouncement(activeAnnouncement);
      console.log('Doit afficher l\'annonce?', shouldShow);

      if (shouldShow) {
        console.log('Affichage de l\'annonce:', activeAnnouncement.title);
        setAnnouncement(activeAnnouncement);
        setShowModal(true);
      } else {
        console.log('Annonce déjà affichée aujourd\'hui');
      }
    } catch (error) {
      console.error('Error loading announcement:', error);
      // Silently fail - l'annonce n'est pas critique
    }
  };

  const checkShouldShowAnnouncement = (announcement: Announcement): boolean => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const storageKey = `announcement_shown_${announcement.id}`;
    const sessionKey = `announcement_session_${announcement.id}`;
    const lastShown = localStorage.getItem(storageKey);

    // Pour les annonces "EVERY_LOGIN" (à chaque connexion/login)
    if (announcement.displayType === 'EVERY_LOGIN') {
      // Récupérer le token actuel (identifie la session de connexion)
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return false;

      // Vérifier si déjà affichée pour ce token de connexion
      const shownForToken = localStorage.getItem(sessionKey);
      if (shownForToken === currentToken) {
        return false;
      }
      return true;
    }

    // Pour les annonces "ONCE" (une seule fois)
    if (announcement.displayType === 'ONCE') {
      const createdDate = new Date(announcement.createdAt).toISOString().split('T')[0];

      // Si l'annonce n'a pas été créée aujourd'hui, ne pas l'afficher
      if (createdDate !== today) {
        return false;
      }

      // Si déjà affichée aujourd'hui, ne pas réafficher
      if (lastShown === today) {
        return false;
      }

      return true;
    }

    // Pour les annonces "DAILY" (quotidiennes)
    if (announcement.displayType === 'DAILY') {
      // Si déjà affichée aujourd'hui, ne pas réafficher
      if (lastShown === today) {
        return false;
      }

      return true;
    }

    return false;
  };

  const handleClose = () => {
    if (announcement) {
      const today = new Date().toISOString().split('T')[0];
      const storageKey = `announcement_shown_${announcement.id}`;
      const sessionKey = `announcement_session_${announcement.id}`;

      // Pour EVERY_LOGIN, sauvegarder le token actuel (se réaffiche si nouveau login)
      if (announcement.displayType === 'EVERY_LOGIN') {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          localStorage.setItem(sessionKey, currentToken);
        }
      } else {
        // Pour ONCE et DAILY, marquer dans localStorage avec la date
        localStorage.setItem(storageKey, today);
      }
    }

    setShowModal(false);

    // Attendre l'animation de fermeture avant de réinitialiser
    setTimeout(() => {
      setAnnouncement(null);
    }, 300);
  };

  const openInNewTab = () => {
    if (announcement?.fileType === 'PDF') {
      window.open(announcement.fileUrl, '_blank');
    }
  };

  if (!showModal || !announcement) return null;

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        key="announcement-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Animated gradient background effect */}
      <div className="absolute inset-0 flex items-end sm:items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-96 h-96 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full blur-3xl"
        />
      </div>

      <div className="absolute inset-0 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
        <motion.div
          key="announcement-modal"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            mass: 0.8
          }}
          className="bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden relative pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle for mobile */}
          <div className="sm:hidden flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>

          {/* Content */}
          <div className="overflow-y-auto max-h-[85vh] sm:max-h-[80vh]">
            {/* File Display */}
            <div className="p-4 sm:p-6">
              {announcement.fileType === 'IMAGE' ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 150 }}
                  className="flex items-center justify-center"
                >
                  <img
                    src={announcement.fileUrl}
                    alt={announcement.title}
                    className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain rounded-xl shadow-lg"
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-center py-8 sm:py-12"
                >
                  <FileText className="h-20 w-20 sm:h-24 sm:w-24 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Document PDF
                  </h3>
                  <p className="text-gray-600 mb-6 px-4">
                    Cliquez sur le bouton ci-dessous pour ouvrir le document
                  </p>
                  <button
                    onClick={openInNewTab}
                    className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
                  >
                    Ouvrir le PDF
                  </button>
                </motion.div>
              )}
            </div>

            {/* Footer with close button */}
            <div className="border-t border-gray-200 p-4 bg-gray-50/80 backdrop-blur-sm">
              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 py-3.5 rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all font-medium shadow-sm active:shadow-inner"
              >
                Fermer
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
