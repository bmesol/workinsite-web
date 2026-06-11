export interface Roles {
  name: string;
  note?: string;
  isActive?: boolean;
  id: number;
}

export interface RoleRequest {
  name: string;
  note?: string;
}

export const ROLE_IDS = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  SUPERVISOR: 4,
  ENGINEER: 3,
} as const;

export type RoleId = (typeof ROLE_IDS)[keyof typeof ROLE_IDS];
