'use client';

import { RoleGuard } from '@/components/Auth/RoleGuard';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMIN']} requireSuperAdmin={true}>
      {children}
    </RoleGuard>
  );
}
