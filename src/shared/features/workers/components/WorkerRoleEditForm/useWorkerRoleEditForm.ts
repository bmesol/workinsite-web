import { useEffect, useState } from "react";
import { useWorkerRoleInputValidate } from "../InputValidate/WorkerRoleValidate";
import type { WorkerRoleEditFormProps, WorkerRoles } from "../../DTOs/WorkRoleProps";

export const useWorkerRoleEditForm = (props: WorkerRoleEditFormProps) => {
  const {
    workerRoleList,
    setWorkerRoleList,
    selectedItem,
    onClose,           // ← replaces bottomSheetRef
    updateworkerRoleList,
    setUpdateWorkerRoleList,
  } = props;

  const [name, setName] = useState(selectedItem.value.name);
  const [salaryPerShift, setSalaryPerShift] = useState(selectedItem.value.salaryPerShift);
  const [hoursPerShift, setHoursPerShift] = useState(selectedItem.value.hoursPerShift);

  const { error, validate, setError, initialError } = useWorkerRoleInputValidate(
    name,
    salaryPerShift,
    hoursPerShift
  );

  useEffect(() => {
    setName(selectedItem.value.name);
    setSalaryPerShift(selectedItem.value.salaryPerShift);
    setHoursPerShift(selectedItem.value.hoursPerShift);
  }, [selectedItem]);

  const handleSave = () => {
    if (!validate()) return;

    const trimmedName = name.trim().toLowerCase();

    const combinedList = [
      ...(workerRoleList || []),
      ...(updateworkerRoleList || []),
    ];

    const isDuplicate = combinedList.some((role, index) => {
      const currentName = role?.name?.trim().toLowerCase();
      const isSame = currentName === trimmedName;

      // Skip current item if it has an id (existing role)
      if (
        (selectedItem.value as WorkerRoles).id !== undefined &&
        "id" in role &&
        (selectedItem.value as WorkerRoles).id === role.id
      ) {
        return false;
      }

      // Skip current item if it's new (no id), match by index and name
      if (
        (selectedItem.value as WorkerRoles).id === undefined &&
        role?.name === selectedItem.value.name &&
        index === selectedItem.index
      ) {
        return false;
      }

      return isSame;
    });

    if (isDuplicate) {
      setError((prev) => ({ ...prev, name: "Role name already exists" }));
      return;
    }

    const updatedRole = {
      name: name.trim(),
      salaryPerShift,
      hoursPerShift,
    };

    const hasId =
      "id" in selectedItem.value &&
      selectedItem.value.id !== undefined &&
      selectedItem.value.id !== null;

    if (hasId && updateworkerRoleList && setUpdateWorkerRoleList) {
      const updatedList = [...updateworkerRoleList];
      updatedList[selectedItem.index] = {
        ...updatedRole,
        id: (selectedItem.value as WorkerRoles).id,
      };
      setUpdateWorkerRoleList(updatedList);
    } else {
      const updatedList = [...workerRoleList];
      updatedList[selectedItem.index] = updatedRole;
      setWorkerRoleList(updatedList);
    }

    onClose?.();              // ← replaces bottomSheetRef.current?.close()
    setError(initialError);
  };

  return {
    name,
    setName,
    salaryPerShift,
    setSalaryPerShift,
    hoursPerShift,
    setHoursPerShift,
    handleSave,
    error,
    validate,
    setError,
    initialError,
  };
};