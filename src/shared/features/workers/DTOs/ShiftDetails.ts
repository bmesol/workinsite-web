import type { Shift } from './ShiftProps';

export interface ShiftDetailsProps {
  id: string;
  isOpen: boolean;           // replaces ShiftSheetRef
  onClose: () => void;       // replaces ShiftSheetRef
  onUpdateSuccess: () => void;
}

export interface ShiftListProps {
  shiftDetails: Shift[];
  handleShiftDelete: (id: number) => void;
  handleShiftEdit: (shift: Shift) => void;
  editingShiftId: number | null;
  isLoading: boolean;        // replaces refreshing
  handleRefresh: () => void; // kept — can be a refresh button on web
}