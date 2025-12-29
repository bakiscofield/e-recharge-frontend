'use client';

import { useRouter } from 'next/navigation';
import { SuperAdminLayout } from '@/components/Layout/SuperAdminLayout';
import { motion } from 'framer-motion';
import { Users, Shield, Target } from 'lucide-react';

export default function UsersManagementPage() {
  const router = useRouter();

  const userTypes = [
    {
      title: 'Gestion des Admins',
      description: 'Créer, modifier et gérer les administrateurs de la plateforme',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      onClick: () => router.push('/super-admin#admins'),
    },
    {
      title: 'Gestion des Agents',
      description: 'Créer, modifier et gérer les agents de la plateforme',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      onClick: () => router.push('/super-admin#agents'),
    },
    {
      title: 'Tous les Utilisateurs',
      description: 'Voir et gérer tous les utilisateurs (clients, agents, admins)',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      onClick: () => router.push('/super-admin#users'),
    },
  ];

  return (
    <SuperAdminLayout>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-gray-900">
            Gestion des Utilisateurs
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gérez tous les types d'utilisateurs de la plateforme
          </p>
        </motion.div>

        {/* User Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={type.onClick}
                className="cursor-pointer group"
              >
                <div className={`
                  h-full p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300
                  bg-gradient-to-br ${type.bgColor} border border-gray-200
                  transform group-hover:scale-105
                `}>
                  <div className={`
                    w-16 h-16 rounded-xl bg-gradient-to-br ${type.color}
                    flex items-center justify-center mb-4
                    group-hover:scale-110 transition-transform
                  `}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {type.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {type.description}
                  </p>
                  <div className="mt-4 flex items-center text-primary font-medium">
                    Accéder
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Accès rapide</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/super-admin#admins')}
              className="px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition text-left"
            >
              <div className="text-sm text-white/80">Créer</div>
              <div className="font-bold">Nouvel Admin</div>
            </button>
            <button
              onClick={() => router.push('/super-admin#agents')}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition text-left"
            >
              <div className="text-sm text-white/80">Créer</div>
              <div className="font-bold">Nouvel Agent</div>
            </button>
            <button
              onClick={() => router.push('/super-admin/agent-assignments')}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-left"
            >
              <div className="text-sm text-white/80">Gérer</div>
              <div className="font-bold">Assignations</div>
            </button>
          </div>
        </motion.div>
      </div>
    </SuperAdminLayout>
  );
}
