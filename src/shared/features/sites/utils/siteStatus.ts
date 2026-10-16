import { SITE_STATUS } from "@/shared/constants/appEnums";

export const SITE_STATUS_LIST = [
  { key: SITE_STATUS.YET_TO_START, labelKey: "Yet to Start", color: "var(--warning-color)" },
  { key: SITE_STATUS.WORKING,      labelKey: "Working",      color: "var(--success-color)" },
  { key: SITE_STATUS.HOLD,         labelKey: "Hold",         color: "var(--danger-color)"  },
  { key: SITE_STATUS.COMPLETED,    labelKey: "Completed",    color: "var(--complete-color)" },
] as const;

export function getSiteStatusColor(status: string): string {
  switch (status) {
    case SITE_STATUS.YET_TO_START: return "var(--warning-color)";
    case SITE_STATUS.WORKING:      return "var(--success-color)";
    case SITE_STATUS.HOLD:         return "var(--danger-color)";
    case SITE_STATUS.COMPLETED:    return "var(--complete-color)";
    default:                       return "var(--gray-color)";
  }
}
