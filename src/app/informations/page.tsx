'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import { Phone, Mail, MessageCircle, Facebook, Twitter, Instagram, Music2, HelpCircle, Loader2 } from 'lucide-react';
import { useAppConfig } from '@/hooks/useAppConfig';
import api from '@/lib/api';

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

// Fonction pour vérifier si une URL de réseau social est vraiment renseignée
const isValidSocialUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Liste des URLs par défaut/vides à ignorer
  const defaultUrls = [
    'https://facebook.com/',
    'https://facebook.com',
    'https://twitter.com/',
    'https://twitter.com',
    'https://instagram.com/',
    'https://instagram.com',
    'https://tiktok.com/',
    'https://tiktok.com',
  ];

  return !defaultUrls.includes(trimmed);
};

export default function InformationsPage() {
  const { appName } = useAppConfig();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<InfoPageContent | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await api.get('/config/info-page');
      setContent(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    if (content?.whatsappLink) {
      window.open(content.whatsappLink, '_blank');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!content) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500">Impossible de charger les informations</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-2 sm:px-0 pb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Informations & Support</h2>

        {/* Contact */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-lg mb-4">Nous contacter</h3>
          <div className="space-y-3">
            {content.whatsapp && (
              <button
                onClick={openWhatsApp}
                className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <MessageCircle className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-sm text-gray-600">{content.whatsapp}</p>
                </div>
              </button>
            )}

            {content.phone && (
              <a
                href={`tel:${content.phone.replace(/\s/g, '')}`}
                className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <Phone className="h-6 w-6 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Telephone</p>
                  <p className="text-sm text-gray-600">{content.phone}</p>
                </div>
              </a>
            )}

            {content.email && (
              <a
                href={`mailto:${content.email}`}
                className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <Mail className="h-6 w-6 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">{content.email}</p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Reseaux sociaux */}
        {(isValidSocialUrl(content.facebook) || isValidSocialUrl(content.twitter) || isValidSocialUrl(content.instagram) || isValidSocialUrl(content.tiktok)) && (
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-lg mb-4">Suivez-nous</h3>
            <div className="flex gap-4 flex-wrap">
              {isValidSocialUrl(content.facebook) && (
                <a
                  href={content.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-lg hover:opacity-90 transition"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="font-medium">Facebook</span>
                </a>
              )}
              {isValidSocialUrl(content.twitter) && (
                <a
                  href={content.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 p-4 bg-sky-500 text-white rounded-lg hover:opacity-90 transition"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="font-medium">Twitter</span>
                </a>
              )}
              {isValidSocialUrl(content.instagram) && (
                <a
                  href={content.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 transition"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="font-medium">Instagram</span>
                </a>
              )}
              {isValidSocialUrl(content.tiktok) && (
                <a
                  href={content.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 p-4 bg-black text-white rounded-lg hover:opacity-90 transition"
                >
                  <Music2 className="h-5 w-5" />
                  <span className="font-medium">TikTok</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* FAQ */}
        {content.faq && content.faq.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Questions frequentes
            </h3>
            <div className="space-y-4">
              {content.faq.map((item, index) => (
                <div key={index}>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {item.question}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conditions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Conditions d'utilisation</h3>
          <p className="text-sm text-gray-600 mb-4">
            {content.termsText || `En utilisant ${appName}, vous acceptez nos conditions d'utilisation et notre politique de confidentialite.`}
          </p>
          <p className="text-xs text-gray-500">
            Version {content.version || '1.1.0'} - &copy; {new Date().getFullYear()} {appName}. Tous droits reserves.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
