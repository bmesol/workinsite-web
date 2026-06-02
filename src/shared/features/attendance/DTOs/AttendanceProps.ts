import type { Shift } from '@/shared/features/workers/DTOs/ShiftProps';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { Unit } from '@/shared/features/materials/DTOs/UnitProps';
import type { WageType, Worker } from '@/shared/features/workers/DTOs/WorkerProps';
import type { WorkMode } from '@/shared/features/workers/DTOs/WorkModeProps';

export type WorkerCategory = {
  id: number;
  name: string;
  note: string;
};

export type WorkerRole = {
  id: number;
  name: string;
  salaryPerShift: string;
  hoursPerShift: string;
  workerCategory: WorkerCategory;
};

interface AttendanceSplits {
  workerRoleId: number;
  shiftId: number;
  noOfPersons: string;
}

interface AttendanceSplit {
  workerRole: WorkerRole;
  shift: Shift;
  noOfPersons: string;
}

interface WorkType {
  id: number;
  name: string;
  workerCategory: WorkerCategory; 
}

type UploadedImage = {
  name: string;
  type: string;      // fixed: was "interface" (typo in mobile code)
  uri: string;       // base64 string or blob URL (URL.createObjectURL)
  file?: File;       // web only: original File object for FormData upload
};

export type ViewImages = {
  id: number;
  imagePath: string;
  staticBaseUrl: string;
};

interface AttendanceCreationRequest {
  date: string;
  siteId: number;
  wageTypeId: number;
  workTypeId: number;
  workerId: number;
  workedQuantity: string;
  unitId: number;
  workModeId: number;
  attendanceSplitsJsonString: string;
  note: string;
  images?: File[];   // web: File[] instead of React Native any
}

interface AttendanceUpdationRequest {
  date: string;
  siteId: number;
  wageTypeId: number;
  workTypeId: number;
  workerId: number;
  workedQuantity: string;
  unitId: number;
  workModeId: number;
  attendanceSplitsJsonString: string;
  note: string;
  images?: File[];   // web: added for consistency with creation
}

interface AttendanceProps {
  id: number;
  date: string;
  site: Site;
  wageType: WageType;
  workType: WorkType;
  worker: Worker;
  workedQuantity: string;
  unit: Unit;
  shift: Shift;
  workMode: WorkMode;
  notes: string;
  attendanceSplits: AttendanceSplit[];
  images?: ViewImages[];  // web: array of image URLs instead of any
}

export type {
  AttendanceSplit,
  AttendanceSplits,
  AttendanceCreationRequest,
  AttendanceUpdationRequest,
  AttendanceProps,
  UploadedImage,
  WorkType,
  
};