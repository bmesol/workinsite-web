// import { useWorkerCategoryInputValidate } from "../../components/InputValidate/WorkerCategoryInputValidate";
// import { useWorkerCategoryService } from "@/shared/features/workers/service/WorkerCategoryService";
// import { SitesUrls } from "../../../sites/utils/urls";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import type { WorkerRole, WorkerRoles } from "../../DTOs/WorkRoleProps";
// import type { WorkType } from "../../DTOs/WorkTypeProps";

// const useWorkerCategoryCreation = (queryString: URLSearchParams) => {
//   const navigate = useNavigate();
//   const redirectUrl = queryString.get("redirect");
//   const workerCategoryService = useWorkerCategoryService();

//   const [workerCategoryName, setWorkerCategoryName] = useState(queryString.get("workerCategoryName") || "");
//   const [notes, setNotes] = useState("");
//   const [workTypeList, setWorkTypeList] = useState<WorkType[]>([]);
// const [workerRoleList, setWorkerRoleList] = useState<(WorkerRole | WorkerRoles)[]>([]);

//   const { error, validate } = useWorkerCategoryInputValidate(
//   workerCategoryName,
//   workTypeList,
//   workerRoleList,
// );

//   const handleCancel = () => {
//     if (redirectUrl) {
//       navigate(redirectUrl);
//       return;
//     }
//     navigate(SitesUrls.list);
//   };

//   const handleSubmission = async () => {
//     if (validate()) {
//       if (redirectUrl) {
//         const workerCategory = { workerCategoryName, note: notes };
//         const response = await workerCategoryService.createWorkerCategory(workerCategory);
//         navigate(`${redirectUrl}&workerCategoryId=${response.id}`);
//         return;
//       }
//       navigate(SitesUrls.list);
//     }
//   };

//   return {
//   workerCategoryName, setWorkerCategoryName,
//   notes, setNotes,
//   workTypeList, setWorkTypeList,       // ← add
//   workerRoleList, setWorkerRoleList,   // ← add
//   error, handleCancel, handleSubmission
// };
// };

// export { useWorkerCategoryCreation };


import { useWorkerCategoryInputValidate } from "../../components/InputValidate/WorkerCategoryInputValidate";
import { useWorkerCategoryService } from "@/shared/features/workers/service/WorkerCategoryService";
import { WorkerCategoriesUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { WorkerRole, WorkerRoles } from "../../DTOs/WorkRoleProps";
import type { WorkTypeNew } from "../../DTOs/WorkTypeProps";
import type { WorkerCategoryCreationRequest } from "../../DTOs/WorkerCategoryProps";
import { toast } from "sonner";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const useWorkerCategoryCreation = (queryString: URLSearchParams) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const redirectUrl = queryString.get("redirect");
  const workerCategoryService = useWorkerCategoryService();

  const [workerCategoryName, setWorkerCategoryName] = useState(
    queryString.get("workerCategoryName") || ""
  );
  const [notes, setNotes] = useState("");
  const [workTypeList, setWorkTypeList] = useState<WorkTypeNew[]>([]);
  const [workerRoleList, setWorkerRoleList] = useState<
    (WorkerRole | WorkerRoles)[]
  >([]);

  const { error, validate } = useWorkerCategoryInputValidate(
    workerCategoryName,
    workTypeList,
    workerRoleList
  );

  const handleCancel = () => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    navigate(WorkerCategoriesUrls.list);
  };

 const handleSubmission = async () => {
  if (!validate()) return;

  try {
   const payload = {
  name: workerCategoryName.trim(),
  workTypes: (workTypeList ?? []).map((wt) => ({ name: wt.name, unitId: wt.unitId })),
  workerRoles: (workerRoleList ?? []).map((wr: any) => ({
    name: wr.name,
    salaryPerShift: wr.salaryPerShift ?? "",
    hoursPerShift: wr.hoursPerShift ?? "",
  })),
  note: notes ?? "",
};

    const response =
      await workerCategoryService.createWorkerCategory(payload);

    toast.success(t("Worker Category created successfully"));

    if (redirectUrl) {
      navigate(`${redirectUrl}&workerCategoryId=${response?.id}`);
    } else {
      navigate(WorkerCategoriesUrls.list);
    }
  } catch (error: any) {
    const errorMsg =
      error?.response?.data?.[0]?.message || "Failed to create worker category. Please try again.";
    toast.error(errorMsg);
  }
};

  return {
    workerCategoryName,
    setWorkerCategoryName,
    notes,
    setNotes,
    workTypeList,
    setWorkTypeList,
    workerRoleList,
    setWorkerRoleList,
    error,
    handleCancel,
    handleSubmission,
  };
};

export { useWorkerCategoryCreation };