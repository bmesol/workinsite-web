interface WorkModeRequest {
  name: string;
}

interface WorkMode {
  id: number;
  name: string;
}

export interface workModeDetailsProps {
  id: string;
  onUpdateSuccess: () => void; 
}

export interface WorkModeListProps {
  workModeDetails: WorkMode[];
  handleWorkModeDelete: (id: number) => void;
  handleWorkModeEdit: (workMode: { id: number; name: string }) => void;
  editingWorkModeId: number | null;
}

export type { WorkModeRequest, WorkMode };