export const USER_STATUS_LIST = [
  { key: "active",   labelKey: "Active User",  color: "var(--success-color)" },
  { key: "inactive", labelKey: "Inactive User", color: "var(--danger-color)"  },
] as const;

export function getUserStatusColor(isActive: boolean): string {
  return isActive ? "var(--success-color)" : "var(--danger-color)";
}
