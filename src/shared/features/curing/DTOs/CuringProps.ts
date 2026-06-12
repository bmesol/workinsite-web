import type { CuringType } from '@/shared/features/curing/DTOs/CuringTypeProps';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';

export interface CuringDTO {
  id: number;
  siteId: Site;
  curingType: CuringType;
  note: string;
  startDate: string;
  endDate: string;
}

export interface CuringCreationRequest {
  siteId: number;
  curingTypeId: number;
  startDate: string;
  endDate: string;
  note: string;
}

export interface CuringUpdationRequest extends CuringCreationRequest {}