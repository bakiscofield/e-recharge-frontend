'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/Layout/AppLayout';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Gift, Share2, DollarSign, Phone, Copy, Check, Loader2, ArrowDownCircle, Wallet } from 'lucide-react';
import dayjs from 'dayjs';

export default function ParrainagePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [balance, setBalance] = useState(0);
  const [withdrawalThreshold, setWithdrawalThreshold] = useState(2000);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [network, setNetwork] = useState<'FLOOZ' | 'MIXX_BY_YAS'>('FLOOZ');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [balanceRes, withdrawalsRes] = await Promise.all([
        api.get('/referral/balance'),
        api.get('/referral/withdrawals'),
      ]);

      setBalance(balanceRes.data.referralBalance || 0);
      setWithdrawalThreshold(balanceRes.data.withdrawalThreshold || 2000);
      setWithdrawals(withdrawalsRes.data);
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
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

    if (parseFloat(amount) < withdrawalThreshold) {
      toast.error(`Montant minimum: ${(withdrawalThreshold || 2000).toLocaleString()} FCFA`);
      return;
    }

    if (parseFloat(amount) > balance) {
      toast.error('Solde insuffisant');
      return;
    }

    try {
      setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-3 sm:px-0 pb-6">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6"
        >
          Parrainage
        </motion.h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-accent animate-spin mb-3" />
            <p className="text-gray-500">Chargement...</p>
          </div>
        ) : (
          <>
            {/* Solde */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden bg-gradient-to-br from-accent via-orange-500 to-orange-600 rounded-2xl p-6 text-white mb-6 shadow-lg"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/80 text-sm flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Solde parrainage
                    </p>
                    <motion.h3
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="text-3xl font-bold"
                    >
                      {balance.toLocaleString()} FCFA
                    </motion.h3>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Gift className="h-12 w-12 text-white/40" />
                  </motion.div>
                </div>

                {balance >= withdrawalThreshold && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowWithdrawForm(!showWithdrawForm)}
                    className="w-full bg-white text-accent py-3.5 rounded-xl font-semibold mt-4 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <ArrowDownCircle className="w-5 h-5" />
                    {showWithdrawForm ? 'Annuler' : 'Retirer mes gains'}
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Formulaire retrait */}
            <AnimatePresence>
              {showWithdrawForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="overflow-hidden mb-6"
                >
                  <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <ArrowDownCircle className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900">Demande de retrait</h3>
                    </div>

                    <form onSubmit={handleWithdraw} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Montant à retirer
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min={withdrawalThreshold}
                            max={balance}
                            placeholder="Ex: 5000"
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-lg font-medium"
                            required
                            disabled={submitting}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                            FCFA
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5 flex items-center justify-between">
                          <span>Minimum: {(withdrawalThreshold || 2000).toLocaleString()} FCFA</span>
                          <span className="text-accent font-medium">Disponible: {balance.toLocaleString()} FCFA</span>
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Moyen de paiement
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={() => setNetwork('FLOOZ')}
                            disabled={submitting}
                            className={`py-4 px-4 rounded-xl border-2 font-medium transition-all ${
                              network === 'FLOOZ'
                                ? 'border-accent bg-accent/10 text-accent shadow-sm'
                                : 'border-gray-200 text-gray-700 hover:border-accent/50'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-2xl">📱</span>
                              <span className="font-semibold">Flooz</span>
                            </div>
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={() => setNetwork('MIXX_BY_YAS')}
                            disabled={submitting}
                            className={`py-4 px-4 rounded-xl border-2 font-medium transition-all ${
                              network === 'MIXX_BY_YAS'
                                ? 'border-accent bg-accent/10 text-accent shadow-sm'
                                : 'border-gray-200 text-gray-700 hover:border-accent/50'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-2xl">💳</span>
                              <span className="font-semibold">Mixx by Yas</span>
                            </div>
                          </motion.button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro {network === 'FLOOZ' ? 'Flooz' : 'Mixx by Yas'}
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Entrez votre numéro"
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                            required
                            disabled={submitting}
                          />
                        </div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                      >
                        <p className="text-sm text-amber-800">
                          ⚠️ Vérifiez bien votre numéro. Le retrait sera envoyé à ce numéro après validation.
                        </p>
                      </motion.div>

                      <div className="flex gap-3 pt-2">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => setShowWithdrawForm(false)}
                          disabled={submitting}
                          className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50"
                        >
                          Annuler
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={submitting || !amount || !phone}
                          className="flex-1 bg-accent text-white py-3.5 rounded-xl font-semibold hover:bg-accent/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Envoi...
                            </>
                          ) : (
                            <>
                              <Check className="w-5 h-5" />
                              Confirmer
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Code parrainage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Votre code parrainage</h3>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary tracking-wider">{user?.referralCode}</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyCode}
                    className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copier
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  Partagez votre code avec vos amis. Vous recevez <strong className="text-primary">5%</strong> de commission sur chaque dépôt qu'ils effectuent !
                </p>
              </div>
            </motion.div>

            {/* Historique retraits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Historique des retraits</h3>
              </div>

              {withdrawals.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">Aucun retrait effectué</p>
                  <p className="text-sm text-gray-400 mt-1">Vos demandes de retrait apparaîtront ici</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {withdrawals.map((w, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={w.id}
                      className={`p-4 rounded-xl border-2 ${
                        w.state === 'COMPLETED'
                          ? 'border-green-200 bg-green-50/50'
                          : w.state === 'REJECTED'
                          ? 'border-red-200 bg-red-50/50'
                          : 'border-yellow-200 bg-yellow-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-bold text-lg text-gray-900">{w.amount.toLocaleString()} FCFA</p>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                w.state === 'COMPLETED'
                                  ? 'bg-green-600 text-white'
                                  : w.state === 'REJECTED'
                                  ? 'bg-red-600 text-white'
                                  : 'bg-yellow-500 text-white'
                              }`}
                            >
                              {w.state === 'COMPLETED' ? '✓ Effectué' : w.state === 'REJECTED' ? '✗ Rejeté' : '⏳ En attente'}
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{w.phoneNumber}</span>
                              {w.network && (
                                <span className="px-2 py-0.5 bg-white rounded-md text-xs font-medium border border-gray-200">
                                  {w.network === 'FLOOZ' ? '📱 Flooz' : '💳 Mixx by Yas'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              Demandé le {dayjs(w.createdAt).format('DD/MM/YYYY à HH:mm')}
                            </p>
                            {w.processedAt && (
                              <p className="text-xs text-gray-500">
                                Traité le {dayjs(w.processedAt).format('DD/MM/YYYY à HH:mm')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {w.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg text-xs text-red-800">
                          <strong>Raison du rejet:</strong> {w.rejectionReason}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
