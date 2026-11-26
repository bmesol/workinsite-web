// import { useWorkerCategoryInputValidate } from "../../components/InputValidate/WorkerCategoryInputValidate";
// import { useWorkerCategoryService } from "../../service/WorkerCategoryService";
// import type { WorkerCategoryProps } from "../../DTOs/WorkerCategoryProps";
// import { WorkerCategoriesUrls } from "../../utils/urls";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import type { WorkType } from "../../DTOs/WorkTypeProps";
// import type { WorkerRole, WorkerRoles } from "../../DTOs/WorkRoleProps";

// const useWorkerCategoryEdit = (id: string, queryString: URLSearchParams) => {
//   const navigate = useNavigate();
//   const redirectUrl = queryString.get("redirect");
//   const workerCategoryService = useWorkerCategoryService();

//   const [name, setName] = useState("");
//   const [notes, setNotes] = useState("");
//   const [isActive, setIsActive] = useState(true);
//   const [workerCategoryList, setWorkerCategoryList] = useState<WorkerCategoryProps>();

//   // WorkType states
//   const [workTypeList, setWorkTypeList] = useState<WorkType[]>([]);
//   const [updatedWorkTypeList, setUpdatedWorkTypeList] = useState<WorkType[]>([]);
//   const [deletedWorkTypeList, setDeletedWorkTypeList] = useState<number[]>([]);

//   // WorkerRole states
//   const [workerRoleList, setWorkerRoleList] = useState<WorkerRole[]>([]);
//   const [updateworkerRoleList, setUpdateWorkerRoleList] = useState<WorkerRoles[]>([]);
//   const [deleteworkerRoleList, setDeleteWorkerRoleList] = useState<number[]>([]);

//   const [loading, setLoading] = useState(false);

//   const { error, validate } = useWorkerCategoryInputValidate(
//     name,
//     [...workTypeList, ...updatedWorkTypeList],           // combined new + existing
//     [...workerRoleList, ...updateworkerRoleList],        // combined new + existing
//   );

//   const fetchWorkerCategory = async () => {
//     setLoading(true);
//     try {
//       const workerCategory = await workerCategoryService.getWorkerCategory(parseInt(id));
//       setWorkerCategoryList(workerCategory);
//       setName(workerCategory.name ?? workerCategory.workerCategoryName ?? "");
//       setNotes(workerCategory.note ?? "");
//       setIsActive(workerCategory.isActive);
//       setUpdatedWorkTypeList(workerCategory.workTypes ?? []);
//       setUpdateWorkerRoleList(workerCategory.workerRoles ?? []);
//     } catch (error: any) {
//       const errorMsg = error?.response?.data?.[0]?.message || "Could not fetch worker category. Please try again";
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchWorkerCategory(); }, []);

//   const handleCancel = () => {
//     if (redirectUrl) {
//       navigate(redirectUrl);
//       return;
//     }
//     navigate(WorkerCategoriesUrls.list);
//   };

//   const handleSubmission = async () => {
//     if (validate()) {
//       try {
//         const workerCategory = {
//           workerCategoryName: name.trim(),
//           note: notes.trim(),
//           isActive,
//         };

//         await workerCategoryService.updateWorkerCategory(parseInt(id), workerCategory);
//         toast.success("Worker category updated successfully");

//         if (redirectUrl) {
//           navigate(`${redirectUrl}&workerCategoryId=${id}`);
//           return;
//         }
//         navigate(WorkerCategoriesUrls.list);
//       } catch (error: any) {
//         const errorMsg = error?.response?.data?.[0]?.message || "Could not update worker category. Please try again";
//         toast.error(errorMsg);
//       }
//     }
//   };

//   return {
//     name,
//     setName,
//     notes,
//     setNotes,
//     isActive,
//     setIsActive,
//     error,
//     handleCancel,
//     handleSubmission,
//     loading,
//     // WorkType
//     workTypeList,
//     setWorkTypeList,
//     updatedWorkTypeList,
//     setUpdatedWorkTypeList,
//     deletedWorkTypeList,
//     setDeletedWorkTypeList,
//     // WorkerRole
//     workerRoleList,
//     setWorkerRoleList,
//     updateworkerRoleList,
//     setUpdateWorkerRoleList,
//     deleteworkerRoleList,
//     setDeleteWorkerRoleList,
//   };
// };

// export { useWorkerCategoryEdit };


import { useWorkerCategoryInputValidate } from "../../components/InputValidate/WorkerCategoryInputValidate";
import { useWorkerCategoryService } from "../../service/WorkerCategoryService";
import type { WorkerCategoryProps } from "../../DTOs/WorkerCategoryProps";
import { WorkerCategoriesUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUnsavedChangesGuard } from "@/shared/hooks/useUnsavedChangesGuard";
import { toast } from "sonner";
import { parseApiError } from "@/shared/utils/parseApiError";
import type { WorkType, WorkTypeNew } from "../../DTOs/WorkTypeProps";
import type { WorkerRole, WorkerRoles } from "../../DTOs/WorkRoleProps";

