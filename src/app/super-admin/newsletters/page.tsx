'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SuperAdminLayout } from '@/components/Layout/SuperAdminLayout';
import api from '@/lib/api';
import {
  Mail,
  Plus,
  Edit,
  Trash2,
  Send,
  Eye,
  FileText,
  Save,
  X,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface Newsletter {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  targetCountries?: string[];
  targetRoles?: string[];
  isDraft: boolean;
  publishedAt?: Date;
  createdAt: Date;
}

const AVAILABLE_COUNTRIES = [
  { code: 'TG', name: 'Togo' },
  { code: 'BJ', name: 'Bénin' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'ML', name: 'Mali' },
  { code: 'BF', name: 'Burkina Faso' },
];

const AVAILABLE_ROLES = [
  { code: 'CLIENT', name: 'Clients' },
  { code: 'AGENT', name: 'Agents' },
  { code: 'ADMIN', name: 'Administrateurs' },
];

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendConfirmModal, setSendConfirmModal] = useState<string | null>(null);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    totalSubscribers?: number;
    sentCount?: number;
    failedCount?: number;
    error?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    targetCountries: [] as string[],
    targetRoles: [] as string[],
  });

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const response = await api.get('/newsletters');
      setNewsletters(response.data.newsletters);
    } catch (error) {
      console.error('Erreur lors du chargement des newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (newsletter?: Newsletter) => {
    if (newsletter) {
      setEditingNewsletter(newsletter);
      setFormData({
        title: newsletter.title,
        content: newsletter.content,
        imageUrl: newsletter.imageUrl || '',
        targetCountries: newsletter.targetCountries || [],
        targetRoles: newsletter.targetRoles || [],
      });
    } else {
      setEditingNewsletter(null);
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        targetCountries: [],
        targetRoles: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNewsletter(null);
    setFormData({
      title: '',
      content: '',
      imageUrl: '',
      targetCountries: [],
      targetRoles: [],
    });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await api.post('/upload/image', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData({ ...formData, imageUrl: response.data.url });
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Le titre et le contenu sont requis');
      return;
    }

    try {
      if (editingNewsletter) {
        await api.put(`/newsletters/${editingNewsletter.id}`, formData);
      } else {
        await api.post('/newsletters', formData);
      }
      await fetchNewsletters();
      handleCloseModal();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await api.post(`/newsletters/${id}/publish`);
      await fetchNewsletters();
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await api.post(`/newsletters/${id}/unpublish`);
      await fetchNewsletters();
    } catch (error) {
      console.error('Erreur lors de la dépublication:', error);
    }
  };

  const handleSendNewsletter = async (id: string) => {
    setSending(true);
    setSendConfirmModal(null);
    try {
      const response = await api.post(`/newsletters/${id}/send`);
      setSendResult({
        success: true,
        totalSubscribers: response.data.totalSubscribers,
        sentCount: response.data.sentCount,
        failedCount: response.data.failedCount,
      });
      await fetchNewsletters();
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi:', error);
      setSendResult({
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'envoi de la newsletter',
      });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette newsletter ?')) return;

    try {
      await api.delete(`/newsletters/${id}`);
      await fetchNewsletters();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const toggleCountry = (code: string) => {
    setFormData({
      ...formData,
      targetCountries: formData.targetCountries.includes(code)
        ? formData.targetCountries.filter((c) => c !== code)
        : [...formData.targetCountries, code],
    });
  };

  const toggleRole = (code: string) => {
    setFormData({
      ...formData,
      targetRoles: formData.targetRoles.includes(code)
        ? formData.targetRoles.filter((r) => r !== code)
        : [...formData.targetRoles, code],
    });
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-4">
        {/* Header */}
        <motion.div
          className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Gestion des Newsletters
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">Créez et envoyez des newsletters à vos abonnés</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm sm:text-base font-semibold transition shadow-lg w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            Nouvelle
          </button>
        </motion.div>

        {/* Liste des newsletters */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {newsletters.map((newsletter, index) => (
            <motion.div
              key={newsletter.id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 lg:gap-6">
                {/* Image */}
                {newsletter.imageUrl && (
                  <div className="md:w-48 flex-shrink-0">
                    <img
                      src={newsletter.imageUrl}
                      alt={newsletter.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Contenu */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {newsletter.title}
                      </h3>
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            newsletter.isDraft
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {newsletter.isDraft ? (
                            <>
                              <FileText className="h-3 w-3" />
                              Brouillon
                            </>
                          ) : (
                            <>
                              <Check className="h-3 w-3" />
                              Publiée
                            </>
                          )}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(newsletter.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 line-clamp-2 mb-3">{newsletter.content}</p>

                  {/* Ciblage */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {newsletter.targetCountries && newsletter.targetCountries.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Pays:</span>
                        {newsletter.targetCountries.map((code) => (
                          <span
                            key={code}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                          >
                            {AVAILABLE_COUNTRIES.find((c) => c.code === code)?.name || code}
                          </span>
                        ))}
                      </div>
                    )}
                    {newsletter.targetRoles && newsletter.targetRoles.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Rôles:</span>
                        {newsletter.targetRoles.map((code) => (
                          <span
                            key={code}
                            className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium"
                          >
                            {AVAILABLE_ROLES.find((r) => r.code === code)?.name || code}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <button
                      onClick={() => handleOpenModal(newsletter)}
                      className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition text-xs sm:text-sm"
                    >
                      <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Modifier
                    </button>
                    {newsletter.isDraft ? (
                      <button
                        onClick={() => handlePublish(newsletter.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition"
                      >
                        <Eye className="h-4 w-4" />
                        Publier
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleUnpublish(newsletter.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition"
                        >
                          <FileText className="h-4 w-4" />
                          Dépublier
                        </button>
                        <button
                          onClick={() => setSendConfirmModal(newsletter.id)}
                          disabled={sending}
                          className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                          {sending ? 'Envoi...' : 'Envoyer'}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(newsletter.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {newsletters.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Mail className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Aucune newsletter créée</p>
              <p className="text-sm">Créez votre première newsletter pour commencer</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full my-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingNewsletter ? 'Modifier la newsletter' : 'Nouvelle newsletter'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Titre de la newsletter"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Image (optionnel)
                  </label>
                  <div className="flex items-start gap-4">
                    {formData.imageUrl ? (
                      <div className="relative">
                        <img
                          src={formData.imageUrl}
                          alt="Image"
                          className="h-32 w-auto object-contain border rounded-lg"
                        />
                        <button
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <span className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition inline-flex">
                          <ImageIcon className="h-4 w-4" />
                          {uploading ? 'Upload...' : 'Choisir une image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Contenu
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Contenu de la newsletter..."
                  />
                </div>

                {/* Ciblage Pays */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Cibler par pays (optionnel - tous si vide)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AVAILABLE_COUNTRIES.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => toggleCountry(country.code)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          formData.targetCountries.includes(country.code)
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              formData.targetCountries.includes(country.code)
                                ? 'border-primary bg-primary'
                                : 'border-gray-300'
                            }`}
                          >
                            {formData.targetCountries.includes(country.code) && (
                              <div className="w-2.5 h-2.5 bg-white rounded-sm" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{country.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ciblage Rôles */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Cibler par rôle (optionnel - tous si vide)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AVAILABLE_ROLES.map((role) => (
                      <button
                        key={role.code}
                        onClick={() => toggleRole(role.code)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          formData.targetRoles.includes(role.code)
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              formData.targetRoles.includes(role.code)
                                ? 'border-primary bg-primary'
                                : 'border-gray-300'
                            }`}
                          >
                            {formData.targetRoles.includes(role.code) && (
                              <div className="w-2.5 h-2.5 bg-white rounded-sm" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{role.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition font-semibold shadow-lg"
                >
                  <Save className="h-5 w-5" />
                  Sauvegarder
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal de confirmation d'envoi */}
        {sendConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmer l'envoi</h3>
                <p className="text-gray-600">
                  Êtes-vous sûr de vouloir envoyer cette newsletter à tous les abonnés ciblés ?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSendConfirmModal(null)}
                  disabled={sending}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSendNewsletter(sendConfirmModal)}
                  disabled={sending}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Envoyer
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal de résultat d'envoi */}
        {sendResult && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-center mb-6">
                {sendResult.success ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Newsletter envoyée !</h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex justify-between px-4 py-2 bg-gray-50 rounded-lg">
                        <span>Abonnés ciblés</span>
                        <span className="font-semibold text-gray-900">{sendResult.totalSubscribers}</span>
                      </p>
                      <p className="flex justify-between px-4 py-2 bg-green-50 rounded-lg">
                        <span>Envoyés avec succès</span>
                        <span className="font-semibold text-green-600">{sendResult.sentCount}</span>
                      </p>
                      {sendResult.failedCount !== undefined && sendResult.failedCount > 0 && (
                        <p className="flex justify-between px-4 py-2 bg-red-50 rounded-lg">
                          <span>Échecs</span>
                          <span className="font-semibold text-red-600">{sendResult.failedCount}</span>
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                      <X className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur d'envoi</h3>
                    <p className="text-red-600">{sendResult.error}</p>
                  </>
                )}
              </div>
              <button
                onClick={() => setSendResult(null)}
                className="w-full px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition"
              >
                Fermer
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}
