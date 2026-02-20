'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Check, X, Clock, User, DollarSign, Phone, Hash, FileText, ChevronDown, ChevronUp, Copy } from 'lucide-react';

interface Order {
  id: string;
  type: 'DEPOT' | 'RETRAIT';
  amount: number;
  fees: number;
  state: string;
  clientContact: string;
  bookmakerIdentifier?: string;
  referenceId?: string;
  createdAt: string;
  client: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  bookmaker: {
    name: string;
    logo: string;
  };
  employeePaymentMethod: {
    paymentMethod: {
      name: string;
    };
    phoneNumber?: string;
    address?: string;
  };
}

export default function DemandesPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'COMING' | 'ALL'>('COMING');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Récupérer toutes les commandes assignées à cet admin/caissier
      const response = await api.get('/admin/orders', {
        params: { state: filter === 'COMING' ? 'COMING' : undefined },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Erreur de chargement:', error);
      toast.error('Erreur de chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (orderId: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, {
        state: 'CONFIRMED',
      });
      toast.success('Demande acceptée !');
      loadOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'acceptation');
    }
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt('Raison du rejet (optionnel):');
    try {
      await api.put(`/orders/${orderId}/status`, {
        state: 'CANCELLED',
        cancellationReason: reason || 'Rejetée par le caissier',
      });
      toast.success('Demande rejetée');
      loadOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors du rejet');
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié !', { duration: 2000 });
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'COMING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'COMING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Confirmée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return state;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-3 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Demandes de clients</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">Gérez les demandes de dépôt et retrait qui vous sont assignées</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setFilter('COMING')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm font-medium transition-all ${
              filter === 'COMING'
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>En attente</span>
            <span className={`ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 text-xs rounded-full ${
              filter === 'COMING' ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              {orders.filter(o => o.state === 'COMING').length}
            </span>
          </button>
          <button
            onClick={() => setFilter('ALL')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm font-medium transition-all ${
              filter === 'ALL'
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Toutes les demandes</span>
            <span className="sm:hidden">Toutes</span>
            <span className={`ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 text-xs rounded-full ${
              filter === 'ALL' ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              {orders.length}
            </span>
          </button>
        </div>

        {/* Liste des demandes */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Aucune demande</h3>
            <p className="text-sm sm:text-base text-gray-600">
              {filter === 'COMING'
                ? 'Vous n\'avez aucune demande en attente pour le moment'
                : 'Vous n\'avez aucune demande'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 sm:space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              return (
                <div key={order.id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden">
                  <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                    {/* Header - Cliquable pour expand/collapse */}
                    <div className="space-y-2 sm:space-y-3">
                      <div
                        onClick={() => toggleExpand(order.id)}
                        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 cursor-pointer"
                      >
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 ${
                            order.type === 'DEPOT' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {order.type === 'DEPOT' ? '📥 Dépôt' : '📤 Retrait'}
                          </div>
                          <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold ${getStateColor(order.state)}`}>
                            {getStateLabel(order.state)}
                          </div>
                          {/* Icône expand/collapse */}
                          <div className="ml-1 sm:ml-2">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xl sm:text-3xl font-bold text-gray-900">
                            {order.amount.toLocaleString()} <span className="text-sm sm:text-lg text-gray-600">FCFA</span>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                            Frais: {order.fees} FCFA
                          </div>
                        </div>
                      </div>

                      {/* Info rapide - Visible même quand collapsed */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                          <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                          <span className="font-medium">{order.client.firstName} {order.client.lastName}</span>
                        </div>
                        <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                          <span className="font-medium">{order.bookmaker.name}</span>
                        </div>
                        {order.bookmakerIdentifier && (
                          <>
                            <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Hash className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                              <span className="text-gray-600 font-mono text-xs sm:text-sm">ID: {order.bookmakerIdentifier}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(order.bookmakerIdentifier!);
                                }}
                                className="p-0.5 sm:p-1 hover:bg-gray-200 rounded transition-colors"
                                title="Copier l'ID du bookmaker"
                              >
                                <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                  {/* Informations Grid - Cachées par défaut */}
                  {isExpanded && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                        {/* Client */}
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-md sm:rounded-lg flex items-center justify-center">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                            </div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-900">Client</h4>
                          </div>
                          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                            <div className="font-medium text-gray-900">
                              {order.client.firstName} {order.client.lastName}
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                              <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              {order.clientContact}
                            </div>
                          </div>
                        </div>

                        {/* Bookmaker */}
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-md sm:rounded-lg flex items-center justify-center">
                              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                            </div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-900">Bookmaker</h4>
                          </div>
                          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                            <div className="font-medium text-gray-900">{order.bookmaker.name}</div>
                            <div className="text-gray-600">
                              {order.employeePaymentMethod.paymentMethod.name}
                            </div>
                            {order.bookmakerIdentifier && (
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                                  <Hash className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                  <span>ID: {order.bookmakerIdentifier}</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(order.bookmakerIdentifier!);
                                  }}
                                  className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors"
                                  title="Copier l'ID"
                                >
                                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Code retrait / Référence */}
                      {order.referenceId && (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <div className="text-xs font-medium text-gray-600 mb-1">
                            {order.type === 'RETRAIT' ? 'Code retrait' : 'Référence de transaction'}
                          </div>
                          <div className="font-mono text-sm sm:text-base font-semibold text-gray-900">{order.referenceId}</div>
                        </div>
                      )}

                      {/* Adresse de retrait */}
                      {order.type === 'RETRAIT' && order.employeePaymentMethod.address && (
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <div className="text-xs font-medium text-blue-700 mb-1 flex items-center gap-1">
                            📍 Adresse de retrait
                          </div>
                          <div className="text-sm sm:text-base font-medium text-gray-900">{order.employeePaymentMethod.address}</div>
                        </div>
                      )}

                      {/* Date */}
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 pt-1.5 sm:pt-2 border-t border-gray-100">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>
                          Créée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Actions */}
                      {order.state === 'COMING' && (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccept(order.id);
                            }}
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 sm:gap-2"
                          >
                            <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                            Accepter
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(order.id);
                            }}
                            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 sm:gap-2"
                          >
                            <X className="h-4 w-4 sm:h-5 sm:w-5" />
                            Rejeter
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
