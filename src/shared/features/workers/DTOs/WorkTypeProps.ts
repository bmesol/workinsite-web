// interface WorkType {
//   name: string;
//   id: number;
// }

// interface WorkTypes {
//   name: string;
// }

// interface WorkTypeProp {
//   name: string;
//   id: number;
//   workerCategory: {
//     id: number;
//     name: string;
//     note: string;
//   };
// }

// interface SelectedItemProps {
//   index: number;
//   value: WorkType | WorkTypes;
//   source: string;
// }

// interface WorkTypeCreateFormProps {
//   workTypeList: WorkType[];                                           // ← string[] → WorkType[]
//   setWorkTypeList: React.Dispatch<React.SetStateAction<WorkType[]>>; // ← string[] → WorkType[]
//   updatedWorkTypeList?: WorkType[];
//   onClose?: () => void;                                              // ← bottomSheetRef → onClose
// }

// interface WorkTypeListProps {
//   workTypeList: WorkType[];                                           // ← string[] → WorkType[]
//   setWorkTypeList: React.Dispatch<React.SetStateAction<WorkType[]>>; // ← string[] → WorkType[]
//   updatedWorkTypeList?: WorkType[];
//   setUpdatedWorkTypeList?: React.Dispatch<React.SetStateAction<WorkType[]>>;
//   deletedWorkTypeList?: number[];
//   setDeletedWorkTypeList?: React.Dispatch<React.SetStateAction<number[]>>;
// }

// interface WorkTypeEditFormProps {
//   workTypeList: WorkType[];                                           // ← string[] → WorkType[]
//   setWorkTypeList: React.Dispatch<React.SetStateAction<WorkType[]>>; // ← string[] → WorkType[]
//   updatedWorkTypeList?: WorkType[];
//   setUpdatedWorkTypeList?: React.Dispatch<React.SetStateAction<WorkType[]>>;
//   onClose?: () => void;                                              // ← Ref → onClose
//   selectedItem?: SelectedItemProps;
//   deletedWorkTypeList?: number[];
//   setDeletedWorkTypeList?: React.Dispatch<React.SetStateAction<number[]>>;
// }

// export type {
//   WorkType,
//   WorkTypes,
//   WorkTypeProp,
//   WorkTypeListProps,
//   SelectedItemProps,
//   WorkTypeEditFormProps,
//   WorkTypeCreateFormProps,
// };


interface WorkTypeUnit {
  id: number;
  isActive: boolean;
  name: string;
  note: string | null;
}

// Existing/saved work type (from API) - has unit as nested object.
// unitId is the flat field the API needs when updating unit on an existing work type.
interface WorkType {
  id: number;
  name: string;
  unit: WorkTypeUnit;
  unitId?: number;
}

// New work type being added locally (not yet saved to API) - flat unit fields
interface WorkTypeNew {
  name: string;
  unitId: number;
  unitName: string;
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
  value: WorkType | WorkTypeNew;
  source: string;
}

interface WorkTypeCreateFormProps {
  workTypeList: WorkTypeNew[];
  setWorkTypeList: React.Dispatch<React.SetStateAction<WorkTypeNew[]>>;
  updatedWorkTypeList?: WorkType[];
  onClose?: () => void;
}

interface WorkTypeListProps {
  workTypeList: WorkTypeNew[];
  setWorkTypeList: React.Dispatch<React.SetStateAction<WorkTypeNew[]>>;
  updatedWorkTypeList?: WorkType[];
  setUpdatedWorkTypeList?: React.Dispatch<React.SetStateAction<WorkType[]>>;
  deletedWorkTypeList?: number[];
  setDeletedWorkTypeList?: React.Dispatch<React.SetStateAction<number[]>>;
}

interface WorkTypeEditFormProps {
  workTypeList: WorkTypeNew[];
  setWorkTypeList: React.Dispatch<React.SetStateAction<WorkTypeNew[]>>;
  updatedWorkTypeList?: WorkType[];
  setUpdatedWorkTypeList?: React.Dispatch<React.SetStateAction<WorkType[]>>;
  onClose?: () => void;
  selectedItem?: SelectedItemProps;
  deletedWorkTypeList?: number[];
  setDeletedWorkTypeList?: React.Dispatch<React.SetStateAction<number[]>>;
}

export type {
  WorkType,
  WorkTypeUnit,
  WorkTypeNew,
  WorkTypeProp,
  WorkTypeListProps,
  SelectedItemProps,
  WorkTypeEditFormProps,
  WorkTypeCreateFormProps,
};