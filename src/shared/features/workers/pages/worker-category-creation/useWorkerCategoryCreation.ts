import { useWorkerCategoryInputValidate } from "../../components/InputValidate/WorkerCategoryInputValidate";
import { useWorkerCategoryService } from "@/shared/features/workers/service/WorkerCategoryService";
import { SitesUrls } from "../../../sites/utils/urls";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useWorkerCategoryCreation = (queryString: URLSearchParams) => {
  const navigate = useNavigate();
  const redirectUrl = queryString.get("redirect");
  const workerCategoryService = useWorkerCategoryService();

  const [workerCategoryName, setWorkerCategoryName] = useState(queryString.get("workerCategoryName") || "");
  const [notes, setNotes] = useState("");

  const { error, validate } = useWorkerCategoryInputValidate(workerCategoryName);

  const handleCancel = () => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    navigate(SitesUrls.list);
  };

  const handleSubmission = async () => {
    if (validate()) {
      if (redirectUrl) {
        const workerCategory = { workerCategoryName, note: notes };
        const response = await workerCategoryService.createWorkerCategory(workerCategory);
        navigate(`${redirectUrl}&workerCategoryId=${response.id}`);
        return;
      }
      navigate(SitesUrls.list);
    }
  };

  return { workerCategoryName, setWorkerCategoryName, notes, setNotes, error, handleCancel, handleSubmission };
};

export { useWorkerCategoryCreation };
