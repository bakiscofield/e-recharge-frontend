'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import api from '@/lib/api';

interface Announcement {
  id: string;
  title: string;
  fileUrl: string;
  fileType: 'IMAGE' | 'PDF';
  displayType: 'ONCE' | 'DAILY';
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

      if (!activeAnnouncement) {
        return;
      }

      // Vérifier si on doit afficher l'annonce
      const shouldShow = checkShouldShowAnnouncement(activeAnnouncement);

      if (shouldShow) {
        setAnnouncement(activeAnnouncement);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error loading announcement:', error);
      // Silently fail - l'annonce n'est pas critique
    }
  };

  const checkShouldShowAnnouncement = (announcement: Announcement): boolean => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const storageKey = `announcement_shown_${announcement.id}`;
    const lastShown = localStorage.getItem(storageKey);

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

      // Marquer comme affichée aujourd'hui
      localStorage.setItem(storageKey, today);
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

  return (
    <AnimatePresence>
      {showModal && announcement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>

            {/* Content */}
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Title */}
              {announcement.title && (
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
                  <h2 className="text-2xl font-bold text-center">{announcement.title}</h2>
                </div>
              )}

              {/* File Display */}
              <div className="p-6">
                {announcement.fileType === 'IMAGE' ? (
                  <div className="flex items-center justify-center">
                    <img
                      src={announcement.fileUrl}
                      alt={announcement.title}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-24 w-24 text-red-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Document PDF
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Cliquez sur le bouton ci-dessous pour ouvrir le document
                    </p>
                    <button
                      onClick={openInNewTab}
                      className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition"
                    >
                      Ouvrir le PDF
                    </button>
                  </div>
                )}
              </div>

              {/* Footer with close button */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
