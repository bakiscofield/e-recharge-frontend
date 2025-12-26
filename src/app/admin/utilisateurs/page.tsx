'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Users,
  Search,
  Filter,
  Eye,
  UserCheck,
  UserX,
  Edit,
  Shield,
  Phone,
  Mail,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'CLIENT' | 'AGENT' | 'SUPPORT' | 'ADMIN';
  isActive: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
  _count?: {
    orders: number;
  };
}

type FilterRole = 'ALL' | 'CLIENT' | 'AGENT' | 'ADMIN';

export default function UtilisateursPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<FilterRole>('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(term)
      );
    }

    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      await api.put(`/super-admin/users/${userId}/toggle-status`);
      toast.success('Statut mis à jour');
      loadUsers();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      CLIENT: 'bg-blue-100 text-blue-700',
      AGENT: 'bg-green-100 text-green-700',
      SUPPORT: 'bg-purple-100 text-purple-700',
      ADMIN: 'bg-orange-100 text-orange-700'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      CLIENT: 'Client',
      AGENT: 'Agent',
      SUPPORT: 'Support',
      ADMIN: 'Administrateur'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const stats = {
    total: users.length,
    clients: users.filter(u => u.role === 'CLIENT').length,
    agents: users.filter(u => u.role === 'AGENT').length,
    admins: users.filter(u => u.role === 'ADMIN' || u.role === 'SUPPORT').length,
    active: users.filter(u => u.isActive).length
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        >
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Utilisateurs
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3"
        >
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <p className="text-xs text-gray-600">Total</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{stats.clients}</span>
            </div>
            <p className="text-xs text-gray-600">Clients</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{stats.agents}</span>
            </div>
            <p className="text-xs text-gray-600">Agents</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{stats.admins}</span>
            </div>
            <p className="text-xs text-gray-600">Admins</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-1">
              <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{stats.active}</span>
            </div>
            <p className="text-xs text-gray-600">Actifs</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100"
        >
          <div className="flex flex-col gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Role Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1">
              {(['ALL', 'CLIENT', 'AGENT', 'ADMIN'] as FilterRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`
                    px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition flex-shrink-0
                    ${roleFilter === role
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {role === 'ALL' ? 'Tous' : getRoleLabel(role)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Users List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 sm:space-y-3"
        >
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 text-center shadow-sm border border-gray-100">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
              <p className="text-sm sm:text-base text-gray-600">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar & Info */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                          {user.firstName} {user.lastName}
                        </h3>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-xs text-gray-600">
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          {user.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-start gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => viewUserDetails(user)}
                      className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Détails"
                    >
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>

                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`p-1.5 sm:p-2 rounded-lg transition ${
                        user.isActive
                          ? 'text-yellow-600 hover:bg-yellow-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={user.isActive ? 'Désactiver' : 'Activer'}
                    >
                      {user.isActive ? <UserX className="h-4 w-4 sm:h-5 sm:w-5" /> : <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>

        {/* User Details Modal */}
        {showDetailsModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Détails utilisateur</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg sm:text-2xl flex-shrink-0">
                    {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-xl font-semibold text-gray-900 truncate">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium mt-1 ${getRoleBadgeColor(selectedUser.role)}`}>
                      {getRoleLabel(selectedUser.role)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Email</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Téléphone</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Statut</p>
                    <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-medium ${
                      selectedUser.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedUser.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Date d'inscription</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  {selectedUser._count && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Nombre de commandes</p>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{selectedUser._count.orders || 0}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  onClick={() => toggleUserStatus(selectedUser.id)}
                  className={`w-full sm:flex-1 px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base transition ${
                    selectedUser.isActive
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {selectedUser.isActive ? 'Désactiver' : 'Activer'}
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full sm:flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium text-sm sm:text-base transition"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
