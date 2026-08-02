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

//   // ✅ Pass all 3 args — now validate checks name + workType + workerRole
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
import { toast } from "sonner";
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

  // ✅ WorkType states — workTypeList holds locally-added (unsaved) items
  const [workTypeList, setWorkTypeList] = useState<WorkTypeNew[]>([]);
  const [updatedWorkTypeList, setUpdatedWorkTypeList] = useState<WorkType[]>([]);
  const [deletedWorkTypeList, setDeletedWorkTypeList] = useState<number[]>([]);

  // ✅ WorkerRole states
  const [workerRoleList, setWorkerRoleList] = useState<WorkerRole[]>([]);
  const [updateworkerRoleList, setUpdateWorkerRoleList] = useState<WorkerRoles[]>([]);
  const [deleteworkerRoleList, setDeleteWorkerRoleList] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);

  // ✅ Validation (name + workTypes + workerRoles)
  const { error, validate } = useWorkerCategoryInputValidate(
    name,
    [...workTypeList, ...updatedWorkTypeList],
    [...workerRoleList, ...updateworkerRoleList],
  );

  // ✅ Fetch existing data
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
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.[0]?.message ||
        "Could not fetch worker category. Please try again";

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerCategory();
  }, [id]);

  // ✅ Cancel
  const handleCancel = () => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    navigate(WorkerCategoriesUrls.list);
  };

  // ✅ SUBMIT — payload shape now matches mobile exactly:
  // backend silently ignores unrecognized "workTypes"/"workerRoles" keys, so nested
  // updates (unit change, salary change) were never actually persisted before.
  // Sending newWorkTypes/updatedWorkTypes/deletedWorkTypes (and the worker-role
  // equivalents) is what the backend actually reads.
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
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message ||
          "Could not update worker category. Please try again";

        toast.error(errorMsg);
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
    loading,

    // ✅ WorkType
    workTypeList,
    setWorkTypeList,
    updatedWorkTypeList,
    setUpdatedWorkTypeList,
    deletedWorkTypeList,
    setDeletedWorkTypeList,

    // ✅ WorkerRole
    workerRoleList,
    setWorkerRoleList,
    updateworkerRoleList,
    setUpdateWorkerRoleList,
    deleteworkerRoleList,
    setDeleteWorkerRoleList,
  };
};

export { useWorkerCategoryEdit };