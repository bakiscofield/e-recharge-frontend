'use client';

import { RoleGuard } from '@/components/Auth/RoleGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'AGENT', 'SUPER_ADMIN']}>
      {children}
    </RoleGuard>
  );
}
