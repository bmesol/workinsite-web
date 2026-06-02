import type { Unit } from './UnitProps';

export interface UnitDetailsProps {
  id: string;
  onUpdateSuccess: () => void;
}

export interface UnitListProps {
  unitDetails: Unit[];
  handleUnitDelete: (id: number) => void;
  handleUnitEdit: (unit: { id: number; name: string }) => void;
  editingUnitId: number | null;
}