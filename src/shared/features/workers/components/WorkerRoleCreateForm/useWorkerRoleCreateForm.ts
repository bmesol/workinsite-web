import { useState } from "react";
import { useWorkerRoleInputValidate } from "../../components/InputValidate/WorkerRoleValidate"
import type { WorkerRoleCreateFormProps } from "../../DTOs/WorkRoleProps";

export const useWorkerRoleCreateForm = (props: WorkerRoleCreateFormProps) => {
  const { workerRoleList, setWorkerRoleList, updateworkerRoleList, onClose } = props; // ← onClose instead of bottomSheetRef

  const [name, setName] = useState("");
  const [salaryPerShift, setSalaryPerShift] = useState("");
  const [hoursPerShift, setHoursPerShift] = useState("");

  const { error, validate, setError, initialError } = useWorkerRoleInputValidate(
    name,
    salaryPerShift,
    hoursPerShift,
  );

  const handleAdd = () => {
    if (!validate()) return;

    const trimmedName = name.trim().toLowerCase();

    const isDuplicate = workerRoleList.some(
      (role) => role.name.trim().toLowerCase() === trimmedName
    );
    const isDuplicateUpdate = updateworkerRoleList?.some(
      (role) => role?.name.trim().toLowerCase() === trimmedName
    );

    if (isDuplicate || isDuplicateUpdate) {
      setError((prev) => ({ ...prev, name: "Role name already exists" }));
      return;
    }

    const newRole = {
      name: name.trim(),
      salaryPerShift,
      hoursPerShift,
    };

    setWorkerRoleList([...workerRoleList, newRole]);
    setName("");
    setSalaryPerShift("");
    setHoursPerShift("");
    setError(initialError);
    onClose?.();  // ← bottomSheetRef?.current?.close() → onClose?.()
  };

  return {
    name,
    setName,
    salaryPerShift,
    setSalaryPerShift,
    hoursPerShift,
    setHoursPerShift,
    handleAdd,
    error,
  };
};