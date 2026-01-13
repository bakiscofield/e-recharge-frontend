'use client';

import { useEffect, useState } from 'react';
import { SuperAdminHeader } from '@/components/Navigation/SuperAdminHeader';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  User,
  Calendar,
  Filter,
  Loader2,
  AlertCircle
} from 'lucide-react';
import dayjs from 'dayjs';

interface ReferralWithdrawal {
  id: string;
  amount: number;
  phoneNumber: string;
  network: string;
  state: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  processedBy?: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };
}

export default function ReferralWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<ReferralWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED'>('ALL');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<ReferralWithdrawal | null>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadWithdrawals();
  }, [filter]);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const params = filter !== 'ALL' ? { state: filter } : {};
      const res = await api.get('/referral/withdrawals/all', { params });
      setWithdrawals(res.data);
    } catch (error) {
      console.error('Erreur de chargement:', error);
      toast.error('Erreur de chargement des retraits');
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (withdrawalId: string, state: 'COMPLETED' | 'REJECTED') => {
    if (state === 'REJECTED' && !rejectionReason.trim()) {
      toast.error('Veuillez indiquer la raison du rejet');
      return;
    }

    try {
      setProcessing(true);
      await api.put(`/referral/withdrawals/${withdrawalId}/process`, {
        state,
        rejectionReason: state === 'REJECTED' ? rejectionReason : undefined,
      });

      toast.success(
        state === 'COMPLETED'
          ? 'Retrait validé avec succès ✓'
          : 'Retrait rejeté'
      );

      setShowProcessModal(false);
      setSelectedWithdrawal(null);
      setRejectionReason('');
      loadWithdrawals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors du traitement');
    } finally {
      setProcessing(false);
    }
  };

  const openProcessModal = (withdrawal: ReferralWithdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowProcessModal(true);
    setRejectionReason('');
  };

  const filteredWithdrawals =
    filter === 'ALL'
      ? withdrawals
      : withdrawals.filter((w) => w.state === filter);

  const stats = {
    pending: withdrawals.filter((w) => w.state === 'PENDING').length,
    completed: withdrawals.filter((w) => w.state === 'COMPLETED').length,
    rejected: withdrawals.filter((w) => w.state === 'REJECTED').length,
    totalAmount: withdrawals
      .filter((w) => w.state === 'COMPLETED')
      .reduce((sum, w) => sum + w.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Retraits de Parrainage
          </h1>
          <p className="text-gray-600">
            Gérez les demandes de retrait des commissions de parrainage
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Validés</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejetés</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total versé</p>
                <p className="text-2xl font-bold text-primary">
                  {stats.totalAmount.toLocaleString()} F
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtrer:</span>
            {(['ALL', 'PENDING', 'COMPLETED', 'REJECTED'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'ALL'
                  ? `Tous (${withdrawals.length})`
                  : f === 'PENDING'
                  ? `En attente (${stats.pending})`
                  : f === 'COMPLETED'
                  ? `Validés (${stats.completed})`
                  : `Rejetés (${stats.rejected})`}
              </button>
            ))}
          </div>
        </div>

        {/* Withdrawals List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-gray-600">Chargement des retraits...</p>
          </div>
        ) : filteredWithdrawals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-1">
              Aucun retrait {filter !== 'ALL' ? filter.toLowerCase() : ''}
            </p>
            <p className="text-gray-400 text-sm">
              Les demandes de retrait apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWithdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${
                  withdrawal.state === 'PENDING'
                    ? 'border-yellow-500'
                    : withdrawal.state === 'COMPLETED'
                    ? 'border-green-500'
                    : 'border-red-500'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Infos principales */}
                  <div className="flex-1 space-y-3">
                    {/* Client */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {withdrawal.client.firstName} {withdrawal.client.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{withdrawal.client.phone}</p>
                      </div>
                    </div>

                    {/* Montant et réseau */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">
                          {withdrawal.amount.toLocaleString()} FCFA
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {withdrawal.phoneNumber}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                        {withdrawal.network === 'FLOOZ' ? '📱 Flooz' : '💳 T-Money'}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Demandé le{' '}
                          {dayjs(withdrawal.createdAt).format('DD/MM/YYYY à HH:mm')}
                        </span>
                      </div>
                      {withdrawal.processedAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Traité le{' '}
                            {dayjs(withdrawal.processedAt).format('DD/MM/YYYY à HH:mm')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Raison de rejet */}
                    {withdrawal.rejectionReason && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-red-800">
                            Raison du rejet:
                          </p>
                          <p className="text-sm text-red-700">
                            {withdrawal.rejectionReason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions et statut */}
                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                        withdrawal.state === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : withdrawal.state === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {withdrawal.state === 'PENDING'
                        ? '⏳ En attente'
                        : withdrawal.state === 'COMPLETED'
                        ? '✓ Validé'
                        : '✗ Rejeté'}
                    </span>

                    {withdrawal.state === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProcess(withdrawal.id, 'COMPLETED')}
                          disabled={processing}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Valider
                        </button>
                        <button
                          onClick={() => openProcessModal(withdrawal)}
                          disabled={processing}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Rejeter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de rejet */}
      {showProcessModal && selectedWithdrawal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => !processing && setShowProcessModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Rejeter la demande de retrait
              </h3>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Client</p>
                <p className="font-semibold text-gray-900">
                  {selectedWithdrawal.client.firstName}{' '}
                  {selectedWithdrawal.client.lastName}
                </p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Montant</p>
                <p className="font-semibold text-gray-900">
                  {selectedWithdrawal.amount.toLocaleString()} FCFA
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison du rejet *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ex: Numéro invalide, fraude suspectée..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  rows={4}
                  disabled={processing}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowProcessModal(false)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleProcess(selectedWithdrawal.id, 'REJECTED')}
                  disabled={processing || !rejectionReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Confirmer le rejet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
