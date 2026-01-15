'use client';

import { useState, useEffect } from 'react';
import { SuperAdminLayout } from '@/components/Layout/SuperAdminLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Megaphone,
  Upload,
  X,
  Calendar,
  Image as ImageIcon,
  FileText,
  Eye,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Announcement {
  id: string;
  title: string;
  fileUrl: string;
  fileType: 'IMAGE' | 'PDF';
  displayType: 'ONCE' | 'DAILY' | 'EVERY_LOGIN';
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    file: null as File | null,
    displayType: 'DAILY' as 'ONCE' | 'DAILY' | 'EVERY_LOGIN',
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error loading announcements:', error);
      toast.error('Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Type de fichier non supporté. Utilisez une image (JPEG, PNG, GIF) ou un PDF.');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux. Taille maximale: 5MB');
        return;
      }

      setFormData({ ...formData, file });

      // Créer une preview pour les images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Veuillez entrer un titre');
      return;
    }

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.file);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('displayType', formData.displayType);

      await api.post('/announcements', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Annonce créée avec succès !');
      setShowForm(false);
      setFormData({ title: '', file: null, displayType: 'DAILY' });
      setPreviewUrl(null);
      loadAnnouncements();
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la création de l\'annonce');
    } finally {
      setUploading(false);
    }
  };

  const toggleAnnouncementStatus = async (id: string, isActive: boolean) => {
    try {
      await api.patch(`/announcements/${id}`, { isActive: !isActive });
      toast.success(isActive ? 'Annonce désactivée' : 'Annonce activée');
      loadAnnouncements();
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    try {
      await api.delete(`/announcements/${id}`);
      toast.success('Annonce supprimée');
      loadAnnouncements();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <SuperAdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Megaphone className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Annonces</h1>
              <p className="text-gray-600">Gérer les annonces pour les clients</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            <Plus className="h-5 w-5" />
            Nouvelle annonce
          </button>
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => !uploading && setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Nouvelle annonce</h2>
                    <button
                      onClick={() => !uploading && setShowForm(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      disabled={uploading}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre de l'annonce
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="Ex: Promotion spéciale"
                        required
                        disabled={uploading}
                      />
                    </div>

                    {/* Display Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type d'affichage
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, displayType: 'ONCE' })}
                          className={`p-3 border-2 rounded-lg transition ${
                            formData.displayType === 'ONCE'
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          disabled={uploading}
                        >
                          <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                          <div className="font-medium text-sm">Une fois</div>
                          <div className="text-xs text-gray-600">Aujourd'hui</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, displayType: 'DAILY' })}
                          className={`p-3 border-2 rounded-lg transition ${
                            formData.displayType === 'DAILY'
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          disabled={uploading}
                        >
                          <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                          <div className="font-medium text-sm">Quotidien</div>
                          <div className="text-xs text-gray-600">1x par jour</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, displayType: 'EVERY_LOGIN' })}
                          className={`p-3 border-2 rounded-lg transition ${
                            formData.displayType === 'EVERY_LOGIN'
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          disabled={uploading}
                        >
                          <RefreshCw className="h-5 w-5 mx-auto mb-1 text-primary" />
                          <div className="font-medium text-sm">Connexion</div>
                          <div className="text-xs text-gray-600">À chaque visite</div>
                        </button>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fichier (Image ou PDF) *
                      </label>
                      {!formData.file ? (
                        <div className="border-2 border-dashed border-primary/50 bg-primary/5 rounded-lg p-8 text-center hover:border-primary hover:bg-primary/10 transition-all">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            disabled={uploading}
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <div className="bg-primary/10 p-4 rounded-full mb-3">
                              <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <span className="text-base font-medium text-gray-900 mb-1">
                              Cliquez ici pour sélectionner un fichier
                            </span>
                            <span className="text-sm text-gray-600 mt-1">
                              Images (JPEG, PNG, GIF) ou PDF
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              Taille maximale: 5MB
                            </span>
                          </label>
                        </div>
                      ) : null}

                      {/* Preview */}
                      {formData.file && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {formData.file.type.startsWith('image/') ? (
                              <ImageIcon className="h-8 w-8 text-primary" />
                            ) : (
                              <FileText className="h-8 w-8 text-red-600" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{formData.file.name}</p>
                              <p className="text-sm text-gray-600">
                                {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, file: null });
                                setPreviewUrl(null);
                              }}
                              className="p-2 hover:bg-gray-200 rounded-lg transition"
                              disabled={uploading}
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Image Preview */}
                          {previewUrl && (
                            <div className="mt-3">
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-48 object-contain bg-gray-100 rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        disabled={uploading}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={uploading || !formData.file}
                        className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? 'Création...' : 'Créer l\'annonce'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Announcements List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Megaphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune annonce pour le moment</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-primary hover:underline"
            >
              Créer votre première annonce
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Preview */}
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {announcement.fileType === 'IMAGE' ? (
                    <img
                      src={announcement.fileUrl}
                      alt={announcement.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <FileText className="h-20 w-20 text-red-600" />
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {announcement.displayType === 'EVERY_LOGIN' ? (
                        <RefreshCw className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Calendar className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-gray-600">
                        {announcement.displayType === 'ONCE'
                          ? 'Une fois'
                          : announcement.displayType === 'DAILY'
                            ? 'Quotidien'
                            : 'À chaque connexion'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          announcement.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      <span className="text-gray-600">
                        {announcement.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() =>
                        toggleAnnouncementStatus(announcement.id, announcement.isActive)
                      }
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        announcement.isActive
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {announcement.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(announcement.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}
