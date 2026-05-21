import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { NameField } from "@/shared/components/FormFields/NameField";
import { useWorkerCategoryCreation } from "./useWorkerCategoryCreation";
import { Header } from "@/shared/components/Header/Header";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/shared/components/ui/card";

const WorkerCategoryCreationPage = () => {
  const [queryString] = useSearchParams();
  const {
    workerCategoryName,
    setWorkerCategoryName,
    notes,
    setNotes,
    error,
    handleCancel,
    handleSubmission,
  } = useWorkerCategoryCreation(queryString);

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title="Create Worker Category" />
      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">
          <NameField
            label="Worker Category Name"
            inputValue={workerCategoryName}
            setInputValue={(v) => setWorkerCategoryName(v)}
            errorMessage={error.workerCategoryName}
            placeholder="Enter worker category name"
            required={true}
          />
          <TextareaField
            label="Notes"
            inputValue={notes}
            setInputValue={setNotes}
            placeholder="Enter your notes"
          />
          <FormSubmissionButtons onCancel={handleCancel} onSave={handleSubmission} />
        </div>
      </Card>
    </div>
  );
};

export { WorkerCategoryCreationPage };