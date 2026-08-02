// import { useEffect, useState } from "react";
// import type { WorkTypeEditFormProps, WorkType } from "../../DTOs/WorkTypeProps";

// export const useWorkTypeEditForm = (props: WorkTypeEditFormProps) => {
//   const {
//     workTypeList,
//     setWorkTypeList,
//     selectedItem,
//     onClose,                // ← Ref → onClose
//     updatedWorkTypeList,
//     setUpdatedWorkTypeList,
//   } = props;

//   const [name, setName] = useState(selectedItem?.value?.name || "");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setName(selectedItem?.value.name || "");
//   }, [selectedItem]);

//   const handleSave = () => {
//     if (!selectedItem) return;

//     const trimmedName = name.trim().toLowerCase();

//     if (trimmedName === "") {
//       setError("Enter work type");
//       return;
//     }

//     const combinedList = [
//       ...(workTypeList || []).map((item: any, index) => ({
//         name: typeof item === "string" ? item : item.name,
//         index,
//         source: "new",
//       })),
//       ...(updatedWorkTypeList || []).map((item, index) => ({
//         name: item.name,
//         index,
//         source: "update",
//       })),
//     ];

//     const isDuplicate = combinedList.some(
//       (item) =>
//         item.name.trim().toLowerCase() === trimmedName &&
//         (item.index !== selectedItem.index ||
//           item.source !== selectedItem.source)
//     );

//     if (isDuplicate) {
//       setError("Work type already exists");
//       return;
//     }

//     const hasId = "id" in selectedItem.value;

//     if (hasId && updatedWorkTypeList && setUpdatedWorkTypeList) {
//       const updatedList = [...updatedWorkTypeList];
//       updatedList[selectedItem.index] = {
//         name: name.trim(),
//         id: (selectedItem.value as WorkType).id,
//       };
//       setUpdatedWorkTypeList(updatedList);
//     } else {
//       const updatedList = [...workTypeList];
//       updatedList[selectedItem.index] = { name: name.trim() } as any; 
//       setWorkTypeList(updatedList);
//     }

//     setError("");
//     onClose?.();  
//   };

//   return {
//     handleSave,
//     error,
//     name,
//     setName,
//   };
// };


import { useEffect, useState } from "react";
import type { WorkTypeEditFormProps, WorkType, WorkTypeNew } from "../../DTOs/WorkTypeProps";
import { useUnitService } from "@/shared/features/materials/service/UnitService"; // path adjust pannunga
import type { Unit } from "@/shared/features/materials/DTOs/UnitProps"; // path adjust pannunga

export const useWorkTypeEditForm = (props: WorkTypeEditFormProps) => {
  const {
    workTypeList,
    setWorkTypeList,
    selectedItem,
    onClose,
    updatedWorkTypeList,
    setUpdatedWorkTypeList,
  } = props;

  const isExisting = selectedItem ? "id" in selectedItem.value : false;
  const existingUnit = isExisting
    ? (selectedItem?.value as WorkType).unit
    : undefined;

  const [name, setName] = useState(selectedItem?.value?.name || "");
  const [unitId, setUnitId] = useState(existingUnit?.id?.toString() ?? "");
  const [unitName, setUnitName] = useState(existingUnit?.name ?? "");
  const [unitList, setUnitList] = useState<Unit[]>(
    existingUnit ? [{ id: existingUnit.id, name: existingUnit.name }] : []
  );
  const [error, setError] = useState({ name: "", unit: "" });

  const unitService = useUnitService();

  useEffect(() => {
    if (!selectedItem) return;
    setName(selectedItem.value.name || "");
    if ("id" in selectedItem.value) {
      const wt = selectedItem.value as WorkType;
      setUnitId(wt.unit?.id?.toString() ?? "");
      setUnitName(wt.unit?.name ?? "");
      setUnitList(wt.unit ? [{ id: wt.unit.id, name: wt.unit.name }] : []);
    } else {
      const wt = selectedItem.value as WorkTypeNew;
      setUnitId(wt.unitId?.toString() ?? "");
      setUnitName(wt.unitName ?? "");
      setUnitList(wt.unitId ? [{ id: wt.unitId, name: wt.unitName }] : []);
    }
  }, [selectedItem]);

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

  const handleSave = () => {
    if (!selectedItem) return;

    const trimmedName = name.trim();
    const newError = { name: "", unit: "" };
    let isValid = true;

    if (!trimmedName) {
      newError.name = "Enter work type";
      isValid = false;
    } else {
      const lower = trimmedName.toLowerCase();
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
          item.name.trim().toLowerCase() === lower &&
          (item.index !== selectedItem.index || item.source !== selectedItem.source)
      );

      if (isDuplicate) {
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

    if (isExisting && updatedWorkTypeList && setUpdatedWorkTypeList) {
      const updatedList = [...updatedWorkTypeList];
      const existing = selectedItem.value as WorkType;
      updatedList[selectedItem.index] = {
        ...existing,
        name: trimmedName,
        unitId: parseInt(unitId),   // flat field the API reads for unit updates
        unit: {
          ...existing.unit,
          id: parseInt(unitId),
          name: unitName,
        },
      };
      setUpdatedWorkTypeList(updatedList);
    } else {
      const updatedList = [...workTypeList];
      updatedList[selectedItem.index] = {
        name: trimmedName,
        unitId: parseInt(unitId),
        unitName,
      } as any;
      setWorkTypeList(updatedList);
    }

    setError({ name: "", unit: "" });
    onClose?.();
  };

  return {
    handleSave,
    error,
    name,
    setName,
    unitId,
    unitDetails,
    fetchUnits,
    handleUnitChange,
  };
};