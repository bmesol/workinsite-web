import type { UserProfile } from '@/shared/features/auth/helpers/AuthHelper';

export const RoleLevel = {
  NONE: 0,
  VIEW: 1,
  EDIT: 2,
} as const;

export type RoleLevel = typeof RoleLevel[keyof typeof RoleLevel];

export const PermissionHelper = {
  hasFullAccess(user?: UserProfile | null): boolean {
    return [1, 2].includes(user?.role?.id ?? 0);
  },

  getPageLevel(user: UserProfile | null, page: string): RoleLevel {
    if (!user) return RoleLevel.NONE;
    if (this.hasFullAccess(user)) return RoleLevel.EDIT;
    const right = user.pageRights?.find(
      (p) => p.name.toLowerCase() === page.toLowerCase(),
    );
    // ✅ Fix: cast number → RoleLevel enum
    return (right?.roleLevel as RoleLevel) ?? RoleLevel.NONE;
  },

  canView(user: UserProfile | null, page: string): boolean {
    return this.getPageLevel(user, page) >= RoleLevel.VIEW;
  },

  canEdit(user: UserProfile | null, page: string): boolean {
    return this.getPageLevel(user, page) === RoleLevel.EDIT;
  },
};