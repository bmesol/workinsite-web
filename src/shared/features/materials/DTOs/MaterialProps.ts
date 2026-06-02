import type { Unit } from "./UnitProps";

interface MaterialRequest {
  name: string;
  unitId: number;
  hsnCode: string;
}

interface Material {
  id: number;
  name: string;
  unit: Unit;  
  hsnCode: string;
}

export type { MaterialRequest, Material };