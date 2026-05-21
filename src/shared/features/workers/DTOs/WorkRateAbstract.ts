import type {Site} from '@/shared/features/sites/DTOs/SiteProps';
import type {Unit} from '@/shared/features/materials/DTOs/UnitProps';
import type { WorkType } from '../DTOs/WorkTypeProps';

interface WorkRateAbstractProps {
  id: number;
  site: Site;
  workType: WorkType;
  totalRate: string;
  totalQuantity: string;
  unit: Unit;
  note: string;
}

interface workerRateAbstractRequest {
  totalRate: string;
  totalQuantity: string;
  note: string;
  siteId: number;
  workTypeId: number;
  unitId: number;
}

interface WorkRateAbstractValidateProps {
  siteId: string;
  workTypeId: string;
  totalRate: string;
  totalQuantity: string;
  unitId: string;
}

export type {
  WorkRateAbstractProps,
  workerRateAbstractRequest,
  WorkRateAbstractValidateProps,
};