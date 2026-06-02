// import { useState } from "react";
// import type { WorkType } from "../../DTOs/WorkTypeProps";
// import type { WorkerRole, WorkerRoles } from "../../DTOs/WorkRoleProps";

// const useWorkerCategoryInputValidate = (
//   workerCategoryName: string,
//   workTypeList: WorkType[],
//   workerRoleList: (WorkerRole | WorkerRoles)[],
// ) => {
//   const initialError = {
//     workerCategoryName: "",
//     workTypeList: "",
//     workerRoleList: "",
//   };
//   const [error, setError] = useState(initialError);

//   const validate = () => {
//     const newError = { ...initialError };
//     let isValid = true;

//     const updateError = (field: keyof typeof initialError, message: string) => {
//       newError[field] = message;
//       isValid = false;
//     };

//     // Worker Category Name validation
//     if (!workerCategoryName)
//       updateError("workerCategoryName", "Please enter worker category name");
//     if (
//       workerCategoryName &&
//       (workerCategoryName.length < 2 ||
//         !/^[a-zA-Z]+ ?[a-zA-Z]+ ?[a-zA-Z]*$/.test(workerCategoryName))
//     )
//       updateError("workerCategoryName", "Invalid worker category name");

//     // Work Type validation — at least 1 required
//     if (!workTypeList || workTypeList.length === 0)
//       updateError("workTypeList", "Please add at least one work type");

//     // Worker Role validation — at least 1 required
//     if (!workerRoleList || workerRoleList.length === 0)
//       updateError("workerRoleList", "Please add at least one worker role");

//     setError(newError);
//     return isValid;
//   };

//   return { error, validate };
// };

// export { useWorkerCategoryInputValidate };



import { useState } from "react";
import type { WorkType } from "../../DTOs/WorkTypeProps";
import type { WorkerRole, WorkerRoles } from "../../DTOs/WorkRoleProps";

const useWorkerCategoryInputValidate = (
  workerCategoryName: string,
  workTypeList: WorkType[],
  workerRoleList: (WorkerRole | WorkerRoles)[],
) => {
  const initialError = {
    workerCategoryName: "",
    workTypeList: "",
    workerRoleList: "",
  };

  const [error, setError] = useState(initialError);

  const validate = () => {
    const newError = { ...initialError };
    let isValid = true;

    const updateError = (field: keyof typeof initialError, message: string) => {
      newError[field] = message;
      isValid = false;
    };

    // 1. Name validation
    if (!workerCategoryName.trim()) {
      updateError("workerCategoryName", "Please enter worker category name");
    } else if (
      workerCategoryName.trim().length < 2 ||
      !/^[A-Za-z ]+$/.test(workerCategoryName.trim())
    ) {
      updateError("workerCategoryName", "Invalid worker category name");
    }

    // 2. Work Type → REQUIRED ✅
    if (!workTypeList || workTypeList.length === 0) {
      updateError("workTypeList", "Please add at least one work type");
    }

    // 3. Worker Role → REQUIRED ✅
    if (!workerRoleList || workerRoleList.length === 0) {
      updateError("workerRoleList", "Please add at least one worker role");
    }

    setError(newError);
    return isValid;
  };

  return { error, validate };
};

export { useWorkerCategoryInputValidate };