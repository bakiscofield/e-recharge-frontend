'use client';

import { ReactNode } from 'react';
import { SuperAdminHeader } from '../Navigation/SuperAdminHeader';
import FallingSymbols from '@/components/Animations/FallingSymbols';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden relative">
      {/* Animation d'arrière-plan */}
      <FallingSymbols />

      <SuperAdminHeader />
      <main className="py-4 sm:py-6 relative z-1">
        {children}
      </main>
    </div>
  );
}
