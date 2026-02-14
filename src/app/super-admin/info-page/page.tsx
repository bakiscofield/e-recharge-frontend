'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SuperAdminLayout } from '@/components/Layout/SuperAdminLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Save,
  Plus,
  Trash2,
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Music2,
  HelpCircle,
  FileText,
  Loader2
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface InfoPageContent {
  whatsapp: string;
  whatsappLink: string;
  phone: string;
  email: string;
  facebook: string;
  twitter: string;
  instagram: string;
  tiktok: string;
  faq: FaqItem[];
  termsText: string;
  version: string;
}

export default function InfoPageEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<InfoPageContent>({
    whatsapp: '',
    whatsappLink: '',
    phone: '',
    email: '',
    facebook: '',
    twitter: '',
    instagram: '',
    tiktok: '',
    faq: [],
    termsText: '',
    version: '1.1.0',
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await api.get('/config/info-page');
      setContent(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement du contenu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/config/info-page', content);
      toast.success('Contenu sauvegardé avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const addFaqItem = () => {
    setContent({
      ...content,
      faq: [...content.faq, { question: '', answer: '' }],
    });
  };

  const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaq = [...content.faq];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setContent({ ...content, faq: newFaq });
  };

  const removeFaqItem = (index: number) => {
    const newFaq = content.faq.filter((_, i) => i !== index);
    setContent({ ...content, faq: newFaq });
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Page Informations</h1>
            <p className="text-gray-600">Modifier le contenu de la page Informations visible par les clients</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Sauvegarder
          </button>
        </div>

        <div className="space-y-6">
          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MessageCircle className="h-4 w-4 inline mr-1 text-green-600" />
                  WhatsApp (affichage)
                </label>
                <input
                  type="text"
                  value={content.whatsapp}
                  onChange={(e) => setContent({ ...content, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="+228 90 12 34 56"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lien WhatsApp
                </label>
                <input
                  type="text"
                  value={content.whatsappLink}
                  onChange={(e) => setContent({ ...content, whatsappLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="https://wa.me/22890123456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="h-4 w-4 inline mr-1 text-primary" />
                  Telephone
                </label>
                <input
                  type="text"
                  value={content.phone}
                  onChange={(e) => setContent({ ...content, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="+228 90 12 34 56"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="h-4 w-4 inline mr-1 text-primary" />
                  Email
                </label>
                <input
                  type="email"
                  value={content.email}
                  onChange={(e) => setContent({ ...content, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="support@example.com"
                />
              </div>
            </div>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              Reseaux Sociaux
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Facebook className="h-4 w-4 inline mr-1 text-blue-600" />
                  Facebook
                </label>
                <input
                  type="url"
                  value={content.facebook}
                  onChange={(e) => setContent({ ...content, facebook: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Twitter className="h-4 w-4 inline mr-1 text-sky-500" />
                  Twitter / X
                </label>
                <input
                  type="url"
                  value={content.twitter}
                  onChange={(e) => setContent({ ...content, twitter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Instagram className="h-4 w-4 inline mr-1 text-pink-600" />
                  Instagram
                </label>
                <input
                  type="url"
                  value={content.instagram}
                  onChange={(e) => setContent({ ...content, instagram: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Music2 className="h-4 w-4 inline mr-1 text-black" />
                  TikTok
                </label>
                <input
                  type="url"
                  value={content.tiktok}
                  onChange={(e) => setContent({ ...content, tiktok: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="https://tiktok.com/@..."
                />
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Questions Frequentes (FAQ)
              </h2>
              <button
                onClick={addFaqItem}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>
            <div className="space-y-4">
              {content.faq.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                    <button
                      onClick={() => removeFaqItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Question..."
                  />
                  <textarea
                    value={item.answer}
                    onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={2}
                    placeholder="Reponse..."
                  />
                </div>
              ))}
              {content.faq.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Aucune question. Cliquez sur "Ajouter" pour en creer une.
                </p>
              )}
            </div>
          </motion.div>

          {/* Terms Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Conditions d'utilisation
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texte des conditions
                </label>
                <textarea
                  value={content.termsText}
                  onChange={(e) => setContent({ ...content, termsText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder="En utilisant notre application, vous acceptez..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version de l'application
                </label>
                <input
                  type="text"
                  value={content.version}
                  onChange={(e) => setContent({ ...content, version: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="1.0.0"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Button (Mobile) */}
        <div className="mt-6 md:hidden">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Sauvegarder les modifications
          </button>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
