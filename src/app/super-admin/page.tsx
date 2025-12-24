'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SuperAdminLayout } from '@/components/Layout/SuperAdminLayout';
import api from '@/lib/api';

interface Statistics {
  users: {
    total: number;
    admins: number;
    clients: number;
    agents: number;
    active: number;
  };
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    revenue: number;
    fees: number;
  };
  system: {
    bookmakers: number;
    paymentMethods: number;
  };
}

export default function SuperAdminDashboard() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'admins' | 'users' | 'config' | 'theme'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/super-admin/statistics');
      setStatistics(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'admins', label: 'Admins', icon: '👥' },
    { id: 'users', label: 'Utilisateurs', icon: '👤' },
    { id: 'config', label: 'Configuration', icon: '⚙️' },
    { id: 'theme', label: 'Thème & UI', icon: '🎨' },
  ];

  return (
    <SuperAdminLayout>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-gray-900">
            Dashboard Super Admin
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Contrôle total de la plateforme</p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`
                px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base whitespace-nowrap flex-shrink-0
                transition-all duration-300
                ${activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && statistics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Revenue Card */}
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Revenus Total</h3>
                  <p className="text-white/90">Commissions générées</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{statistics.orders.revenue.toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Users Card */}
              <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                <div className="relative">
                  <div className="text-4xl mb-2">👥</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {statistics.users.total}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">Utilisateurs total</p>
                  <div className="mt-4 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clients:</span>
                      <span className="text-primary font-semibold">{statistics.users.clients}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agents:</span>
                      <span className="text-primary font-semibold">{statistics.users.agents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admins:</span>
                      <span className="text-primary font-semibold">{statistics.users.admins}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Card */}
              <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                <div className="relative">
                  <div className="text-4xl mb-2">📦</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {statistics.orders.total}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">Commandes total</p>
                  <div className="mt-4 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">En attente:</span>
                      <span className="text-yellow-600 font-semibold">{statistics.orders.pending}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confirmées:</span>
                      <span className="text-green-600 font-semibold">{statistics.orders.confirmed}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bookmakers Card */}
              <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                <div className="relative">
                  <div className="text-4xl mb-2">🎰</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {statistics.system.bookmakers}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">Bookmakers actifs</p>
                  <button className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
                    Gérer
                  </button>
                </div>
              </div>

              {/* Payment Methods Card */}
              <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                <div className="relative">
                  <div className="text-4xl mb-2">💳</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {statistics.system.paymentMethods}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">Moyens de paiement</p>
                  <button className="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition">
                    Gérer
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  className="px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition"
                  onClick={() => setActiveTab('admins')}
                >
                  <span className="mr-2">➕</span>
                  Créer un Admin
                </button>
                <button
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  onClick={() => window.location.href = '/super-admin/agent-assignments'}
                >
                  <span className="mr-2">🔗</span>
                  Assignations Agents
                </button>
                <button
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition"
                  onClick={() => window.location.href = '/super-admin/configuration'}
                >
                  <span className="mr-2">⚙️</span>
                  Configuration Complète
                </button>
                <button
                  className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                  onClick={() => window.location.href = '/super-admin/theme-configurator'}
                >
                  <span className="mr-2">🎨</span>
                  Personnaliser le Thème
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Admins Tab */}
        {activeTab === 'admins' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Gestion des Admins</h2>
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition">
                  <span className="mr-2">➕</span>
                  Nouveau Admin
                </button>
              </div>
              <p className="text-gray-600 text-center py-12">
                Interface de gestion des admins (à implémenter)
              </p>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Gestion des Utilisateurs</h2>
              <p className="text-gray-600 text-center py-12">
                Interface de gestion des utilisateurs (à implémenter)
              </p>
            </div>
          </motion.div>
        )}

        {/* Config Tab */}
        {activeTab === 'config' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Configuration Globale</h2>
              <p className="text-gray-600 mb-8">
                Gérez tous les aspects de l'application : branding, bookmakers, méthodes de paiement, et interface utilisateur.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-gray-200 hover:border-primary transition-all cursor-pointer group hover:shadow-md"
                  onClick={() => window.location.href = '/super-admin/configuration'}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Image de Marque</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Nom de l'app, logo, slogan, couleurs principales
                  </p>
                  <div className="text-primary text-sm font-medium">
                    Configurer →
                  </div>
                </div>

                <div
                  className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-gray-200 hover:border-purple-500 transition-all cursor-pointer group hover:shadow-md"
                  onClick={() => window.location.href = '/super-admin/configuration'}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎰</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bookmakers</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Ajouter, modifier, organiser les bookmakers disponibles
                  </p>
                  <div className="text-purple-600 text-sm font-medium">
                    Gérer →
                  </div>
                </div>

                <div
                  className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-gray-200 hover:border-green-500 transition-all cursor-pointer group hover:shadow-md"
                  onClick={() => window.location.href = '/super-admin/configuration'}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💳</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Méthodes de Paiement</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configurer Mobile Money, virements, crypto, cartes bancaires
                  </p>
                  <div className="text-green-600 text-sm font-medium">
                    Configurer →
                  </div>
                </div>

                <div
                  className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-gray-200 hover:border-blue-500 transition-all cursor-pointer group hover:shadow-md"
                  onClick={() => window.location.href = '/super-admin/agent-assignments'}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔗</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Assignations Agents</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Lier agents aux paires bookmaker-paiement
                  </p>
                  <div className="text-blue-600 text-sm font-medium">
                    Gérer →
                  </div>
                </div>

                <div
                  className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-gray-200 hover:border-orange-500 transition-all cursor-pointer group hover:shadow-md"
                  onClick={() => window.location.href = '/super-admin/configuration'}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎛️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Composants UI</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Afficher/masquer des composants par pays ou rôle
                  </p>
                  <div className="text-orange-600 text-sm font-medium">
                    Personnaliser →
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition text-lg"
                  onClick={() => window.location.href = '/super-admin/configuration'}
                >
                  <span className="mr-2">⚙️</span>
                  Ouvrir la Configuration Complète
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Personnalisation Visuelle</h2>
              <p className="text-gray-600 mb-8">
                Créez une expérience visuelle unique avec le configurateur de thème avancé.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition">
                  <div className="text-3xl mb-3">🎨</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Couleurs</h3>
                  <p className="text-sm text-gray-600">
                    Primaire, secondaire, accent, arrière-plan, texte
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-gray-200 hover:shadow-md transition">
                  <div className="text-3xl mb-3">✨</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Effets</h3>
                  <p className="text-sm text-gray-600">
                    Luminosité, animations, particules, dégradés
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-gray-200 hover:shadow-md transition">
                  <div className="text-3xl mb-3">💰</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Animations</h3>
                  <p className="text-sm text-gray-600">
                    Pluie, étincelles, flux, pulsation d'argent
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-gray-200 hover:shadow-md transition">
                  <div className="text-3xl mb-3">🌌</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Arrière-plans</h3>
                  <p className="text-sm text-gray-600">
                    Dégradé, particules, matrix, vagues animées
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-gray-200 hover:shadow-md transition">
                  <div className="text-3xl mb-3">🖋️</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Typographie</h3>
                  <p className="text-sm text-gray-600">
                    Police, taille, style de texte
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-gray-200 hover:shadow-md transition">
                  <div className="text-3xl mb-3">📐</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Mise en page</h3>
                  <p className="text-sm text-gray-600">
                    Rayons, bordures lumineuses, espacements
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-purple-100 rounded-lg border border-primary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aperçu en Temps Réel</h3>
                    <p className="text-gray-600">
                      Visualisez instantanément vos modifications sur Desktop et Mobile
                    </p>
                  </div>
                  <div className="text-5xl">👁️</div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition text-lg"
                  onClick={() => window.location.href = '/super-admin/theme-configurator'}
                >
                  <span className="mr-2">🎨</span>
                  Ouvrir le Configurateur de Thème
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </SuperAdminLayout>
  );
}
