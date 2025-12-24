'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  requireSuperAdmin?: boolean;
}

export function RoleGuard({ children, allowedRoles, requireSuperAdmin = false }: RoleGuardProps) {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Attendre un peu pour que le localStorage soit chargé
    const timer = setTimeout(() => {
      console.log('[RoleGuard] Checking authorization:', { user, requireSuperAdmin, allowedRoles });

      if (!user) {
        console.log('[RoleGuard] No user, redirecting to login');
        router.push('/login');
        setIsChecking(false);
        return;
      }

      // Vérifier si Super Admin requis
      if (requireSuperAdmin && !user.isSuperAdmin) {
        console.log('[RoleGuard] Super Admin required but user is not super admin');
        // Rediriger vers la page appropriée selon le rôle
        if (user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/depot');
        }
        setIsChecking(false);
        return;
      }

      // Vérifier les rôles autorisés
      if (!allowedRoles.includes(user.role)) {
        console.log('[RoleGuard] User role not in allowed roles, redirecting based on role');

        // Rediriger intelligemment selon le rôle de l'utilisateur
        if (user.isSuperAdmin === true || user.role === 'SUPER_ADMIN') {
          console.log('[RoleGuard] Redirecting Super Admin to /super-admin');
          router.push('/super-admin');
        } else if (user.role === 'ADMIN' || user.role === 'AGENT') {
          console.log('[RoleGuard] Redirecting Admin/Agent to /admin');
          router.push('/admin');
        } else {
          console.log('[RoleGuard] Redirecting to /depot (default)');
          router.push('/depot');
        }
        setIsChecking(false);
        return;
      }

      console.log('[RoleGuard] Authorization successful');
      setIsAuthorized(true);
      setIsChecking(false);
    }, 100); // Attendre 100ms pour le chargement

    return () => clearTimeout(timer);
  }, [user, allowedRoles, requireSuperAdmin, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Vérification...</div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <div className="text-white text-xl">Accès refusé</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
