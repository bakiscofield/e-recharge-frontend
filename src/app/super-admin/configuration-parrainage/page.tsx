'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SuperAdminLayout } from '@/components/Layout/SuperAdminLayout';
import api from '@/lib/api';
import { Gift, Percent, DollarSign, Save } from 'lucide-react';

interface ReferralConfig {
  id: string;
  code: string;
  commissionPercent: number;
  commissionType: 'FIRST_DEPOSIT' | 'ALL_DEPOSITS';
  withdrawalThreshold: number;
  isActive: boolean;
}

export default function ConfigurationParrainage() {
  const [config, setConfig] = useState<ReferralConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await api.get('/super-admin/referral-config');
      setConfig(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    try {
      await api.put('/super-admin/referral-config', {
        commissionPercent: config.commissionPercent,
        commissionType: config.commissionType,
        withdrawalThreshold: config.withdrawalThreshold,
      });
      alert('Configuration sauvegardée avec succès !');
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!config) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Erreur lors du chargement de la configuration</div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pb-4">
        {/* Header */}
        <motion.div
          className="mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Configuration Parrainage
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Configurez le système de parrainage et les commissions
          </p>
        </motion.div>

        {/* Configuration Form */}
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-5 sm:space-y-6 lg:space-y-8">
            {/* Pourcentage de commission */}
            <div>
              <label className="block mb-2 sm:mb-3">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    Pourcentage de commission
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                  Le pourcentage que le parrain gagne sur les dépôts de ses filleuls
                </p>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={config.commissionPercent}
                  onChange={(e) =>
                    setConfig({ ...config, commissionPercent: parseFloat(e.target.value) })
                  }
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex items-center gap-2 min-w-[120px]">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={config.commissionPercent}
                    onChange={(e) =>
                      setConfig({ ...config, commissionPercent: parseFloat(e.target.value) })
                    }
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold text-lg"
                  />
                  <span className="text-lg font-semibold text-gray-600">%</span>
                </div>
              </div>
            </div>

            {/* Type de commission */}
            <div>
              <label className="block mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold text-gray-900">
                    Type de commission
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Définissez quand le parrain reçoit sa commission
                </p>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setConfig({ ...config, commissionType: 'FIRST_DEPOSIT' })}
                  className={`p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl border-2 transition-all text-left ${
                    config.commissionType === 'FIRST_DEPOSIT'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                        config.commissionType === 'FIRST_DEPOSIT'
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}
                    >
                      {config.commissionType === 'FIRST_DEPOSIT' && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-0.5 sm:mb-1">Premier dépôt uniquement</h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Le parrain gagne {config.commissionPercent}% uniquement sur le premier
                        dépôt confirmé de chaque filleul
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setConfig({ ...config, commissionType: 'ALL_DEPOSITS' })}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    config.commissionType === 'ALL_DEPOSITS'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                        config.commissionType === 'ALL_DEPOSITS'
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}
                    >
                      {config.commissionType === 'ALL_DEPOSITS' && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Tous les dépôts</h3>
                      <p className="text-sm text-gray-600">
                        Le parrain gagne {config.commissionPercent}% sur tous les dépôts confirmés
                        de ses filleuls
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Seuil de retrait */}
            <div>
              <label className="block mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold text-gray-900">
                    Seuil minimum de retrait
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Le montant minimum que le parrain doit accumuler avant de pouvoir retirer
                </p>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={config.withdrawalThreshold}
                  onChange={(e) =>
                    setConfig({ ...config, withdrawalThreshold: parseFloat(e.target.value) })
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg font-semibold"
                />
                <span className="text-lg font-semibold text-gray-600 min-w-[60px]">FCFA</span>
              </div>
            </div>

            {/* Exemple de calcul */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span>📊</span> Exemple de calcul
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  <strong>Si un filleul dépose 10 000 FCFA :</strong>
                </p>
                <p className="ml-4">
                  • Commission du parrain = 10 000 × {config.commissionPercent}% ={' '}
                  <strong>{(10000 * config.commissionPercent) / 100} FCFA</strong>
                </p>
                <p className="mt-3">
                  <strong>Type de commission :</strong>
                </p>
                <p className="ml-4">
                  {config.commissionType === 'FIRST_DEPOSIT' ? (
                    <>
                      • Le parrain reçoit cette commission <strong>uniquement sur le premier dépôt</strong> du filleul
                    </>
                  ) : (
                    <>
                      • Le parrain reçoit cette commission <strong>sur chaque dépôt</strong> du filleul
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Bouton de sauvegarde */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Save className="h-5 w-5" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
              </button>
            </div>
          </div>
        </motion.div>

        <style jsx>{`
          .slider-thumb::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }

          .slider-thumb::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
            border: none;
          }
        `}</style>
      </div>
    </SuperAdminLayout>
  );
}
