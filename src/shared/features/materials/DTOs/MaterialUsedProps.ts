import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { Material } from '@/shared/features/materials/DTOs/MaterialProps';
import type { WorkMode } from '@/shared/features/workers/DTOs/WorkModeProps';

interface MaterialUsedCreationRequest {
  siteId: number;
  materialId: number;
  quantity: string;
  workModeId: number;
  note: string;
  date: string;
}

interface MaterialUsedUpdationRequest {
  siteId: number;
  materialId: number;
  quantity: string;
  workModeId: number;
  note: string;
  date: string;
}

interface MaterialUsed {
  id: number;
  workMode: WorkMode;
  site: Site;
  material: Material;
  quantity: string;
  notes: string;
  date: string;
}

export type {
  MaterialUsedCreationRequest,
  MaterialUsedUpdationRequest,
  MaterialUsed,
};