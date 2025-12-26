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
      });

      toast.success('Demande de retrait envoyée !');
      setShowWithdrawForm(false);
      setAmount('');
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
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold mb-4">Demande de retrait</h3>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-accent text-white py-3 rounded-lg font-medium"
                >
                  Confirmer
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
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Historique des retraits</h3>

          {withdrawals.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Aucun retrait effectué</p>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((w) => (
                <div key={w.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-semibold">{w.amount} FCFA</p>
                    <p className="text-sm text-gray-600">
                      {dayjs(w.createdAt).format('DD MMM YYYY')}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      w.state === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : w.state === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {w.state === 'COMPLETED' ? 'Effectué' : w.state === 'REJECTED' ? 'Rejeté' : 'En cours'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
