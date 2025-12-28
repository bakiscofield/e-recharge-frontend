'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SuperAdminLayout } from '@/components/Layout/SuperAdminLayout';
import api from '@/lib/api';
import { Gamepad2, Plus, Edit, Trash2, Power, Image as ImageIcon, Save, X } from 'lucide-react';

interface Bookmaker {
  id: string;
  name: string;
  logo: string | null;
  countries: string[];
  isActive: boolean;
  order: number;
}

const AVAILABLE_COUNTRIES = [
  { code: 'TG', name: 'Togo' },
  { code: 'BJ', name: 'Bénin' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'ML', name: 'Mali' },
  { code: 'BF', name: 'Burkina Faso' },
];

export default function BookmakersPage() {
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBookmaker, setEditingBookmaker] = useState<Bookmaker | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    countries: [] as string[],
    logo: '',
    order: 0,
  });

  useEffect(() => {
    fetchBookmakers();
  }, []);

  const fetchBookmakers = async () => {
    try {
      const response = await api.get('/super-admin/bookmakers');
      setBookmakers(
        response.data.map((bm: any) => ({
          ...bm,
          countries: typeof bm.countries === 'string' ? JSON.parse(bm.countries) : bm.countries,
        }))
      );
    } catch (error) {
      console.error('Erreur lors du chargement des bookmakers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (bookmaker?: Bookmaker) => {
    if (bookmaker) {
      setEditingBookmaker(bookmaker);
      setFormData({
        name: bookmaker.name,
        countries: bookmaker.countries,
        logo: bookmaker.logo || '',
        order: bookmaker.order,
      });
    } else {
      setEditingBookmaker(null);
      setFormData({
        name: '',
        countries: [],
        logo: '',
        order: bookmakers.length,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBookmaker(null);
    setFormData({ name: '', countries: [], logo: '', order: 0 });
  };

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await api.post('/upload/image', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData({ ...formData, logo: response.data.url });
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload du logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Le nom est requis');
      return;
    }

    if (formData.countries.length === 0) {
      alert('Sélectionnez au moins un pays');
      return;
    }

    try {
      if (editingBookmaker) {
        await api.put(`/super-admin/bookmakers/${editingBookmaker.id}`, formData);
      } else {
        await api.post('/super-admin/bookmakers', formData);
      }
      await fetchBookmakers();
      handleCloseModal();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await api.put(`/super-admin/bookmakers/${id}/toggle-status`);
      await fetchBookmakers();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bookmaker ?')) return;

    try {
      await api.delete(`/super-admin/bookmakers/${id}`);
      await fetchBookmakers();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const toggleCountry = (code: string) => {
    setFormData({
      ...formData,
      countries: formData.countries.includes(code)
        ? formData.countries.filter((c) => c !== code)
        : [...formData.countries, code],
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
            <Gamepad2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Gestion des Bookmakers
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">Gérez les bookmakers et leurs logos</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm sm:text-base font-semibold transition shadow-lg w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            Nouveau
          </button>
        </motion.div>

        {/* Liste des bookmakers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {bookmakers.map((bookmaker, index) => (
            <motion.div
              key={bookmaker.id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Logo */}
              <div className="mb-4 flex justify-center">
                {bookmaker.logo ? (
                  <img
                    src={bookmaker.logo}
                    alt={bookmaker.name}
                    className="h-24 w-auto object-contain"
                  />
                ) : (
                  <div className="h-24 w-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Nom */}
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 text-center">
                {bookmaker.name}
              </h3>

              {/* Pays */}
              <div className="flex flex-wrap gap-1 sm:gap-2 justify-center mb-3 sm:mb-4">
                {bookmaker.countries.map((code) => (
                  <span
                    key={code}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                  >
                    {AVAILABLE_COUNTRIES.find((c) => c.code === code)?.name || code}
                  </span>
                ))}
              </div>

              {/* Statut */}
              <div className="mb-4 text-center">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    bookmaker.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <Power className="h-3 w-3" />
                  {bookmaker.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-1.5 sm:gap-2">
                <button
                  onClick={() => handleOpenModal(bookmaker)}
                  className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition text-xs sm:text-sm"
                >
                  <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Modifier</span>
                </button>
                <button
                  onClick={() => handleToggleStatus(bookmaker.id)}
                  className={`px-2 sm:px-4 py-2 rounded-lg transition ${
                    bookmaker.isActive
                      ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700'
                      : 'bg-green-50 hover:bg-green-100 text-green-700'
                  }`}
                  title={bookmaker.isActive ? 'Désactiver' : 'Activer'}
                >
                  <Power className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => handleDelete(bookmaker.id)}
                  className="px-2 sm:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition"
                  title="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingBookmaker ? 'Modifier le bookmaker' : 'Nouveau bookmaker'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nom du bookmaker
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: 1xBet, Betwinner..."
                  />
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Logo
                  </label>
                  <div className="flex items-start gap-4">
                    {formData.logo ? (
                      <div className="relative">
                        <img
                          src={formData.logo}
                          alt="Logo"
                          className="h-24 w-auto object-contain border rounded-lg"
                        />
                        <button
                          onClick={() => setFormData({ ...formData, logo: '' })}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-24 w-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <span className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition inline-flex">
                          <ImageIcon className="h-4 w-4" />
                          {uploading ? 'Upload...' : 'Choisir un logo'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleLogoUpload(file);
                          }}
                          disabled={uploading}
                        />
                      </label>
                      <p className="text-sm text-gray-600 mt-2">
                        Formats acceptés: PNG, JPG, SVG (max 2MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pays */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Pays disponibles
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {AVAILABLE_COUNTRIES.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => toggleCountry(country.code)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          formData.countries.includes(country.code)
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              formData.countries.includes(country.code)
                                ? 'border-primary bg-primary'
                                : 'border-gray-300'
                            }`}
                          >
                            {formData.countries.includes(country.code) && (
                              <div className="w-2.5 h-2.5 bg-white rounded-sm" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900">{country.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ordre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
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
      </div>
    </SuperAdminLayout>
  );
}
