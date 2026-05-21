interface WorkType {
  name: string;
  id: number;
}

interface WorkTypes {
  name: string;
}

interface WorkTypeProp {
  name: string;
  id: number;
  workerCategory: {
    id: number;
    name: string;
    note: string;
  };
}

interface SelectedItemProps {
  index: number;
  value: WorkType | WorkTypes;
  source: string;
}

interface WorkTypeCreateFormProps {
  workTypeList: WorkType[];                                           // ← string[] → WorkType[]
  setWorkTypeList: React.Dispatch<React.SetStateAction<WorkType[]>>; // ← string[] → WorkType[]
  updatedWorkTypeList?: WorkType[];
  onClose?: () => void;                                              // ← bottomSheetRef → onClose
}

interface WorkTypeListProps {
  workTypeList: WorkType[];                                           // ← string[] → WorkType[]
  setWorkTypeList: React.Dispatch<React.SetStateAction<WorkType[]>>; // ← string[] → WorkType[]
  updatedWorkTypeList?: WorkType[];
  setUpdatedWorkTypeList?: React.Dispatch<React.SetStateAction<WorkType[]>>;
  deletedWorkTypeList?: number[];
  setDeletedWorkTypeList?: React.Dispatch<React.SetStateAction<number[]>>;
}

interface WorkTypeEditFormProps {
  workTypeList: WorkType[];                                           // ← string[] → WorkType[]
  setWorkTypeList: React.Dispatch<React.SetStateAction<WorkType[]>>; // ← string[] → WorkType[]
  updatedWorkTypeList?: WorkType[];
  setUpdatedWorkTypeList?: React.Dispatch<React.SetStateAction<WorkType[]>>;
  onClose?: () => void;                                              // ← Ref → onClose
  selectedItem?: SelectedItemProps;
  deletedWorkTypeList?: number[];
  setDeletedWorkTypeList?: React.Dispatch<React.SetStateAction<number[]>>;
}

export type {
  WorkType,
  WorkTypes,
  WorkTypeProp,
  WorkTypeListProps,
  SelectedItemProps,
  WorkTypeEditFormProps,
  WorkTypeCreateFormProps,
};