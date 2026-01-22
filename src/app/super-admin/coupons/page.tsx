'use client';

import { useState, useEffect } from 'react';
import { SuperAdminLayout } from '@/components/Layout/SuperAdminLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Ticket,
  Plus,
  X,
  Calendar,
  Edit2,
  Trash2,
  Trophy,
  FileText,
  Eye,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

interface Coupon {
  id: string;
  title?: string;
  description?: string;
  content?: string;
  type: 'MATCH' | 'COUPON';
  imageUrl?: string;
  documentUrl?: string;
  documentUrls?: string[];
  date: string;
  isActive: boolean;
  createdAt: string;
}

export default function CouponsAdminPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [viewCoupon, setViewCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: 'MATCH' as 'MATCH' | 'COUPON',
    imageUrl: '',
    documentUrls: [] as string[],
    date: dayjs().format('YYYY-MM-DDTHH:mm'),
    isActive: true,
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const response = await api.get('/coupons/admin/all');
      setCoupons(response.data);
    } catch (error) {
      console.error('Error loading coupons:', error);
      toast.error('Erreur lors du chargement des coupons');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      type: 'MATCH',
      imageUrl: '',
      documentUrls: [],
      date: dayjs().format('YYYY-MM-DDTHH:mm'),
      isActive: true,
    });
    setEditingCoupon(null);
  };

  const openEditForm = (coupon: Coupon) => {
    setFormData({
      title: coupon.title || '',
      description: coupon.description || '',
      content: coupon.content || '',
      type: coupon.type,
      imageUrl: coupon.imageUrl || '',
      documentUrls: coupon.documentUrls || (coupon.documentUrl ? [coupon.documentUrl] : []),
      date: dayjs(coupon.date).format('YYYY-MM-DDTHH:mm'),
      isActive: coupon.isActive,
    });
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Type de fichier non supporté. Utilisez une image (JPEG, PNG, GIF, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image est trop volumineuse. Taille maximale: 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await api.post('/upload/image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData({ ...formData, imageUrl: response.data.url });
      toast.success('Image uploadée');
    } catch (error) {
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingDocument(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} est trop volumineux. Taille max: 10MB`);
          continue;
        }

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const response = await api.post('/upload/document', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        uploadedUrls.push(response.data.url);
      }

      if (uploadedUrls.length > 0) {
        setFormData({
          ...formData,
          documentUrls: [...formData.documentUrls, ...uploadedUrls]
        });
        toast.success(`${uploadedUrls.length} document(s) uploadé(s)`);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'upload du document');
    } finally {
      setUploadingDocument(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      documentUrls: formData.documentUrls.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Au moins un document ou un contenu est requis
    if (!formData.documentUrls.length && !formData.content.trim() && !formData.imageUrl) {
      toast.error('Veuillez ajouter au moins un document, une image ou du contenu');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title || undefined,
        description: formData.description || undefined,
        content: formData.content || undefined,
        type: formData.type,
        imageUrl: formData.imageUrl || undefined,
        documentUrls: formData.documentUrls.length > 0 ? formData.documentUrls : undefined,
        date: new Date(formData.date).toISOString(),
        isActive: formData.isActive,
      };

      if (editingCoupon) {
        await api.put(`/coupons/${editingCoupon.id}`, payload);
        toast.success('Coupon modifié avec succès');
      } else {
        await api.post('/coupons', payload);
        toast.success('Coupon créé avec succès');
      }

      setShowForm(false);
      resetForm();
      loadCoupons();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const toggleCouponStatus = async (id: string) => {
    try {
      await api.patch(`/coupons/${id}/toggle`);
      toast.success('Statut modifié');
      loadCoupons();
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce coupon ?')) {
      return;
    }

    try {
      await api.delete(`/coupons/${id}`);
      toast.success('Coupon supprimé');
      loadCoupons();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const matches = coupons.filter((c) => c.type === 'MATCH');
  const couponsList = coupons.filter((c) => c.type === 'COUPON');

  return (
    <SuperAdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Ticket className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Coupons du Jour</h1>
              <p className="text-gray-600">Gérer les matchs et coupons pour les clients</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            <Plus className="h-5 w-5" />
            Nouveau coupon
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
                <p className="text-sm text-gray-600">Matchs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{couponsList.length}</p>
                <p className="text-sm text-gray-600">Coupons</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <Ticket className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {coupons.filter((c) => c.isActive).length}
                </p>
                <p className="text-sm text-gray-600">Actifs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => !saving && setShowForm(false)}
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
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingCoupon ? 'Modifier le coupon' : 'Nouveau coupon'}
                    </h2>
                    <button
                      onClick={() => !saving && setShowForm(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      disabled={saving}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, type: 'MATCH' })}
                          className={`p-3 border-2 rounded-lg transition flex items-center justify-center gap-2 ${
                            formData.type === 'MATCH'
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium">Match</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, type: 'COUPON' })}
                          className={`p-3 border-2 rounded-lg transition flex items-center justify-center gap-2 ${
                            formData.type === 'COUPON'
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <FileText className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">Coupon</span>
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre <span className="text-gray-400">(optionnel)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ex: PSG vs Marseille"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description courte <span className="text-gray-400">(optionnel)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ex: Ligue 1 - Journée 20"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenu détaillé <span className="text-gray-400">(optionnel)</span>
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Pronostics, analyses, cotes, etc."
                        rows={5}
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date {formData.type === 'MATCH' ? 'du match' : 'de publication'}
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image (optionnel)
                      </label>
                      {formData.imageUrl ? (
                        <div className="relative">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            disabled={uploadingImage}
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            {uploadingImage ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            ) : (
                              <>
                                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <span className="text-sm text-gray-600">Cliquez pour ajouter une image</span>
                              </>
                            )}
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Documents Upload (Multiple) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Documents <span className="text-gray-400">(plusieurs fichiers possibles)</span>
                      </label>

                      {/* Liste des documents uploadés avec aperçu */}
                      {formData.documentUrls.length > 0 && (
                        <div className="space-y-3 mb-3">
                          {formData.documentUrls.map((url, index) => {
                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

                            return (
                              <div key={index} className="relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                {isImage ? (
                                  // Aperçu image
                                  <div className="relative">
                                    <img
                                      src={url}
                                      alt={`Document ${index + 1}`}
                                      className="w-full h-40 object-cover"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-1">
                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-white/90 hover:bg-white rounded-lg shadow text-blue-500"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => removeDocument(index)}
                                        className="p-2 bg-white/90 hover:bg-white rounded-lg shadow text-red-500"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-3 py-1 truncate">
                                      {url.split('/').pop()}
                                    </div>
                                  </div>
                                ) : (
                                  // Affichage fichier non-image
                                  <div className="flex items-center gap-3 p-3">
                                    <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" />
                                    <span className="flex-1 text-sm text-gray-600 truncate">
                                      {url.split('/').pop()}
                                    </span>
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 hover:bg-gray-200 rounded text-blue-500"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => removeDocument(index)}
                                      className="p-2 hover:bg-red-100 rounded text-red-500"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Upload zone */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition">
                        <input
                          type="file"
                          onChange={handleDocumentUpload}
                          className="hidden"
                          id="document-upload"
                          disabled={uploadingDocument}
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                        />
                        <label htmlFor="document-upload" className="cursor-pointer">
                          {uploadingDocument ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <span className="text-sm text-gray-600">
                                Cliquez pour ajouter des documents
                              </span>
                              <p className="text-xs text-gray-400 mt-1">
                                PDF, Word, Excel, Images (max 10MB par fichier)
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-5 h-5 text-primary rounded focus:ring-primary"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Actif (visible par les clients)
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        disabled={saving}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                      >
                        {saving ? 'Enregistrement...' : editingCoupon ? 'Modifier' : 'Créer'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Modal */}
        <AnimatePresence>
          {viewCoupon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setViewCoupon(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {viewCoupon.imageUrl && (
                  <img
                    src={viewCoupon.imageUrl}
                    alt={viewCoupon.title || 'Coupon'}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {viewCoupon.type === 'MATCH' ? (
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-blue-500" />
                        )}
                        <span className="text-sm font-medium text-gray-500">
                          {viewCoupon.type === 'MATCH' ? 'Match' : 'Coupon'}
                        </span>
                        {(viewCoupon.documentUrls?.length || 0) > 0 && (
                          <span className="text-sm font-medium text-blue-500">
                            • {viewCoupon.documentUrls?.length} document(s)
                          </span>
                        )}
                      </div>
                      {viewCoupon.title && (
                        <h2 className="text-xl font-bold text-gray-900">{viewCoupon.title}</h2>
                      )}
                      {viewCoupon.description && (
                        <p className="text-gray-600 mt-1">{viewCoupon.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setViewCoupon(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {dayjs(viewCoupon.date).format('DD MMM YYYY HH:mm')}
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        viewCoupon.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {viewCoupon.isActive ? 'Actif' : 'Inactif'}
                    </div>
                  </div>

                  {viewCoupon.content && (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800">{viewCoupon.content}</div>
                    </div>
                  )}

                  {/* Documents multiples */}
                  {((viewCoupon.documentUrls && viewCoupon.documentUrls.length > 0) || viewCoupon.documentUrl) && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Documents attachés:</p>
                      {viewCoupon.documentUrls?.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                        >
                          <FileText className="h-5 w-5" />
                          <span className="flex-1 truncate">{url.split('/').pop()}</span>
                          <Eye className="h-4 w-4" />
                        </a>
                      ))}
                      {viewCoupon.documentUrl && !viewCoupon.documentUrls?.length && (
                        <a
                          href={viewCoupon.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                        >
                          <FileText className="h-5 w-5" />
                          <span className="flex-1 truncate">{viewCoupon.documentUrl.split('/').pop()}</span>
                          <Eye className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coupons List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun coupon pour le moment</p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="mt-4 text-primary hover:underline"
            >
              Créer votre premier coupon
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Matches Section */}
            {matches.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Matchs ({matches.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matches.map((coupon) => (
                    <CouponCard
                      key={coupon.id}
                      coupon={coupon}
                      onEdit={() => openEditForm(coupon)}
                      onToggle={() => toggleCouponStatus(coupon.id)}
                      onDelete={() => deleteCoupon(coupon.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Coupons Section */}
            {couponsList.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Coupons ({couponsList.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {couponsList.map((coupon) => (
                    <CouponCard
                      key={coupon.id}
                      coupon={coupon}
                      onEdit={() => openEditForm(coupon)}
                      onToggle={() => toggleCouponStatus(coupon.id)}
                      onDelete={() => deleteCoupon(coupon.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}

function CouponCard({
  coupon,
  onEdit,
  onToggle,
  onDelete,
}: {
  coupon: Coupon;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {coupon.imageUrl && (
        <img
          src={coupon.imageUrl}
          alt={coupon.title || 'Coupon'}
          className="w-full h-32 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {coupon.type === 'MATCH' ? (
                <Trophy className="h-4 w-4 text-yellow-500" />
              ) : (
                <FileText className="h-4 w-4 text-blue-500" />
              )}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  coupon.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {coupon.isActive ? 'Actif' : 'Inactif'}
              </span>
              {(coupon.documentUrls?.length || 0) > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {coupon.documentUrls?.length} doc(s)
                </span>
              )}
            </div>
            {coupon.title && (
              <h3 className="font-semibold text-gray-900 line-clamp-1">{coupon.title}</h3>
            )}
            {coupon.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{coupon.description}</p>
            )}
            {!coupon.title && !coupon.description && (
              <p className="text-sm text-gray-400 italic">Sans titre</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4" />
          {dayjs(coupon.date).format('DD MMM YYYY HH:mm')}
        </div>

        {/* Contenu visible directement */}
        {coupon.content && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-800 whitespace-pre-wrap line-clamp-4">{coupon.content}</p>
          </div>
        )}

        {/* Documents visibles directement */}
        {((coupon.documentUrls && coupon.documentUrls.length > 0) || coupon.documentUrl) && (
          <div className="mb-3 space-y-2">
            {coupon.documentUrls?.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
              >
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1 truncate">{url.split('/').pop()}</span>
                <Eye className="h-4 w-4 flex-shrink-0" />
              </a>
            ))}
            {coupon.documentUrl && !coupon.documentUrls?.length && (
              <a
                href={coupon.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
              >
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1 truncate">{coupon.documentUrl.split('/').pop()}</span>
                <Eye className="h-4 w-4 flex-shrink-0" />
              </a>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
          >
            <Edit2 className="h-4 w-4" />
            Modifier
          </button>
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition ${
              coupon.isActive
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {coupon.isActive ? (
              <X className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
