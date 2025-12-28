'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { register } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, Globe, Gift } from 'lucide-react';
import { useAppConfig } from '@/hooks/useAppConfig';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { appName, appTagline, appLogo } = useAppConfig();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset promo code validation when it changes
    if (name === 'referredBy') {
      setPromoCodeValid(null);
    }
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
        toast.success(`✅ Code promo valide ! Parrainé par ${data.ownerName || 'un utilisateur'}`);
      } else {
        setPromoCodeValid(false);
        toast('⚠️ Code promo non reconnu. Vous pouvez continuer sans code.', {
          icon: '⚠️',
          duration: 4000,
        });
      }
    } catch (error) {
      setPromoCodeValid(false);
      toast('⚠️ Code promo non reconnu. Vous pouvez continuer sans code.', {
        icon: '⚠️',
        duration: 4000,
      });
    } finally {
      setCheckingPromo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.phone || !formData.firstName || !formData.lastName || !formData.country) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const registerData: any = {
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
      };

      if (formData.email) registerData.email = formData.email;
      if (formData.password) registerData.password = formData.password;
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
      toast.error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col overflow-x-hidden">
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
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-center mb-3 sm:mb-4 text-gray-900">
                Créer un compte
              </h3>

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
                <p className="text-xs text-gray-500 mt-1">
                  Pas besoin de +228 ou 228
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email (optionnel)
                </label>
                <div className="relative">
                  <Mail className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@exemple.com"
                    className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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
                  Mot de passe (optionnel)
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
                  />
                </div>
              </div>

              {/* Confirm Password */}
              {formData.password && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Confirmer le mot de passe
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
                    />
                  </div>
                </div>
              )}

              {/* Promo Code */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 sm:p-4 rounded-lg border-2 border-dashed border-green-300">
                <label className="block text-xs sm:text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
                  <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
                  🎁 Code Promo (facultatif)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleChange}
                    onBlur={(e) => validatePromoCode(e.target.value)}
                    placeholder="Entrez votre code promo ici"
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
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                    </div>
                  )}
                  {promoCodeValid === true && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 font-bold text-lg">
                      ✓
                    </div>
                  )}
                  {promoCodeValid === false && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 text-xs">
                      ⚠️
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {promoCodeValid === false ? (
                    <span className="text-orange-600">⚠️ Code non reconnu. Vous pouvez continuer sans code.</span>
                  ) : (
                    <span>💡 Avez-vous un code promo ? Entrez-le pour bénéficier d'avantages !</span>
                  )}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-app-primary text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </button>

              {/* Login Link */}
              <p className="text-center text-xs sm:text-sm text-gray-600 mt-3">
                Vous avez déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-app-primary font-medium hover:underline"
                >
                  Se connecter
                </button>
              </p>
            </form>
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
