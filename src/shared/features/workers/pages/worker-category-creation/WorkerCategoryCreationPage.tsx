import { useState } from "react";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { NameField } from "@/shared/components/FormFields/NameField";
import { useWorkerCategoryCreation } from "./useWorkerCategoryCreation";
import { Header } from "@/shared/components/Header/Header";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/shared/components/ui/card";
import WorkTypeCreateForm from "../../components/WorkTypeCreateForm/WorkTypeCreateForm";
import WorkTypeList from "../worker-type-list/WorkTypeList";
import WorkerRoleCreateForm from "../../components/WorkerRoleCreateForm/WorkerRoleCreateForm";
import WorkerRoleList from "../worker-role-list/WorkerRoleList";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const WorkerCategoryCreationPage = () => {
  const { t } = useLanguage();
  const [queryString] = useSearchParams();

  const {
    workerCategoryName,
    setWorkerCategoryName,
    notes,
    setNotes,
    error,
    handleCancel,
    handleSubmission,
    workTypeList,
    setWorkTypeList,
    workerRoleList,
    setWorkerRoleList,
  } = useWorkerCategoryCreation(queryString);

  const [workTypeDialogOpen, setWorkTypeDialogOpen] = useState(false);
  const [workerRoleDialogOpen, setWorkerRoleDialogOpen] = useState(false);

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Create Worker Category')} />
      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">
          {/* Worker Category Name */}
          <NameField
            label={t('Worker Category Name')}
            inputValue={workerCategoryName}
            setInputValue={(v) => setWorkerCategoryName(v)}
            errorMessage={error.workerCategoryName}
            placeholder={t('Enter worker category name')}
            required={true}
          />

          {/* Work Type + Worker Role side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Work Type */}
            <div className="flex flex-col gap-3">
              <FormActionButton
                heading={t('Work Type')}
                label={t('Add')}
                onClick={() => setWorkTypeDialogOpen(true)}
                required
                isColsTwo={true}
                errorMessage={error.workTypeList}
              />
              <WorkTypeList
                workTypeList={workTypeList}
                setWorkTypeList={setWorkTypeList}
              />
            </div>

            {/* Worker Role */}
            <div className="flex flex-col gap-3">
              <FormActionButton
                heading={t('Worker Role')}
                label={t('Add')}
                onClick={() => setWorkerRoleDialogOpen(true)}
                required
                isColsTwo={true}
                errorMessage={error.workerRoleList}
              />
              <WorkerRoleList
                workerRoleList={workerRoleList}
                setWorkerRoleList={setWorkerRoleList}
              />
            </div>
          </div>

          {/* Notes */}
          <TextareaField
            label={t('Notes')}
            inputValue={notes}
            setInputValue={setNotes}
            placeholder={t('Enter your notes')}
          />

          <FormSubmissionButtons
            onCancel={handleCancel}
            onSave={handleSubmission}
          />
        </div>
      </Card>

      {/* Work Type Dialog */}
      <Dialog open={workTypeDialogOpen} onOpenChange={setWorkTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Create Work Type')}</DialogTitle>
          </DialogHeader>
          <WorkTypeCreateForm
            workTypeList={workTypeList}
            setWorkTypeList={setWorkTypeList}
            onClose={() => setWorkTypeDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Worker Role Dialog */}
      <Dialog
        open={workerRoleDialogOpen}
        onOpenChange={setWorkerRoleDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Create Worker Role')}</DialogTitle>
          </DialogHeader>
          <WorkerRoleCreateForm
            workerRoleList={workerRoleList}
            setWorkerRoleList={setWorkerRoleList}
            onClose={() => setWorkerRoleDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { WorkerCategoryCreationPage };
