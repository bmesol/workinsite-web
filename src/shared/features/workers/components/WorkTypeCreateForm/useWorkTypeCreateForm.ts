// import { useState } from "react";
// import type { WorkTypeCreateFormProps } from "../../DTOs/WorkTypeProps";

// export const useWorkType = (props: WorkTypeCreateFormProps) => {
//   const { workTypeList, setWorkTypeList, onClose, updatedWorkTypeList } = props; // ← onClose instead of bottomSheetRef

//   const [workType, setWorkType] = useState("");
//   const [error, setError] = useState("");

//   const handleAdd = () => {
//     if (!workType.trim()) {
//       setError("Enter work type");
//       return;
//     }

//     const trimmedWorkType = workType.trim().toLowerCase();

//     const isDuplicate = workTypeList.some(
//       (type) => type.name?.toLowerCase().trim() === trimmedWorkType  // ← type.name since WorkType[]
//     );

//     const isDuplicateUpdated = updatedWorkTypeList?.some(
//       (type) => type.name?.toLowerCase().trim() === trimmedWorkType
//     );

//     if (isDuplicate || isDuplicateUpdated) {
//       setError("Work type already exists");
//       return;
//     }

//     setWorkTypeList([...workTypeList, { name: workType.trim() } as any]); 
//     setWorkType("");
//     setError("");
//     onClose?.(); 
//   };

//   return {
//     workType,
//     setWorkType,
//     handleAdd,
//     workTypeList,
//     setWorkTypeList,
//     error,
//   };
// };


import { useState } from "react";
import type { WorkTypeCreateFormProps } from "../../DTOs/WorkTypeProps";
import { useUnitService } from "@/shared/features/materials/service/UnitService"; // adjust path to your project
import type { Unit } from "@/shared/features/materials/DTOs/UnitProps"; // adjust path to your project

export const useWorkType = (props: WorkTypeCreateFormProps) => {
  const { workTypeList, setWorkTypeList, onClose, updatedWorkTypeList } = props;

  const [workType, setWorkType] = useState("");
  const [unitId, setUnitId] = useState("");
  const [unitName, setUnitName] = useState("");
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [error, setError] = useState({ name: "", unit: "" });

  const unitService = useUnitService();

  const fetchUnits = async (searchString: string = "") => {
    const units = await unitService.getUnits(searchString, false);
    if (!units) return;
    setUnitList(searchString ? units.slice(0, 3) : units);
  };

  const unitDetails = unitList.map((item) => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const handleUnitChange = (value: string) => {
    setUnitId(value);
    const selected = unitList.find((u) => u.id.toString() === value);
    setUnitName(selected?.name ?? "");
  };

  const handleAdd = () => {
    let isValid = true;
    const newError = { name: "", unit: "" };
    const trimmedWorkType = workType.trim();

    if (!trimmedWorkType) {
      newError.name = "Enter work type";
      isValid = false;
    } else {
      const lower = trimmedWorkType.toLowerCase();

      const isDuplicate = workTypeList.some(
        (type) => type.name?.toLowerCase().trim() === lower
      );

      const isDuplicateUpdated = updatedWorkTypeList?.some(
        (type) => type.name?.toLowerCase().trim() === lower
      );

      if (isDuplicate || isDuplicateUpdated) {
        newError.name = "Work type already exists";
        isValid = false;
      }
    }

    if (!unitId) {
      newError.unit = "Please select a unit";
      isValid = false;
    }

    setError(newError);
    if (!isValid) return;

    setWorkTypeList([
      ...workTypeList,
      { name: trimmedWorkType, unitId: parseInt(unitId), unitName },
    ]);

    setWorkType("");
    setUnitId("");
    setUnitName("");
    setError({ name: "", unit: "" });
    onClose?.();
  };

  return {
    workType,
    setWorkType,
    unitId,
    unitName,
    unitDetails,
    fetchUnits,
    handleUnitChange,
    handleAdd,
    workTypeList,
    setWorkTypeList,
    error,
  };
};