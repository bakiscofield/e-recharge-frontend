'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SuperAdminLayout } from '@/components/Layout/SuperAdminLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Power, X, Search, ChevronDown, User } from 'lucide-react';

interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  isOnline: boolean;
}

interface Bookmaker {
  id: string;
  name: string;
  logo: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
}

interface AgentAssignment {
  id: string;
  employee: Agent;
  bookmaker: Bookmaker;
  paymentMethod: PaymentMethod & { category?: string };
  country: string;
  phoneNumber?: string;
  syntaxe?: string;
  frais: number;
  address?: string;
  paymentLink?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AgentAssignmentsPage() {
  const [assignments, setAssignments] = useState<AgentAssignment[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AgentAssignment | null>(null);

  // États pour le select moderne d'agents
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [agentSearchQuery, setAgentSearchQuery] = useState('');
  const agentDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    agentId: '',
    bookmakerId: '',
    paymentMethodId: '',
    country: 'TG',
    phoneNumber: '',
    syntaxe: '',
    frais: 0,
    address: '',
    paymentLink: '',
  });

  const [addressFields, setAddressFields] = useState({
    street: '',
    city: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  // Fermer le dropdown d'agents quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (agentDropdownRef.current && !agentDropdownRef.current.contains(event.target as Node)) {
        setShowAgentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrer les agents selon la recherche
  const filteredAgents = agents.filter((agent) =>
    `${agent.firstName} ${agent.lastName} ${agent.phone}`
      .toLowerCase()
      .includes(agentSearchQuery.toLowerCase())
  );

  // Obtenir l'agent sélectionné
  const selectedAgent = agents.find((a) => a.id === formData.agentId);

  const loadData = async () => {
    try {
      const [assignmentsRes, agentsRes, bookmakersRes, paymentMethodsRes] = await Promise.all([
        api.get('/super-admin/agent-assignments'),
        api.get('/super-admin/agents'),
        api.get('/bookmakers'),
        api.get('/payment-methods'),
      ]);

      setAssignments(assignmentsRes.data);
      setAgents(agentsRes.data);
      setBookmakers(bookmakersRes.data);
      setPaymentMethods(paymentMethodsRes.data);
    } catch (error) {
      console.error('Erreur de chargement:', error);
      toast.error('Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingAssignment(null);
    setFormData({
      agentId: '',
      bookmakerId: '',
      paymentMethodId: '',
      country: 'TG',
      phoneNumber: '',
      syntaxe: '',
      frais: 0,
      address: '',
      paymentLink: '',
    });
    setAddressFields({
      street: '',
      city: '',
    });
    setShowModal(true);
  };

  const parseAddress = (address?: string): { street: string; city: string } => {
    if (!address) return { street: '', city: '' };
    const parts = address.split(',');
    return {
      street: parts[0]?.trim() || '',
      city: parts[1]?.trim() || '',
    };
  };

  const openEditModal = (assignment: AgentAssignment) => {
    setEditingAssignment(assignment);

    const { street, city } = parseAddress(assignment.address);

    setFormData({
      agentId: assignment.employee.id,
      bookmakerId: assignment.bookmaker.id,
      paymentMethodId: assignment.paymentMethod.id,
      country: assignment.country,
      phoneNumber: assignment.phoneNumber || '',
      syntaxe: assignment.syntaxe || '',
      frais: assignment.frais,
      address: assignment.address || '',
      paymentLink: assignment.paymentLink || '',
    });
    setAddressFields({
      street,
      city,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    // Validation
    if (!editingAssignment) {
      if (!formData.agentId || !formData.bookmakerId || !formData.paymentMethodId) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }

    // Valider les champs d'adresse
    if (!addressFields.street || addressFields.street.trim() === '') {
      toast.error('La rue est obligatoire');
      return;
    }

    if (!addressFields.city || addressFields.city.trim() === '') {
      toast.error('La ville est obligatoire');
      return;
    }

    // Combiner rue et ville
    const fullAddress = `${addressFields.street.trim()}, ${addressFields.city.trim()}`;

    try {
      if (editingAssignment) {
        // Update
        await api.put(`/super-admin/agent-assignments/${editingAssignment.id}`, {
          phoneNumber: formData.phoneNumber,
          syntaxe: formData.syntaxe,
          frais: formData.frais,
          address: fullAddress,
          paymentLink: formData.paymentLink || null,
        });
        toast.success('Assignation mise à jour');
      } else {
        // Create
        await api.post('/super-admin/agent-assignments', {
          ...formData,
          address: fullAddress,
          paymentLink: formData.paymentLink || null,
        });
        toast.success('Assignation créée');
      }
      setShowModal(false);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'opération');
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await api.put(`/super-admin/agent-assignments/${id}/toggle-status`);
      toast.success('Statut modifié');
      loadData();
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const deleteAssignment = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette assignation ?')) return;

    try {
      await api.delete(`/super-admin/agent-assignments/${id}`);
      toast.success('Assignation supprimée');
      loadData();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const countries = [
    { code: 'TG', name: 'Togo' },
    { code: 'BJ', name: 'Bénin' },
    { code: 'CI', name: 'Côte d\'Ivoire' },
    { code: 'SN', name: 'Sénégal' },
    { code: 'ML', name: 'Mali' },
  ];

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-xl">Chargement...</div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-gray-900">
              Assignations Agents
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Gérer les assignations bookmaker-paiement
            </p>
          </div>
          <button
            className="px-4 py-2.5 sm:py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 flex-shrink-0 w-full sm:w-auto"
            onClick={openCreateModal}
          >
            <Plus className="h-5 w-5" />
            <span>Nouvelle Assignation</span>
          </button>
        </motion.div>

        {/* Assignments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {assignments.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <p className="text-gray-600">Aucune assignation pour le moment</p>
            </div>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Agent */}
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Agent</div>
                        <div className="font-semibold text-gray-900">
                          {assignment.employee.firstName} {assignment.employee.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{assignment.employee.phone}</div>
                      </div>

                      {/* Bookmaker & Paiement */}
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Bookmaker</div>
                        <div className="font-semibold text-gray-900">{assignment.bookmaker.name}</div>
                        <div className="text-sm text-gray-600 mt-2">Paiement</div>
                        <div className="font-semibold text-gray-900">{assignment.paymentMethod.name}</div>
                      </div>

                      {/* Détails */}
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Pays</div>
                        <div className="font-semibold text-gray-900">{assignment.country}</div>
                        <div className="text-sm text-gray-600 mt-2">Frais</div>
                        <div className="font-semibold text-gray-900">{assignment.frais} FCFA</div>
                      </div>

                      {/* Contact */}
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Numéro Marchand</div>
                        <div className="font-semibold text-gray-900">
                          {assignment.phoneNumber || 'Non défini'}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">Statut</div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              assignment.isActive
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {assignment.isActive ? 'Actif' : 'Inactif'}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              assignment.paymentMethod.category === 'lien'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-orange-500/20 text-orange-400'
                            }`}
                          >
                            {assignment.paymentMethod.category === 'lien' ? 'Lien' : 'Syntaxe'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Adresse de retrait */}
                    {assignment.address && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">📍 Adresse de retrait</div>
                        <div className="text-gray-900">{assignment.address}</div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => toggleStatus(assignment.id)}
                      className={`p-2 rounded-lg transition ${
                        assignment.isActive
                          ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                          : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                      }`}
                      title={assignment.isActive ? 'Désactiver' : 'Activer'}
                    >
                      <Power className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openEditModal(assignment)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition"
                      title="Modifier"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteAssignment(assignment.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>

      {/* Modal Création/Édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a3f] rounded-2xl border border-purple-500/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingAssignment ? 'Modifier l\'assignation' : 'Nouvelle assignation'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Agent - Select moderne */}
              {!editingAssignment && (
                <div ref={agentDropdownRef} className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                    className="w-full px-4 py-3 bg-[#0a0a1f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent flex items-center justify-between hover:bg-[#0f0f2f] transition"
                  >
                    <div className="flex items-center gap-3">
                      {selectedAgent ? (
                        <>
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {selectedAgent.firstName[0]}{selectedAgent.lastName[0]}
                          </div>
                          <div className="text-left">
                            <div className="font-medium">
                              {selectedAgent.firstName} {selectedAgent.lastName}
                            </div>
                            <div className="text-xs text-gray-400">{selectedAgent.phone}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-400">Sélectionnez un agent</span>
                        </>
                      )}
                    </div>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showAgentDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {showAgentDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-[#0a0a1f] border border-purple-500/30 rounded-lg shadow-xl overflow-hidden"
                      >
                        {/* Barre de recherche */}
                        <div className="p-3 border-b border-purple-500/30">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              value={agentSearchQuery}
                              onChange={(e) => setAgentSearchQuery(e.target.value)}
                              placeholder="Rechercher un agent..."
                              className="w-full pl-10 pr-4 py-2 bg-[#1a1a3f] border border-purple-500/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        {/* Liste des agents */}
                        <div className="max-h-60 overflow-y-auto">
                          {filteredAgents.length === 0 ? (
                            <div className="p-4 text-center text-gray-400 text-sm">
                              Aucun agent trouvé
                            </div>
                          ) : (
                            filteredAgents.map((agent) => (
                              <button
                                key={agent.id}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, agentId: agent.id });
                                  setShowAgentDropdown(false);
                                  setAgentSearchQuery('');
                                }}
                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-500/10 transition ${
                                  formData.agentId === agent.id ? 'bg-purple-500/20' : ''
                                }`}
                              >
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {agent.firstName[0]}{agent.lastName[0]}
                                </div>
                                <div className="text-left flex-1">
                                  <div className="font-medium text-white">
                                    {agent.firstName} {agent.lastName}
                                  </div>
                                  <div className="text-xs text-gray-400">{agent.phone}</div>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Bookmaker */}
              {!editingAssignment && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bookmaker
                  </label>
                  <select
                    value={formData.bookmakerId}
                    onChange={(e) => setFormData({ ...formData, bookmakerId: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a1f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionnez un bookmaker</option>
                    {bookmakers.map((bm) => (
                      <option key={bm.id} value={bm.id}>
                        {bm.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Moyen de paiement */}
              {!editingAssignment && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Moyen de paiement
                  </label>
                  <select
                    value={formData.paymentMethodId}
                    onChange={(e) => setFormData({ ...formData, paymentMethodId: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a1f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionnez un moyen de paiement</option>
                    {paymentMethods.map((pm) => (
                      <option key={pm.id} value={pm.id}>
                        {pm.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Pays */}
              {!editingAssignment && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pays
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a1f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Numéro marchand */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Numéro marchand (Mobile Money)
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="90 12 34 56"
                  className="w-full px-4 py-3 bg-[#0a0a1f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Numéro du compte marchand (pas besoin de +228 ou 228)
                </p>
              </div>

              {/* Syntaxe USSD */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Syntaxe USSD
                </label>
                <input
                  type="text"
                  value={formData.syntaxe}
                  onChange={(e) => setFormData({ ...formData, syntaxe: e.target.value })}
                  placeholder="*155*1*{montant}*{numero}#"
                  className="w-full px-4 py-3 bg-[#0a0a1f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Utilisez {'{montant}'} pour le montant dynamique
                </p>
              </div>

              {/* Lien de paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lien de paiement
                </label>
                <input
                  type="url"
                  value={formData.paymentLink}
                  onChange={(e) => setFormData({ ...formData, paymentLink: e.target.value })}
                  placeholder="https://example.com/paiement"
                  className="w-full px-4 py-3 bg-[#0a0a1f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  URL vers laquelle le client sera redirigé (pour les moyens de paiement de type "lien")
                </p>
              </div>

              {/* Frais */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Frais (FCFA)
                </label>
                <input
                  type="number"
                  value={formData.frais}
                  onChange={(e) => setFormData({ ...formData, frais: parseFloat(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-3 bg-[#0a0a1f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Rue */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rue <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={addressFields.street}
                  onChange={(e) => setAddressFields({ ...addressFields, street: e.target.value })}
                  placeholder="Ex: Rue du Commerce, Quartier Adidogomé"
                  className="w-full px-4 py-3 bg-[#0a0a1f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Ville */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ville <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={addressFields.city}
                  onChange={(e) => setAddressFields({ ...addressFields, city: e.target.value })}
                  placeholder="Ex: Lomé"
                  className="w-full px-4 py-3 bg-[#0a0a1f] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  L'adresse de retrait sera affichée au client : Rue, Ville
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition"
                onClick={handleSubmit}
              >
                {editingAssignment ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </SuperAdminLayout>
  );
}
