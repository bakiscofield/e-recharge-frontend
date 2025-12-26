'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  FileText,
  Users,
  BarChart3,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  DollarSign,
  ArrowRight,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-6 space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-primary/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-xl overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 truncate">
                Bonjour, {user?.firstName} 👋
              </h1>
              <p className="text-white/90 text-xs sm:text-sm">
                Aperçu de votre activité
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 flex-shrink-0">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-semibold text-sm sm:text-base">En ligne</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {/* Pending Orders */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                  En attente
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Demandes en attente</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.pendingOrders || 0}
              </p>
            </div>
          </motion.div>

          {/* Total Orders */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total commandes</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalOrders || 0}
              </p>
            </div>
          </motion.div>

          {/* Total Users */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total clients</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalUsers || 0}
              </p>
            </div>
          </motion.div>

          {/* Revenue */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Revenus</p>
              <p className="text-3xl font-bold text-gray-900">
                {(stats?.totalRevenue || 0).toLocaleString()} FCFA
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/admin/demandes')}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 text-left shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform" />
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Gérer les demandes</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Voir et traiter les demandes de dépôt et retrait
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    <span>Accéder</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </button>

            <button
              className="group relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 sm:p-8 text-left shadow-sm transition-all duration-300 border border-gray-200 overflow-hidden cursor-not-allowed opacity-60"
              disabled
            >
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4">
                    <BarChart3 className="h-7 w-7 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Statistiques avancées</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Analyse détaillée de votre activité
                  </p>
                  <div className="flex items-center text-gray-400 font-medium">
                    <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">Bientôt disponible</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
