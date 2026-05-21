import { useState } from "react";
import type { WorkTypeCreateFormProps } from "../../DTOs/WorkTypeProps";

export const useWorkType = (props: WorkTypeCreateFormProps) => {
  const { workTypeList, setWorkTypeList, onClose, updatedWorkTypeList } = props; // ← onClose instead of bottomSheetRef

  const [workType, setWorkType] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!workType.trim()) {
      setError("Enter work type");
      return;
    }

    const trimmedWorkType = workType.trim().toLowerCase();

    const isDuplicate = workTypeList.some(
      (type) => type.name?.toLowerCase().trim() === trimmedWorkType  // ← type.name since WorkType[]
    );

    const isDuplicateUpdated = updatedWorkTypeList?.some(
      (type) => type.name?.toLowerCase().trim() === trimmedWorkType
    );

    if (isDuplicate || isDuplicateUpdated) {
      setError("Work type already exists");
      return;
    }

    setWorkTypeList([...workTypeList, { name: workType.trim() } as any]); // ← object instead of string
    setWorkType("");
    setError("");
    onClose?.(); // ← replaces bottomSheetRef?.current.close()
  };

  return {
    workType,
    setWorkType,
    handleAdd,
    workTypeList,
    setWorkTypeList,
    error,
  };
};