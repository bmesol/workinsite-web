import type { AttendanceSplit } from './AttendanceProps';

interface AttendanceInputProps {
  date: string;
  siteId: string;
  wageTypeId: string;
  workTypeId: string;
  workerId: string;
  workedQuantity: string;
  workModeId: string;
  attendanceSplit: AttendanceSplit[];
}

export type {AttendanceInputProps};