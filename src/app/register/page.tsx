'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { register } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, Globe, Gift, ArrowRight, ArrowLeft, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useAppConfig } from '@/hooks/useAppConfig';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { appName, appTagline, appLogo } = useAppConfig();

  // États
  const [step, setStep] = useState<1 | 2>(1); // Étape 1: Email, Étape 2: Formulaire complet
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    phone: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    country: 'TG',
    referredBy: '',
  });

  const [promoCodeValid, setPromoCodeValid] = useState<boolean | null>(null);
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [errorModal, setErrorModal] = useState<{ show: boolean; title: string; message: string }>({
    show: false,
    title: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'referredBy') {
      setPromoCodeValid(null);
    }
  };

  // Envoyer le code de vérification par email
  const handleSendCode = async () => {
    if (!formData.email) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Veuillez entrer un email valide');
      return;
    }

    setSendingCode(true);
    try {
      await api.post('/auth/register/send-email-code', { email: formData.email });
      toast.success('Code envoyé à votre email !');
      setCodeSent(true);

      // Démarrer le countdown de 60 secondes
      setCountdown(60);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'envoi du code';
      setErrorModal({
        show: true,
        title: 'Erreur d\'envoi',
        message: errorMessage,
      });
    } finally {
      setSendingCode(false);
    }
  };

  // Passer à l'étape 2
  const handleNextStep = () => {
    if (!formData.email) {
      toast.error('Veuillez entrer votre email');
      return;
    }
    if (!formData.verificationCode) {
      toast.error('Veuillez entrer le code de vérification');
      return;
    }
    if (formData.verificationCode.length !== 4) {
      toast.error('Le code doit contenir 4 chiffres');
      return;
    }
    setStep(2);
  };

  const validatePromoCode = async (code: string) => {
    if (!code || code.trim() === '') {
      setPromoCodeValid(null);
      return;
    }

    setCheckingPromo(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/referral/validate/${code}`);
      const data = await response.json();

      if (response.ok && data.valid) {
        setPromoCodeValid(true);
        toast.success(`Code promo valide ! Parrainé par ${data.ownerName || 'un utilisateur'}`);
      } else {
        setPromoCodeValid(false);
        toast('Code promo non reconnu. Vous pouvez continuer sans code.', { icon: '⚠️', duration: 4000 });
      }
    } catch (error) {
      setPromoCodeValid(false);
      toast('Code promo non reconnu. Vous pouvez continuer sans code.', { icon: '⚠️', duration: 4000 });
    } finally {
      setCheckingPromo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.verificationCode || !formData.phone || !formData.password || !formData.firstName || !formData.lastName || !formData.country) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const registerData: any = {
        email: formData.email,
        verificationCode: formData.verificationCode,
        phone: formData.phone,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
      };

      if (formData.referredBy) registerData.referredBy = formData.referredBy;

      const result = await dispatch(register(registerData)).unwrap();
      toast.success('Inscription réussie !');

      // Rediriger selon le rôle
      const user = result.user;
      if (user.isSuperAdmin === true || user.role === 'SUPER_ADMIN') {
        router.push('/super-admin');
      } else if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/depot');
      }
    } catch (error: any) {
      // Extraire le message d'erreur - peut être une string directe ou un objet
      let errorMessage = 'Erreur lors de l\'inscription';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      // Traduire les erreurs courantes
      const errorTranslations: Record<string, string> = {
        'Email already exists': 'Cet email est déjà utilisé',
        'Phone already exists': 'Ce numéro de téléphone est déjà utilisé',
        'Invalid verification code': 'Code de vérification invalide',
        'Verification code expired': 'Code de vérification expiré',
        'User already exists': 'Un compte existe déjà avec ces informations',
      };

      const translatedMessage = errorTranslations[errorMessage] || errorMessage;

      setErrorModal({
        show: true,
        title: 'Erreur d\'inscription',
        message: translatedMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col overflow-x-hidden">
      {/* Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{errorModal.title}</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{errorModal.message}</p>
            </div>
            <button
              onClick={() => setErrorModal({ show: false, title: '', message: '' })}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            {appLogo ? (
              <div className="flex flex-col items-center">
                <img src={appLogo} alt={appName} className="h-16 sm:h-20 w-auto object-contain mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm text-gray-600">{appTagline}</p>
              </div>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold text-app-primary">{appName}</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{appTagline}</p>
              </>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-app-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-app-primary' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-app-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
            </div>

            {step === 1 ? (
              /* ÉTAPE 1: Vérification Email */
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-center text-gray-900">
                  Vérification de l'email
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  Entrez votre email pour recevoir un code de vérification
                </p>

                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@exemple.com"
                      className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={codeSent}
                    />
                  </div>
                </div>

                {/* Bouton Envoyer Code */}
                {!codeSent ? (
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={sendingCode || !formData.email}
                    className="w-full bg-app-primary text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sendingCode ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Envoyer le code
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    {/* Code envoyé */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-700">Code envoyé à {formData.email}</span>
                    </div>

                    {/* Champ Code */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Code de vérification (4 chiffres) *
                      </label>
                      <input
                        type="text"
                        name="verificationCode"
                        value={formData.verificationCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setFormData({ ...formData, verificationCode: value });
                        }}
                        placeholder="0000"
                        className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={4}
                        required
                      />
                    </div>

                    {/* Renvoyer le code */}
                    <div className="text-center">
                      {countdown > 0 ? (
                        <p className="text-sm text-gray-500">
                          Renvoyer le code dans {countdown}s
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendCode}
                          disabled={sendingCode}
                          className="text-sm text-app-primary hover:underline"
                        >
                          Renvoyer le code
                        </button>
                      )}
                    </div>

                    {/* Bouton Continuer */}
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={formData.verificationCode.length !== 4}
                      className="w-full bg-app-primary text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Continuer
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* ÉTAPE 2: Formulaire complet */
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Compléter l'inscription
                  </h3>
                </div>

                {/* Email affiché */}
                <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{formData.email}</span>
                  <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                </div>

                {/* Names */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Prénom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Jean"
                        className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Nom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Dupont"
                        className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="90 00 00 00"
                      className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Pas besoin de +228 ou 228</p>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Pays *
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      required
                    >
                      <option value="TG">Togo</option>
                      <option value="BJ">Bénin</option>
                      <option value="CI">Côte d'Ivoire</option>
                      <option value="BF">Burkina Faso</option>
                      <option value="ML">Mali</option>
                      <option value="SN">Sénégal</option>
                      <option value="GH">Ghana</option>
                      <option value="NG">Nigeria</option>
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      minLength={6}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Promo Code */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 sm:p-4 rounded-lg border-2 border-dashed border-green-300">
                  <label className="block text-xs sm:text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
                    <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
                    Code Promo (facultatif)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="referredBy"
                      value={formData.referredBy}
                      onChange={handleChange}
                      onBlur={(e) => validatePromoCode(e.target.value)}
                      placeholder="Entrez votre code promo"
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-mono uppercase border-2 rounded-lg focus:ring-2 focus:ring-green-500 transition-all ${
                        promoCodeValid === true
                          ? 'border-green-500 bg-green-50'
                          : promoCodeValid === false
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    />
                    {checkingPromo && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                      </div>
                    )}
                    {promoCodeValid === true && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-app-primary text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Inscription...
                    </>
                  ) : (
                    "S'inscrire"
                  )}
                </button>
              </form>
            )}

            {/* Login Link */}
            <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
              Vous avez déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-app-primary font-medium hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 px-4">
            En vous inscrivant, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>
    </div>
  );
}
