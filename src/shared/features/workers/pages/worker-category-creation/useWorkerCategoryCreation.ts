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
import type { WorkType } from "../../DTOs/WorkTypeProps";
import type { WorkerCategoryCreationRequest } from "../../DTOs/WorkerCategoryProps";

const useWorkerCategoryCreation = (queryString: URLSearchParams) => {
  const navigate = useNavigate();
  const redirectUrl = queryString.get("redirect");
  const workerCategoryService = useWorkerCategoryService();

  const [workerCategoryName, setWorkerCategoryName] = useState(
    queryString.get("workerCategoryName") || ""
  );
  const [notes, setNotes] = useState("");
  const [workTypeList, setWorkTypeList] = useState<WorkType[]>([]);
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
  workTypes: (workTypeList ?? []).map((wt) => wt.name), // ✅ {name} → string
  workerRoles: (workerRoleList ?? []).map((wr: any) => ({
    name: wr.name,
    salaryPerShift: wr.salaryPerShift ?? "",  
    hoursPerShift: wr.hoursPerShift ?? "",    
  })),
  note: notes ?? "",
};

    console.log("✅ Sending payload:", payload);

    const response =
      await workerCategoryService.createWorkerCategory(payload);

    console.log("✅ API Success:", response);

    if (redirectUrl) {
      navigate(`${redirectUrl}&workerCategoryId=${response?.id}`);
    } else {
      navigate(WorkerCategoriesUrls.list);
    }
  } catch (error: any) {
    console.log("❌ Full error:", error?.response?.data || error);
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