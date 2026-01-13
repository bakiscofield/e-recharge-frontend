'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Gift, Share2, DollarSign, TrendingUp, Phone, Copy, Check } from 'lucide-react';
import dayjs from 'dayjs';

export default function ParrainagePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [network, setNetwork] = useState<'FLOOZ' | 'TMONEY'>('FLOOZ');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [balanceRes, withdrawalsRes] = await Promise.all([
        api.get('/referral/balance'),
        api.get('/referral/withdrawals'),
      ]);

      setBalance(balanceRes.data.referralBalance || 0);
      setWithdrawals(withdrawalsRes.data);
    } catch (error) {
      toast.error('Erreur de chargement');
    }
  };

  const handleCopyCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      toast.success('Code copié !');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parseFloat(amount) < 2000) {
      toast.error('Montant minimum: 2000 FCFA');
      return;
    }

    if (parseFloat(amount) > balance) {
      toast.error('Solde insuffisant');
      return;
    }

    try {
      await api.post('/referral/withdrawals', {
        amount: parseFloat(amount),
        phoneNumber: phone,
        network: network,
      });

      toast.success('Demande de retrait envoyée !');
      setShowWithdrawForm(false);
      setAmount('');
      setNetwork('FLOOZ');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-2 sm:px-0 pb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Parrainage</h2>

        {/* Solde */}
        <div className="bg-gradient-to-br from-accent to-orange-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Solde parrainage</p>
              <h3 className="text-3xl font-bold">{balance} FCFA</h3>
            </div>
            <Gift className="h-12 w-12 text-white/30" />
          </div>

          {balance >= 2000 && (
            <button
              onClick={() => setShowWithdrawForm(!showWithdrawForm)}
              className="w-full bg-white text-accent py-3 rounded-lg font-medium mt-4"
            >
              Retirer mes gains
            </button>
          )}
        </div>

        {/* Formulaire retrait */}
        {showWithdrawForm && (
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-lg mb-4">Demande de retrait</h3>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant (min 2000 FCFA)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="2000"
                  max={balance}
                  placeholder="Ex: 5000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solde disponible: {balance} FCFA
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Réseau de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNetwork('FLOOZ')}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                      network === 'FLOOZ'
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-gray-300 text-gray-700 hover:border-accent/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">📱</span>
                      <span>Flooz</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNetwork('TMONEY')}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                      network === 'TMONEY'
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-gray-300 text-gray-700 hover:border-accent/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">💳</span>
                      <span>T-Money</span>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro {network === 'FLOOZ' ? 'Flooz' : 'T-Money'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={network === 'FLOOZ' ? '91234567' : '90123456'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  required
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  ⚠️ Vérifiez bien votre numéro {network}. Le retrait sera envoyé à ce numéro après validation par l'administrateur.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent/90 transition"
                >
                  Confirmer le retrait
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Code parrainage */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Share2 className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-lg">Votre code parrainage</h3>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">{user?.referralCode}</span>
              <button
                onClick={handleCopyCode}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-gray-800">
              Partagez votre code avec vos amis. Vous recevez <strong>5%</strong> de commission sur chaque dépôt qu'ils effectuent !
            </p>
          </div>
        </div>

        {/* Historique retraits */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Historique des retraits</h3>

          {withdrawals.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun retrait effectué</p>
              <p className="text-sm text-gray-400 mt-1">Vos demandes de retrait apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((w) => (
                <div
                  key={w.id}
                  className={`p-4 rounded-lg border-2 ${
                    w.state === 'COMPLETED'
                      ? 'border-green-200 bg-green-50'
                      : w.state === 'REJECTED'
                      ? 'border-red-200 bg-red-50'
                      : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-lg">{w.amount} FCFA</p>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            w.state === 'COMPLETED'
                              ? 'bg-green-600 text-white'
                              : w.state === 'REJECTED'
                              ? 'bg-red-600 text-white'
                              : 'bg-yellow-600 text-white'
                          }`}
                        >
                          {w.state === 'COMPLETED' ? '✓ Effectué' : w.state === 'REJECTED' ? '✗ Rejeté' : '⏳ En attente'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone className="w-4 h-4" />
                          <span>{w.phoneNumber}</span>
                          {w.network && (
                            <span className="px-2 py-0.5 bg-white rounded text-xs font-medium">
                              {w.network === 'FLOOZ' ? '📱 Flooz' : '💳 T-Money'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          Demandé le {dayjs(w.createdAt).format('DD/MM/YYYY à HH:mm')}
                        </p>
                        {w.processedAt && (
                          <p className="text-xs text-gray-600">
                            Traité le {dayjs(w.processedAt).format('DD/MM/YYYY à HH:mm')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {w.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-800">
                      <strong>Raison du rejet:</strong> {w.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
