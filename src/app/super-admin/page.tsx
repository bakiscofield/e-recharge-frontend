'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SuperAdminLayout } from '@/components/Layout/SuperAdminLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Search, Edit2, Trash2, UserPlus, Eye, EyeOff, X, Bell } from 'lucide-react';

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

interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface User {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  isActive: boolean;
  country: string;
  createdAt: string;
  referralCode?: string;
}

export default function SuperAdminDashboard() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'admins' | 'agents' | 'users' | 'config' | 'theme'>('overview');
  const [loading, setLoading] = useState(true);

  // Listen for hash changes to set active tab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['overview', 'admins', 'agents', 'users', 'config', 'theme'].includes(hash)) {
        setActiveTab(hash as any);
      }
    };

    // Set initial tab from hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Admin management states
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminSearch, setAdminSearch] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [adminFormData, setAdminFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    country: 'TG',
    role: 'ADMIN',
  });

  // Agent management states
  const [agents, setAgents] = useState<Admin[]>([]);
  const [agentSearch, setAgentSearch] = useState('');
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Admin | null>(null);
  const [agentFormData, setAgentFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    country: 'TG',
    role: 'AGENT',
  });

  // User management states
  const [users, setUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [userCountryFilter, setUserCountryFilter] = useState<string>('ALL');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState(false);
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    country: '',
    role: '',
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    if (activeTab === 'admins') {
      fetchAdmins();
    } else if (activeTab === 'agents') {
      fetchAgents();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

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

  // Admin Management Functions
  const fetchAdmins = async () => {
    try {
      const response = await api.get('/super-admin/admins');
      setAdmins(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des admins');
      console.error(error);
      setAdmins([]);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/super-admin/admins', adminFormData);
      toast.success('Admin créé avec succès');
      setShowAdminModal(false);
      resetAdminForm();
      fetchAdmins();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    try {
      await api.put(`/super-admin/admins/${editingAdmin.id}`, {
        firstName: adminFormData.firstName,
        lastName: adminFormData.lastName,
        phone: adminFormData.phone,
        email: adminFormData.email,
      });
      toast.success('Admin mis à jour avec succès');
      setShowAdminModal(false);
      resetAdminForm();
      fetchAdmins();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleToggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      await api.put(`/super-admin/admins/${adminId}/status`, { isActive: !currentStatus });
      toast.success(`Admin ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
      fetchAdmins();
    } catch (error: any) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet admin ?')) return;
    try {
      await api.delete(`/super-admin/admins/${adminId}`);
      toast.success('Admin supprimé avec succès');
      fetchAdmins();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openEditAdminModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setAdminFormData({
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      phone: admin.phone,
      password: '',
      country: 'TG',
      role: admin.role,
    });
    setShowAdminModal(true);
  };

  const resetAdminForm = () => {
    setAdminFormData({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      country: 'TG',
      role: 'ADMIN',
    });
    setEditingAdmin(null);
  };

  // Agent Management Functions
  const fetchAgents = async () => {
    try {
      const response = await api.get('/super-admin/agents');
      setAgents(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des agents');
      console.error(error);
      setAgents([]);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/super-admin/agents', agentFormData);
      const assignmentsCount = response.data?.assignmentsCreated || 0;
      toast.success(
        `Agent créé avec succès ! ${assignmentsCount} assignation(s) automatique(s) créée(s).`
      );
      setShowAgentModal(false);
      resetAgentForm();
      fetchAgents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleUpdateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;
    try {
      await api.put(`/super-admin/agents/${editingAgent.id}`, {
        firstName: agentFormData.firstName,
        lastName: agentFormData.lastName,
        phone: agentFormData.phone,
        email: agentFormData.email,
      });
      toast.success('Agent mis à jour avec succès');
      setShowAgentModal(false);
      resetAgentForm();
      fetchAgents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleToggleAgentStatus = async (agentId: string, currentStatus: boolean) => {
    try {
      await api.put(`/super-admin/agents/${agentId}/status`, { isActive: !currentStatus });
      toast.success(`Agent ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
      fetchAgents();
    } catch (error: any) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) return;
    try {
      await api.delete(`/super-admin/agents/${agentId}`);
      toast.success('Agent supprimé avec succès');
      fetchAgents();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openEditAgentModal = (agent: Admin) => {
    setEditingAgent(agent);
    setAgentFormData({
      email: agent.email,
      firstName: agent.firstName,
      lastName: agent.lastName,
      phone: agent.phone,
      password: '',
      country: 'TG',
      role: agent.role,
    });
    setShowAgentModal(true);
  };

  const resetAgentForm = () => {
    setAgentFormData({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      country: 'TG',
      role: 'AGENT',
    });
    setEditingAgent(null);
  };

  // User Management Functions
  const fetchUsers = async () => {
    try {
      const response = await api.get('/super-admin/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des utilisateurs');
      console.error(error);
      setUsers([]);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await api.put(`/super-admin/users/${userId}/status`, { isActive: !currentStatus });
      toast.success(`Utilisateur ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
      fetchUsers();
    } catch (error: any) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/super-admin/users/${userId}`);
      toast.success('Utilisateur supprimé avec succès');
      fetchUsers();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await api.put(`/super-admin/users/${selectedUser.id}`, userFormData);
      toast.success('Utilisateur mis à jour avec succès');
      setEditingUser(false);
      setShowUserModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const openUserDetails = (user: User, editMode = false) => {
    setSelectedUser(user);
    setUserFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email || '',
      country: user.country,
      role: user.role,
    });
    setEditingUser(editMode);
    setShowUserModal(true);
  };

  // Filtered data
  const filteredAdmins = admins.filter(admin =>
    `${admin.firstName} ${admin.lastName} ${admin.email} ${admin.phone}`
      .toLowerCase()
      .includes(adminSearch.toLowerCase())
  );

  const filteredAgents = agents.filter(agent =>
    `${agent.firstName} ${agent.lastName} ${agent.email} ${agent.phone}`
      .toLowerCase()
      .includes(agentSearch.toLowerCase())
  );

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email || ''} ${user.phone}`
      .toLowerCase()
      .includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || user.role === userRoleFilter;
    const matchesCountry = userCountryFilter === 'ALL' || user.country === userCountryFilter;
    return matchesSearch && matchesRole && matchesCountry;
  });

  // Get unique countries from users
  const uniqueCountries = Array.from(new Set(users.map(u => u.country)));

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'admins', label: 'Admins', icon: '👥' },
    { id: 'agents', label: 'Agents', icon: '🎯' },
    { id: 'users', label: 'Utilisateurs', icon: '👤' },
    { id: 'config', label: 'Configuration', icon: '⚙️' },
    { id: 'theme', label: 'Thème & UI', icon: '🎨' },
  ];

  return (
    <SuperAdminLayout>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-gray-900">
                Dashboard Super Admin
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Contrôle total de la plateforme</p>
            </div>
            {/* Bouton de test des notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                try {
                  await api.post('/notifications/test', {
                    title: '🧪 Test de notification',
                    body: `Test envoyé à ${new Date().toLocaleTimeString('fr-FR')}`
                  });
                  toast.success('✅ Notification de test envoyée !');
                } catch (error: any) {
                  toast.error('❌ ' + (error.response?.data?.message || 'Erreur'));
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
            >
              <Bell size={20} />
              <span className="font-medium">Tester notif</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`
                px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap flex-shrink-0
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
              <span className="mr-1 sm:mr-2">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
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
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Revenus Total</h3>
                  <p className="text-sm sm:text-base text-white/90">Commissions générées</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl sm:text-3xl font-bold">{statistics.orders.revenue.toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Actions rapides</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                <button
                  className="px-3 sm:px-4 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition text-sm sm:text-base"
                  onClick={() => setActiveTab('admins')}
                >
                  <span className="mr-1 sm:mr-2">➕</span>
                  <span className="hidden sm:inline">Créer un </span>Admin
                </button>
                <button
                  className="px-3 sm:px-4 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition text-sm sm:text-base"
                  onClick={() => setActiveTab('agents')}
                >
                  <span className="mr-1 sm:mr-2">🎯</span>
                  <span className="hidden sm:inline">Gérer </span>Agents
                </button>
                <button
                  className="px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm sm:text-base"
                  onClick={() => window.location.href = '/super-admin/agent-assignments'}
                >
                  <span className="mr-1 sm:mr-2">🔗</span>
                  Assignations
                </button>
                <button
                  className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition text-sm sm:text-base"
                  onClick={() => window.location.href = '/super-admin/configuration'}
                >
                  <span className="mr-1 sm:mr-2">⚙️</span>
                  Configuration
                </button>
                <button
                  className="px-3 sm:px-4 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition text-sm sm:text-base"
                  onClick={() => window.location.href = '/super-admin/theme-configurator'}
                >
                  <span className="mr-1 sm:mr-2">🎨</span>
                  Thème
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
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Gestion des Admins</h2>
                <button
                  onClick={() => {
                    resetAdminForm();
                    setShowAdminModal(true);
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition flex items-center gap-2"
                >
                  <UserPlus className="h-5 w-5" />
                  Nouveau Admin
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un admin..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Admins List */}
              <div className="space-y-3">
                {filteredAdmins.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    {adminSearch ? 'Aucun admin trouvé' : 'Aucun admin pour le moment'}
                  </div>
                ) : (
                  filteredAdmins.map((admin) => (
                    <div key={admin.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">
                              {admin.firstName} {admin.lastName}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              admin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {admin.isActive ? 'Actif' : 'Inactif'}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {admin.role}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>📧 {admin.email}</p>
                            <p>📱 {admin.phone}</p>
                            <p className="text-xs text-gray-400">Créé le {new Date(admin.createdAt).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditAdminModal(admin)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Modifier"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleToggleAdminStatus(admin.id, admin.isActive)}
                            className={`p-2 rounded-lg transition ${
                              admin.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={admin.isActive ? 'Désactiver' : 'Activer'}
                          >
                            {admin.isActive ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Gestion des Agents</h2>
                <button
                  onClick={() => {
                    resetAgentForm();
                    setShowAgentModal(true);
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition flex items-center gap-2"
                >
                  <UserPlus className="h-5 w-5" />
                  Nouvel Agent
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un agent..."
                    value={agentSearch}
                    onChange={(e) => setAgentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Agents List */}
              <div className="space-y-3">
                {filteredAgents.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    {agentSearch ? 'Aucun agent trouvé' : 'Aucun agent pour le moment'}
                  </div>
                ) : (
                  filteredAgents.map((agent) => (
                    <div key={agent.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">
                              {agent.firstName} {agent.lastName}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              agent.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {agent.isActive ? 'Actif' : 'Inactif'}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              {agent.role}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>📧 {agent.email}</p>
                            <p>📱 {agent.phone}</p>
                            <p className="text-xs text-gray-400">Créé le {new Date(agent.createdAt).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditAgentModal(agent)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Modifier"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleToggleAgentStatus(agent.id, agent.isActive)}
                            className={`p-2 rounded-lg transition ${
                              agent.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={agent.isActive ? 'Désactiver' : 'Activer'}
                          >
                            {agent.isActive ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                          <button
                            onClick={() => handleDeleteAgent(agent.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Gestion des Utilisateurs</h2>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="ALL">Tous les rôles</option>
                  <option value="CLIENT">Clients</option>
                  <option value="AGENT">Agents</option>
                  <option value="ADMIN">Admins</option>
                </select>
                <select
                  value={userCountryFilter}
                  onChange={(e) => setUserCountryFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="ALL">Tous les pays</option>
                  {uniqueCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Users List */}
              <div className="space-y-3">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    {userSearch || userRoleFilter !== 'ALL' ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur pour le moment'}
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-bold text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {user.isActive ? 'Actif' : 'Inactif'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'CLIENT' ? 'bg-blue-100 text-blue-700' :
                              user.role === 'AGENT' ? 'bg-purple-100 text-purple-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {user.role}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {user.country}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            {user.email && <p>📧 {user.email}</p>}
                            <p>📱 {user.phone}</p>
                            {user.referralCode && <p>🎁 Code parrainage: {user.referralCode}</p>}
                            <p className="text-xs text-gray-400">Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openUserDetails(user, false)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Voir détails"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openUserDetails(user, true)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            title="Modifier"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                            className={`p-2 rounded-lg transition ${
                              user.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={user.isActive ? 'Désactiver' : 'Activer'}
                          >
                            {user.isActive ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Configuration Globale</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                Gérez tous les aspects de l'application : branding, bookmakers, méthodes de paiement, et interface utilisateur.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Personnalisation Visuelle</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                Créez une expérience visuelle unique avec le configurateur de thème avancé.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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

        {/* Admin Modal */}
        {showAdminModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingAdmin ? 'Modifier Admin' : 'Nouvel Admin'}
                </h3>
                <button
                  onClick={() => {
                    setShowAdminModal(false);
                    resetAdminForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={editingAdmin ? handleUpdateAdmin : handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    value={adminFormData.firstName}
                    onChange={(e) => setAdminFormData({ ...adminFormData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={adminFormData.lastName}
                    onChange={(e) => setAdminFormData({ ...adminFormData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={adminFormData.email}
                    onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={!!editingAdmin}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={adminFormData.phone}
                    onChange={(e) => setAdminFormData({ ...adminFormData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                  <select
                    value={adminFormData.country}
                    onChange={(e) => setAdminFormData({ ...adminFormData, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="TG">Togo</option>
                    <option value="BJ">Bénin</option>
                    <option value="CI">Côte d'Ivoire</option>
                  </select>
                </div>

                {!editingAdmin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                      <input
                        type="password"
                        value={adminFormData.password}
                        onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                      <select
                        value={adminFormData.role}
                        onChange={(e) => setAdminFormData({ ...adminFormData, role: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="AGENT">Agent</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminModal(false);
                      resetAdminForm();
                    }}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                  >
                    {editingAdmin ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Agent Modal */}
        {showAgentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingAgent ? 'Modifier Agent' : 'Nouvel Agent'}
                </h3>
                <button
                  onClick={() => {
                    setShowAgentModal(false);
                    resetAgentForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={editingAgent ? handleUpdateAgent : handleCreateAgent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    value={agentFormData.firstName}
                    onChange={(e) => setAgentFormData({ ...agentFormData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={agentFormData.lastName}
                    onChange={(e) => setAgentFormData({ ...agentFormData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={agentFormData.email}
                    onChange={(e) => setAgentFormData({ ...agentFormData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={!!editingAgent}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={agentFormData.phone}
                    onChange={(e) => setAgentFormData({ ...agentFormData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                  <select
                    value={agentFormData.country}
                    onChange={(e) => setAgentFormData({ ...agentFormData, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="TG">Togo</option>
                    <option value="BJ">Bénin</option>
                    <option value="CI">Côte d'Ivoire</option>
                  </select>
                </div>

                {!editingAgent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                    <input
                      type="password"
                      value={agentFormData.password}
                      onChange={(e) => setAgentFormData({ ...agentFormData, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAgentModal(false);
                      resetAgentForm();
                    }}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                  >
                    {editingAgent ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* User Details/Edit Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingUser ? 'Modifier Utilisateur' : 'Détails Utilisateur'}
                </h3>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                    setEditingUser(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!editingUser ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                      {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{selectedUser.role}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    {selectedUser.email && (
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{selectedUser.email}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-900">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pays</p>
                      <p className="font-medium text-gray-900">{selectedUser.country}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rôle</p>
                      <p className="font-medium text-gray-900">{selectedUser.role}</p>
                    </div>
                    {selectedUser.referralCode && (
                      <div>
                        <p className="text-sm text-gray-500">Code de parrainage</p>
                        <p className="font-medium text-gray-900">{selectedUser.referralCode}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedUser.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {selectedUser.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date d'inscription</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setEditingUser(true)}
                      className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        setShowUserModal(false);
                        setSelectedUser(null);
                      }}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={userFormData.firstName}
                      onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={userFormData.lastName}
                      onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={userFormData.phone}
                      onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                    <select
                      value={userFormData.country}
                      onChange={(e) => setUserFormData({ ...userFormData, country: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="TG">Togo</option>
                      <option value="BJ">Bénin</option>
                      <option value="CI">Côte d'Ivoire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                    <select
                      value={userFormData.role}
                      onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="CLIENT">Client</option>
                      <option value="AGENT">Agent</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingUser(false)}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}