const useWorkerCategoryEdit = (id: string, queryString: URLSearchParams) => {
  const navigate = useNavigate();
  const redirectUrl = queryString.get("redirect");
  const workerCategoryService = useWorkerCategoryService();

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [workerCategoryList, setWorkerCategoryList] = useState<WorkerCategoryProps>();

  // workTypeList holds locally-added (unsaved) items
  const [workTypeList, setWorkTypeList] = useState<WorkTypeNew[]>([]);
  const [updatedWorkTypeList, setUpdatedWorkTypeList] = useState<WorkType[]>([]);
  const [deletedWorkTypeList, setDeletedWorkTypeList] = useState<number[]>([]);

  const [workerRoleList, setWorkerRoleList] = useState<WorkerRole[]>([]);
  const [updateworkerRoleList, setUpdateWorkerRoleList] = useState<WorkerRoles[]>([]);
  const [deleteworkerRoleList, setDeleteWorkerRoleList] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [initialData, setInitialData] = useState<{ name: string; notes: string; isActive: boolean; updatedWorkTypeList: WorkType[]; updateworkerRoleList: WorkerRoles[] } | null>(null);

  const { error, validate } = useWorkerCategoryInputValidate(
    name,
    [...workTypeList, ...updatedWorkTypeList],
    [...workerRoleList, ...updateworkerRoleList],
  );

  const fetchWorkerCategory = async () => {
    setLoading(true);
    try {
      const workerCategory = await workerCategoryService.getWorkerCategory(parseInt(id));

      setWorkerCategoryList(workerCategory);

      setName(workerCategory.name ?? workerCategory.workerCategoryName ?? "");
      setNotes(workerCategory.note ?? "");
      setIsActive(workerCategory.isActive);

      setUpdatedWorkTypeList(workerCategory.workTypes ?? []);
      setUpdateWorkerRoleList(workerCategory.workerRoles ?? []);
      setInitialData({
        name: workerCategory.name ?? workerCategory.workerCategoryName ?? "",
        notes: workerCategory.note ?? "",
        isActive: workerCategory.isActive,
        updatedWorkTypeList: workerCategory.workTypes ?? [],
        updateworkerRoleList: workerCategory.workerRoles ?? [],
      });
    } catch (error: unknown) {
      toast.error(parseApiError(error, "Could not fetch worker category. Please try again"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerCategory();
  }, [id]);

  const hasUnsavedChanges = () => {
    if (!initialData) return false;
    return (
      name !== initialData.name ||
      notes !== initialData.notes ||
      isActive !== initialData.isActive ||
      workTypeList.length > 0 ||
      deletedWorkTypeList.length > 0 ||
      workerRoleList.length > 0 ||
      deleteworkerRoleList.length > 0 ||
      JSON.stringify(updatedWorkTypeList) !== JSON.stringify(initialData.updatedWorkTypeList) ||
      JSON.stringify(updateworkerRoleList) !== JSON.stringify(initialData.updateworkerRoleList)
    );
  };

  useUnsavedChangesGuard(hasUnsavedChanges, () => setShowUnsavedDialog(true));

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
      return;
    }
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    navigate(WorkerCategoriesUrls.list);
  };
  const handleKeepEditing = () => setShowUnsavedDialog(false);
  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    navigate(WorkerCategoriesUrls.list);
  };
  const handleSaveFromDialog = async () => {
    setShowUnsavedDialog(false);
    await handleSubmission();
  };

  // backend ignores flat "workTypes"/"workerRoles" keys; use newWorkTypes/updatedWorkTypes/
  // deletedWorkTypes (and worker-role equivalents) which the backend actually reads.
  const handleSubmission = async () => {
    if (validate()) {
      try {
        const workerCategory = {
          name: name.trim(),
          note: notes.trim(),

          newWorkTypes: workTypeList.map((wt) => ({
            name: wt.name,
            unitId: wt.unitId,
          })),
          updatedWorkTypes: updatedWorkTypeList.map((wt) => ({
            id: wt.id,
            name: wt.name,
            unitId: wt.unit?.id,
          })),
          deletedWorkTypes: deletedWorkTypeList,

          newWorkerRoles: workerRoleList,
          updatedWorkerRoles: updateworkerRoleList,
          deletedWorkerRoles: deleteworkerRoleList,
        };

        await workerCategoryService.updateWorkerCategory(
          parseInt(id),
          workerCategory
        );

        toast.success("Worker category updated successfully");

        if (redirectUrl) {
          navigate(`${redirectUrl}&workerCategoryId=${id}`);
          return;
        }

        navigate(WorkerCategoriesUrls.list);
      } catch (error: unknown) {
        toast.error(parseApiError(error, "Could not update worker category. Please try again"));
      }
    }
  };

  return {
    name,
    setName,
    notes,
    setNotes,
    isActive,
    setIsActive,
    error,
    handleCancel,
    handleSubmission,
    showUnsavedDialog,
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
    loading,

    workTypeList,
    setWorkTypeList,
    updatedWorkTypeList,
    setUpdatedWorkTypeList,
    deletedWorkTypeList,
    setDeletedWorkTypeList,

    workerRoleList,
    setWorkerRoleList,
    updateworkerRoleList,
    setUpdateWorkerRoleList,
    deleteworkerRoleList,
    setDeleteWorkerRoleList,
  };
};

export { useWorkerCategoryEdit };