import { useEffect, useState } from "react";
import type { WorkTypeEditFormProps, WorkType } from "../../DTOs/WorkTypeProps";

export const useWorkTypeEditForm = (props: WorkTypeEditFormProps) => {
  const {
    workTypeList,
    setWorkTypeList,
    selectedItem,
    onClose,                // ← Ref → onClose
    updatedWorkTypeList,
    setUpdatedWorkTypeList,
  } = props;

  const [name, setName] = useState(selectedItem?.value?.name || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(selectedItem?.value.name || "");
  }, [selectedItem]);

  const handleSave = () => {
    if (!selectedItem) return;

    const trimmedName = name.trim().toLowerCase();

    if (trimmedName === "") {
      setError("Enter work type");
      return;
    }

    const combinedList = [
      ...(workTypeList || []).map((item: any, index) => ({
        name: typeof item === "string" ? item : item.name,
        index,
        source: "new",
      })),
      ...(updatedWorkTypeList || []).map((item, index) => ({
        name: item.name,
        index,
        source: "update",
      })),
    ];

    const isDuplicate = combinedList.some(
      (item) =>
        item.name.trim().toLowerCase() === trimmedName &&
        (item.index !== selectedItem.index ||
          item.source !== selectedItem.source)
    );

    if (isDuplicate) {
      setError("Work type already exists");
      return;
    }

    const hasId = "id" in selectedItem.value;

    if (hasId && updatedWorkTypeList && setUpdatedWorkTypeList) {
      const updatedList = [...updatedWorkTypeList];
      updatedList[selectedItem.index] = {
        name: name.trim(),
        id: (selectedItem.value as WorkType).id,
      };
      setUpdatedWorkTypeList(updatedList);
    } else {
      const updatedList = [...workTypeList];
      updatedList[selectedItem.index] = { name: name.trim() } as any; // ← string → object
      setWorkTypeList(updatedList);
    }

    setError("");
    onClose?.();  // ← Ref?.current?.close() → onClose?.()
  };

  return {
    handleSave,
    error,
    name,
    setName,
  };
};