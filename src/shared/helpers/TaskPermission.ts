import { ROLE_IDS } from '@/shared/features/rolesandrights/DTOs/DTOs';

export type TaskFieldPermissions = {
  canEditCoreFields: boolean;
  canEditAssignedTo: boolean;
  canEditStatus: boolean;
  canEditRemarks: boolean;
  canEditPhotos: boolean;
};

// ─── Permission presets ───────────────────────────────────────────────────────

const ALL_EDITABLE: TaskFieldPermissions = {
  canEditCoreFields: true,
  canEditAssignedTo: true,
  canEditStatus: true,
  canEditRemarks: true,
  canEditPhotos: true,
};

const NONE_EDITABLE: TaskFieldPermissions = {
  canEditCoreFields: false,
  canEditAssignedTo: false,
  canEditStatus: false,
  canEditRemarks: false,
  canEditPhotos: false,
};

// Supervisor: status, remarks, and photos only — cannot change assignee.
const REMARKS_PHOTOS_AND_STATUS: TaskFieldPermissions = {
  canEditCoreFields: false,
  canEditAssignedTo: false,
  canEditStatus: true,
  canEditRemarks: true,
  canEditPhotos: true,
};

// Engineer: can delegate (AssignedTo), update status, add remarks and photos.
// Core fields (name, site, date, priority) remain read-only.
const ENGINEER_EDITABLE: TaskFieldPermissions = {
  canEditCoreFields: false,
  canEditAssignedTo: true,
  canEditStatus: true,
  canEditRemarks: true,
  canEditPhotos: true,
};

// ─── Create permission ────────────────────────────────────────────────────────

/**
 * Role-based create-task gate, independent of edit-field permissions.
 * Admin, SuperAdmin, and Engineer can create tasks; Supervisor cannot.
 */
export function canCreateTask(loggedInRoleId: number | undefined): boolean {
  return (
    loggedInRoleId === ROLE_IDS.SUPER_ADMIN ||
    loggedInRoleId === ROLE_IDS.ADMIN ||
    loggedInRoleId === ROLE_IDS.ENGINEER
  );
}

// ─── Edit field permissions ───────────────────────────────────────────────────

/**
 * Resolves per-field edit permissions for the Task edit screen.
 *
 * Decision order:
 *   1. Admin / SuperAdmin → full access to all fields.
 *   2. Supervisor → status, remarks, and photos only; cannot change assignee.
 *   3. Engineer → can delegate (AssignedTo), update status, remarks, and photos;
 *      core fields remain read-only regardless of who assigned the task.
 *   4. Unknown roles → follow the RBAC baseline.
 *
 * NOTE: canCreateTask is intentionally NOT called here. Create access and
 * edit-field access are independent concerns.
 */
export function getTaskFieldPermissions(params: {
  loggedInRoleId: number | undefined;
  assignedByRoleId: number | undefined;
  hasBaseEditPermission: boolean;
}): TaskFieldPermissions {
  const { loggedInRoleId, assignedByRoleId, hasBaseEditPermission } = params;

  if (
    loggedInRoleId === ROLE_IDS.SUPER_ADMIN ||
    loggedInRoleId === ROLE_IDS.ADMIN
  ) {
    return ALL_EDITABLE;
  }

  if (loggedInRoleId === ROLE_IDS.SUPERVISOR) {
    switch (assignedByRoleId) {
      case ROLE_IDS.ENGINEER:
        return REMARKS_PHOTOS_AND_STATUS;
      case ROLE_IDS.ADMIN:
      case ROLE_IDS.SUPER_ADMIN:
        return REMARKS_PHOTOS_AND_STATUS;
      default:
        return REMARKS_PHOTOS_AND_STATUS;
    }
  }

  if (loggedInRoleId === ROLE_IDS.ENGINEER) {
    switch (assignedByRoleId) {
      case ROLE_IDS.ADMIN:
      case ROLE_IDS.SUPER_ADMIN:
        return hasBaseEditPermission ? ENGINEER_EDITABLE : NONE_EDITABLE;
      case ROLE_IDS.ENGINEER:
        return hasBaseEditPermission ? ENGINEER_EDITABLE : NONE_EDITABLE;
      default:
        return hasBaseEditPermission ? ENGINEER_EDITABLE : NONE_EDITABLE;
    }
  }

  return hasBaseEditPermission ? ALL_EDITABLE : NONE_EDITABLE;
}