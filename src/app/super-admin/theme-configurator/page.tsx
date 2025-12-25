'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SuperAdminLayout } from '@/components/Layout/SuperAdminLayout';
import api from '@/lib/api';
import type { ThemeConfig } from '@/types/shared';

export default function ThemeConfigurator() {
  const [theme, setTheme] = useState<Partial<ThemeConfig>>({
    primaryColor: '#00f0ff',
    secondaryColor: '#ff00ff',
    accentColor: '#00ff88',
    backgroundColor: '#0a0a1f',
    surfaceColor: '#1a1a3f',
    textColor: '#ffffff',
    textSecondary: '#a0a0ff',
    glowIntensity: 0.8,
    animationSpeed: 1.0,
    particlesEnabled: true,
    gradientEnabled: true,
    moneyAnimationStyle: 'rain',
    moneyColor: '#ffd700',
    moneyGlow: true,
    logoAnimationType: 'pulse',
    logoGlowColor: '#00f0ff',
    backgroundType: 'gradient',
    fontFamily: 'Inter, system-ui',
    fontSizeBase: 16,
    borderRadius: 12,
    borderGlow: true,
  });

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const response = await api.get('/theme/active');
      setTheme(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du thème:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/theme/update', theme);
      alert('Thème sauvegardé avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du thème');
    } finally {
      setSaving(false);
    }
  };

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-2 py-1 bg-[#0a0a1f] text-gray-900 text-sm rounded border border-gray-600"
        />
      </div>
    </div>
  );

  const Slider = ({ label, value, onChange, min, max, step }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm text-primary">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-white border border-gray-100 rounded-lg appearance-none cursor-pointer slider-thumb"
      />
    </div>
  );

  const Select = ({ label, value, onChange, options }: any) => (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
      <span className="text-sm text-gray-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1 bg-[#0a0a1f] text-gray-900 rounded border border-gray-600 cursor-pointer"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <SuperAdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8 flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Configurateur de Thème
            </h1>
            <p className="text-gray-600">Personnalisation 100% de l'interface client</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition"
              variant="secondary"
              onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
            >
              {previewMode === 'desktop' ? '📱 Mobile' : '🖥️ Desktop'}
            </button>
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition"
              variant="success"
              onClick={handleSave}
              loading={saving}
            >
              💾 Sauvegarder
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Colors Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🎨 Couleurs</h3>
                <ColorPicker
                  label="Primaire"
                  value={theme.primaryColor || '#00f0ff'}
                  onChange={(v) => setTheme({ ...theme, primaryColor: v })}
                />
                <ColorPicker
                  label="Secondaire"
                  value={theme.secondaryColor || '#ff00ff'}
                  onChange={(v) => setTheme({ ...theme, secondaryColor: v })}
                />
                <ColorPicker
                  label="Accent"
                  value={theme.accentColor || '#00ff88'}
                  onChange={(v) => setTheme({ ...theme, accentColor: v })}
                />
                <ColorPicker
                  label="Arrière-plan"
                  value={theme.backgroundColor || '#0a0a1f'}
                  onChange={(v) => setTheme({ ...theme, backgroundColor: v })}
                />
                <ColorPicker
                  label="Surface"
                  value={theme.surfaceColor || '#1a1a3f'}
                  onChange={(v) => setTheme({ ...theme, surfaceColor: v })}
                />
              </div>
            </div>

            {/* Effects Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">✨ Effets</h3>
                <Slider
                  label="Intensité luminosité"
                  value={theme.glowIntensity}
                  onChange={(v: number) => setTheme({ ...theme, glowIntensity: v })}
                  min={0}
                  max={1}
                  step={0.1}
                />
                <Slider
                  label="Vitesse animations"
                  value={theme.animationSpeed}
                  onChange={(v: number) => setTheme({ ...theme, animationSpeed: v })}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
                <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
                  <span className="text-sm text-gray-600">Particules</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={theme.particlesEnabled}
                      onChange={(e) => setTheme({ ...theme, particlesEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
                  <span className="text-sm text-gray-600">Dégradés animés</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={theme.gradientEnabled}
                      onChange={(e) => setTheme({ ...theme, gradientEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Money Effects */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💰 Effets d'argent</h3>
                <Select
                  label="Animation"
                  value={theme.moneyAnimationStyle}
                  onChange={(v: string) => setTheme({ ...theme, moneyAnimationStyle: v as any })}
                  options={[
                    { value: 'rain', label: 'Pluie' },
                    { value: 'sparkle', label: 'Étincelles' },
                    { value: 'flow', label: 'Flux' },
                    { value: 'pulse', label: 'Pulsation' },
                  ]}
                />
                <ColorPicker
                  label="Couleur"
                  value={theme.moneyColor || '#ffd700'}
                  onChange={(v) => setTheme({ ...theme, moneyColor: v })}
                />
              </div>
            </div>

            {/* Background */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🌌 Arrière-plan</h3>
                <Select
                  label="Type"
                  value={theme.backgroundType}
                  onChange={(v: string) => setTheme({ ...theme, backgroundType: v as any })}
                  options={[
                    { value: 'gradient', label: 'Dégradé' },
                    { value: 'particles', label: 'Particules' },
                    { value: 'matrix', label: 'Matrix' },
                    { value: 'waves', label: 'Vagues' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">👁️ Aperçu en temps réel</h3>
                  <div className="text-sm text-gray-600">
                    Mode: {previewMode === 'desktop' ? 'Desktop' : 'Mobile'}
                  </div>
                </div>

                <div
                  className={`
                    mx-auto border-4 rounded-2xl overflow-hidden
                    ${previewMode === 'desktop' ? 'w-full h-[600px]' : 'w-[375px] h-[667px]'}
                  `}
                  style={{
                    borderColor: theme.primaryColor,
                    boxShadow: `0 0 30px ${theme.primaryColor}66`,
                  }}
                >
                  <div
                    className="w-full h-full p-6 overflow-auto"
                    style={{
                      background: `linear-gradient(135deg, ${theme.backgroundColor} 0%, ${theme.surfaceColor} 100%)`,
                      fontFamily: theme.fontFamily,
                      fontSize: `${theme.fontSizeBase}px`,
                    }}
                  >
                    {/* Preview Content */}
                    <div className="space-y-6">
                      <h2
                        className="text-3xl font-bold"
                        style={{ color: theme.primaryColor }}
                      >
                        Espace Client
                      </h2>

                      <div
                        className="p-6 rounded-lg"
                        style={{
                          background: theme.surfaceColor,
                          border: `2px solid ${theme.primaryColor}66`,
                          boxShadow: theme.borderGlow ? `0 0 20px ${theme.primaryColor}44` : 'none',
                          borderRadius: `${theme.borderRadius}px`,
                        }}
                      >
                        <h3 className="text-xl font-bold mb-2" style={{ color: theme.textColor }}>
                          Dépôt
                        </h3>
                        <p style={{ color: theme.textSecondary }}>
                          Effectuez un dépôt sur votre bookmaker favori
                        </p>
                        <div className="mt-4">
                          <button
                            className="px-6 py-3 rounded-lg font-bold"
                            style={{
                              background: `linear-gradient(135deg, ${theme.primaryColor}44 0%, ${theme.secondaryColor}44 100%)`,
                              border: `2px solid ${theme.primaryColor}`,
                              color: theme.textColor,
                              boxShadow: `0 0 20px ${theme.primaryColor}66`,
                              borderRadius: `${theme.borderRadius}px`,
                            }}
                          >
                            Déposer maintenant
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {['Bookmaker 1', 'Bookmaker 2'].map((name, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-lg text-center"
                            style={{
                              background: theme.surfaceColor,
                              border: `1px solid ${theme.accentColor}66`,
                              boxShadow: theme.borderGlow ? `0 0 15px ${theme.accentColor}44` : 'none',
                              borderRadius: `${theme.borderRadius}px`,
                            }}
                          >
                            <div className="text-4xl mb-2">🎰</div>
                            <div className="font-bold" style={{ color: theme.textColor }}>
                              {name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${theme.primaryColor};
          cursor: pointer;
          box-shadow: 0 0 10px ${theme.primaryColor};
        }
      `}</style>
      </div>
    </SuperAdminLayout>
  );
}
