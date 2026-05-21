import { useMemo } from 'react';
import { AuthHelper } from '@/shared/features/auth/helpers/AuthHelper'; // ✅ useUser → AuthHelper directly
import { PermissionHelper } from '@/shared/helpers/PermissionHelper';

export const usePermission = () => {
  const user = AuthHelper.getUserProfile(); // ✅ useUser() hook → AuthHelper.getUserProfile()

  const isSuperAdmin = PermissionHelper.hasFullAccess(user) && user?.role?.id === 1;
  const isAdmin = PermissionHelper.hasFullAccess(user) && user?.role?.id === 2;

  const canView = (page: string) => PermissionHelper.canView(user, page);
  const canEdit = (page: string) => PermissionHelper.canEdit(user, page);

  return useMemo(
    () => ({
      isSuperAdmin,
      isAdmin,
      canView,
      canEdit,
    }),
    [user],
  );
};