'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SuperAdminLayout } from '@/components/Layout/SuperAdminLayout';
import { ImageUpload } from '@/components/ImageUpload';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Settings,
  Palette,
  DollarSign,
  BookOpen,
  Upload,
  Trash2,
  Plus,
  Edit,
  Save,
  Image
} from 'lucide-react';

type ConfigTab = 'branding' | 'bookmakers' | 'payments' | 'ui';

interface Bookmaker {
  id: string;
  name: string;
  logo?: string;
  isActive: boolean;
  priority: number;
  countries?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon?: string;
  isActive: boolean;
  minAmount: number;
  maxAmount: number;
  fees: number;
  countries?: string;
}

interface AppBranding {
  appName: string;
  appLogo?: string;
  appTagline: string;
  primaryColor: string;
  secondaryColor: string;
  favicon?: string;
}

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState<ConfigTab>('branding');
  const [saving, setSaving] = useState(false);

  // Branding State
  const [branding, setBranding] = useState<AppBranding>({
    appName: 'AliceBot',
    appTagline: 'Dépôts & Retraits Bookmaker',
    primaryColor: '#00f0ff',
    secondaryColor: '#ff00ff',
  });

  // Bookmakers State
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>([]);
  const [editingBookmaker, setEditingBookmaker] = useState<Partial<Bookmaker> | null>(null);

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [editingPayment, setEditingPayment] = useState<Partial<PaymentMethod> | null>(null);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      // Load branding
      const configRes = await api.get('/config/public');
      setBranding({
        appName: configRes.data.appName || 'AliceBot',
        appTagline: configRes.data.appTagline || 'Dépôts & Retraits Bookmaker',
        primaryColor: configRes.data.primaryColor || '#00f0ff',
        secondaryColor: configRes.data.secondaryColor || '#ff00ff',
        appLogo: configRes.data.appLogo,
        favicon: configRes.data.favicon,
      });

      // Load bookmakers
      const bookmakersRes = await api.get('/bookmakers');
      setBookmakers(bookmakersRes.data);

      // Load payment methods
      const paymentsRes = await api.get('/payment-methods');
      setPaymentMethods(paymentsRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
      toast.error('Erreur lors du chargement de la configuration');
    }
  };

  const saveBranding = async () => {
    setSaving(true);
    try {
      await api.put('/config/branding', branding);
      toast.success('Image de marque sauvegardée!');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const saveBookmaker = async () => {
    if (!editingBookmaker) return;
    setSaving(true);
    try {
      if (editingBookmaker.id) {
        await api.put(`/bookmakers/${editingBookmaker.id}`, editingBookmaker);
        toast.success('Bookmaker mis à jour!');
      } else {
        await api.post('/bookmakers', editingBookmaker);
        toast.success('Bookmaker créé!');
      }
      setEditingBookmaker(null);
      loadConfiguration();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const deleteBookmaker = async (id: string) => {
    if (!confirm('Supprimer ce bookmaker?')) return;
    try {
      await api.delete(`/bookmakers/${id}`);
      toast.success('Bookmaker supprimé!');
      loadConfiguration();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const savePaymentMethod = async () => {
    if (!editingPayment) return;
    setSaving(true);
    try {
      if (editingPayment.id) {
        await api.put(`/payment-methods/${editingPayment.id}`, editingPayment);
        toast.success('Méthode de paiement mise à jour!');
      } else {
        await api.post('/payment-methods', editingPayment);
        toast.success('Méthode de paiement créée!');
      }
      setEditingPayment(null);
      loadConfiguration();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    if (!confirm('Supprimer cette méthode de paiement?')) return;
    try {
      await api.delete(`/payment-methods/${id}`);
      toast.success('Méthode supprimée!');
      loadConfiguration();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const tabs = [
    { id: 'branding' as ConfigTab, label: 'Image de marque', icon: Image },
    { id: 'bookmakers' as ConfigTab, label: 'Bookmakers', icon: BookOpen },
    { id: 'payments' as ConfigTab, label: 'Paiements', icon: DollarSign },
    { id: 'ui' as ConfigTab, label: 'Interface', icon: Palette },
  ];

  return (
    <SuperAdminLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Configuration Complète
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Gérez tous les aspects de l'application client</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 text-sm sm:text-base
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-gray-900 shadow-lg'
                  : 'bg-gray-800/50 text-gray-600 hover:text-gray-900 hover:bg-gray-700/50'
                }
              `}
            >
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <motion.div
              key="branding"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">🎨 Image de marque</h2>
                    <button className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" onClick={saveBranding} disabled={saving}>
                      <Save className="w-4 h-4" />
                      Sauvegarder
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Nom de l'application
                        </label>
                        <input
                          type="text"
                          value={branding.appName}
                          onChange={(e) => setBranding({ ...branding, appName: e.target.value })}
                          className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-cyan-500/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Slogan
                        </label>
                        <input
                          type="text"
                          value={branding.appTagline}
                          onChange={(e) => setBranding({ ...branding, appTagline: e.target.value })}
                          className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-cyan-500/50"
                        />
                      </div>

                      <ImageUpload
                        label="Logo de l'application"
                        value={branding.appLogo}
                        onChange={(url) => setBranding({ ...branding, appLogo: url })}
                        onRemove={() => setBranding({ ...branding, appLogo: undefined })}
                        maxSize={5}
                      />

                      <ImageUpload
                        label="Favicon (16x16 ou 32x32 pixels)"
                        value={branding.favicon}
                        onChange={(url) => setBranding({ ...branding, favicon: url })}
                        onRemove={() => setBranding({ ...branding, favicon: undefined })}
                        maxSize={1}
                        aspectRatio="1/1"
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Couleur principale
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={branding.primaryColor}
                              onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                              className="w-16 h-12 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={branding.primaryColor}
                              onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                              className="flex-1 px-3 py-2 bg-white text-gray-900 rounded border border-gray-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Couleur secondaire
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={branding.secondaryColor}
                              onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                              className="w-16 h-12 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={branding.secondaryColor}
                              onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                              className="flex-1 px-3 py-2 bg-white text-gray-900 rounded border border-gray-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Aperçu
                      </label>
                      <div
                        className="p-8 rounded-lg border-2"
                        style={{
                          background: `linear-gradient(135deg, ${branding.primaryColor}22 0%, ${branding.secondaryColor}22 100%)`,
                          borderColor: branding.primaryColor,
                        }}
                      >
                        <div className="text-center">
                          {branding.appLogo && (
                            <div className="mb-4 flex justify-center">
                              <img
                                src={branding.appLogo}
                                alt={branding.appName}
                                className="h-16 w-auto object-contain"
                              />
                            </div>
                          )}
                          <h1
                            className="text-4xl font-bold mb-2"
                            style={{ color: branding.primaryColor }}
                          >
                            {branding.appName}
                          </h1>
                          <p className="text-gray-600">{branding.appTagline}</p>

                          <div className="mt-6">
                            <button
                              className="px-6 py-3 rounded-lg font-medium"
                              style={{
                                background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%)`,
                                color: 'white',
                              }}
                            >
                              Bouton exemple
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bookmakers Tab */}
          {activeTab === 'bookmakers' && (
            <motion.div
              key="bookmakers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">🎰 Bookmakers</h2>
                    <button className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                      onClick={() => setEditingBookmaker({ name: '', isActive: true, priority: 0 })}
                    >
                      <Plus className="w-4 h-4" />
                      Nouveau bookmaker
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {bookmakers.map((bookmaker) => (
                      <div
                        key={bookmaker.id}
                        className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900">{bookmaker.name}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingBookmaker(bookmaker)}
                              className="p-2 hover:bg-cyan-500/20 rounded transition"
                            >
                              <Edit className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => deleteBookmaker(bookmaker.id)}
                              className="p-2 hover:bg-red-500/20 rounded transition"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Priorité: {bookmaker.priority}
                        </div>
                        <div className="mt-2">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              bookmaker.isActive
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-600'
                            }`}
                          >
                            {bookmaker.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Edit Bookmaker Modal */}
              {editingBookmaker && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white border border-gray-200 border border-primary rounded-lg p-6 max-w-md w-full mx-4"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {editingBookmaker.id ? 'Modifier' : 'Nouveau'} Bookmaker
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={editingBookmaker.name || ''}
                          onChange={(e) => setEditingBookmaker({ ...editingBookmaker, name: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800 text-gray-900 rounded-lg border border-gray-200 focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Priorité (ordre d'affichage)
                        </label>
                        <input
                          type="number"
                          value={editingBookmaker.priority || 0}
                          onChange={(e) => setEditingBookmaker({ ...editingBookmaker, priority: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 bg-gray-800 text-gray-900 rounded-lg border border-gray-200 focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Pays disponibles
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {['TG', 'BJ', 'CI', 'SN', 'ML', 'GN', 'NE', 'BF'].map((country) => (
                            <div key={country} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`bm-country-${country}`}
                                checked={
                                  editingBookmaker.countries
                                    ? JSON.parse(editingBookmaker.countries).includes(country)
                                    : false
                                }
                                onChange={(e) => {
                                  const countries = editingBookmaker.countries
                                    ? JSON.parse(editingBookmaker.countries)
                                    : [];
                                  if (e.target.checked) {
                                    countries.push(country);
                                  } else {
                                    countries.splice(countries.indexOf(country), 1);
                                  }
                                  setEditingBookmaker({
                                    ...editingBookmaker,
                                    countries: JSON.stringify([...new Set(countries)]),
                                  });
                                }}
                                className="w-4 h-4 text-cyan-500 rounded"
                              />
                              <label htmlFor={`bm-country-${country}`} className="text-sm text-gray-600">
                                {country}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="active"
                          checked={editingBookmaker.isActive || false}
                          onChange={(e) => setEditingBookmaker({ ...editingBookmaker, isActive: e.target.checked })}
                          className="w-4 h-4 text-cyan-500 rounded"
                        />
                        <label htmlFor="active" className="text-sm text-gray-600">
                          Actif
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={saveBookmaker} disabled={saving}>
                        Sauvegarder
                      </button>
                      <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition" onClick={() => setEditingBookmaker(null)}>
                        Annuler
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">💳 Méthodes de paiement</h2>
                    <button className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                      onClick={() => setEditingPayment({
                        name: '',
                        type: 'MOBILE_MONEY',
                        isActive: true,
                        minAmount: 500,
                        maxAmount: 100000,
                        fees: 0
                      })}
                    >
                      <Plus className="w-4 h-4" />
                      Nouvelle méthode
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{method.name}</h3>
                            <span className="text-sm text-gray-600">{method.type}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingPayment(method)}
                              className="p-2 hover:bg-cyan-500/20 rounded transition"
                            >
                              <Edit className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => deletePaymentMethod(method.id)}
                              className="p-2 hover:bg-red-500/20 rounded transition"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Min: {method.minAmount} FCFA</div>
                          <div>Max: {method.maxAmount} FCFA</div>
                          <div>Frais: {method.fees}%</div>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              method.isActive
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-600'
                            }`}
                          >
                            {method.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Edit Payment Modal */}
              {editingPayment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white border border-gray-200 border border-primary rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {editingPayment.id ? 'Modifier' : 'Nouvelle'} Méthode de paiement
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={editingPayment.name || ''}
                          onChange={(e) => setEditingPayment({ ...editingPayment, name: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800 text-gray-900 rounded-lg border border-gray-200 focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Type
                        </label>
                        <select
                          value={editingPayment.type || 'MOBILE_MONEY'}
                          onChange={(e) => setEditingPayment({ ...editingPayment, type: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800 text-gray-900 rounded-lg border border-gray-200 focus:border-primary"
                        >
                          <option value="MOBILE_MONEY">Mobile Money</option>
                          <option value="BANK_TRANSFER">Virement bancaire</option>
                          <option value="CRYPTO">Crypto</option>
                          <option value="CARD">Carte bancaire</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Montant min (FCFA)
                          </label>
                          <input
                            type="number"
                            value={editingPayment.minAmount || 0}
                            onChange={(e) => setEditingPayment({ ...editingPayment, minAmount: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 bg-gray-800 text-gray-900 rounded-lg border border-gray-200 focus:border-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Montant max (FCFA)
                          </label>
                          <input
                            type="number"
                            value={editingPayment.maxAmount || 0}
                            onChange={(e) => setEditingPayment({ ...editingPayment, maxAmount: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 bg-gray-800 text-gray-900 rounded-lg border border-gray-200 focus:border-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Frais (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={editingPayment.fees || 0}
                          onChange={(e) => setEditingPayment({ ...editingPayment, fees: parseFloat(e.target.value) })}
                          className="w-full px-4 py-3 bg-gray-800 text-gray-900 rounded-lg border border-gray-200 focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Pays disponibles
                        </label>
                        <div className="space-y-2">
                          {['TG', 'BJ', 'CI', 'SN', 'ML', 'GN', 'NE', 'BF'].map((country) => (
                            <div key={country} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`country-${country}`}
                                checked={
                                  editingPayment.countries
                                    ? JSON.parse(editingPayment.countries).includes(country)
                                    : false
                                }
                                onChange={(e) => {
                                  const countries = editingPayment.countries
                                    ? JSON.parse(editingPayment.countries)
                                    : [];
                                  if (e.target.checked) {
                                    countries.push(country);
                                  } else {
                                    countries.splice(countries.indexOf(country), 1);
                                  }
                                  setEditingPayment({
                                    ...editingPayment,
                                    countries: JSON.stringify([...new Set(countries)]),
                                  });
                                }}
                                className="w-4 h-4 text-cyan-500 rounded"
                              />
                              <label htmlFor={`country-${country}`} className="text-sm text-gray-600">
                                {country}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="payment-active"
                          checked={editingPayment.isActive || false}
                          onChange={(e) => setEditingPayment({ ...editingPayment, isActive: e.target.checked })}
                          className="w-4 h-4 text-purple-500 rounded"
                        />
                        <label htmlFor="payment-active" className="text-sm text-gray-600">
                          Actif
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={savePaymentMethod} disabled={saving}>
                        Sauvegarder
                      </button>
                      <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition" onClick={() => setEditingPayment(null)}>
                        Annuler
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* UI Components Tab */}
          {activeTab === 'ui' && (
            <motion.div
              key="ui"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="p-3 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">🎨 Composants d'interface</h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Pour une configuration avancée du thème, utilisez le{' '}
                    <a
                      href="/super-admin/theme-configurator"
                      className="text-primary hover:underline"
                    >
                      Configurateur de Thème
                    </a>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-6 bg-white rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Animations</h3>
                      <p className="text-sm text-gray-600">
                        Gérez les animations, effets visuels, et transitions
                      </p>
                    </div>
                    <div className="p-6 bg-white rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Typographie</h3>
                      <p className="text-sm text-gray-600">
                        Configurez les polices, tailles, et styles de texte
                      </p>
                    </div>
                    <div className="p-6 bg-white rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Composants</h3>
                      <p className="text-sm text-gray-600">
                        Montrer/masquer des composants par pays ou rôle
                      </p>
                    </div>
                    <div className="p-6 bg-white rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Arrière-plans</h3>
                      <p className="text-sm text-gray-600">
                        Particules, dégradés, matrix, vagues animées
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SuperAdminLayout>
  );
}
