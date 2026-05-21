import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { NameField } from "@/shared/components/FormFields/NameField";
import { Header } from "@/shared/components/Header/Header";
import { useWorkerCategoryEdit } from "./useWorkerCategoryEditPage";
import { useParams, useSearchParams } from "react-router-dom";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent } from "@/shared/components/ui/card";
import WorkTypeCreateForm from "../../components/WorkTypeCreateForm/WorkTypeCreateForm";
import WorkTypeList from "../worker-type-list/WorkTypeList";
import WorkerRoleCreateForm from "../../components/WorkerRoleCreateForm/WorkerRoleCreateForm";
import WorkerRoleList from "../worker-role-list/WorkerRoleList";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

const WorkerCategoryEditPage = () => {
  const { id } = useParams<string>();
  const [queryString] = useSearchParams();

  const {
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
  } = useWorkerCategoryEdit(id as string, queryString);

  const [workTypeDialogOpen, setWorkTypeDialogOpen] = useState(false);
  const [workerRoleDialogOpen, setWorkerRoleDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-10">
      <Header title="Edit Worker Category" />

      <Card className="mt-4">
        <CardContent className="flex flex-col gap-4 pt-4">

          <NameField
            label="Worker Category Name"
            inputValue={name}
            setInputValue={setName}
            errorMessage={error.workerCategoryName}
            placeholder="Enter worker category name"
            required={true}
          />

          {/* Work Type Section */}
          {/* ✅ Replaced Button + PlusCircle with FormActionButton (same as ClientEditPage) */}
          <FormActionButton
            heading="Work Type"
            label="Add"
            onClick={() => setWorkTypeDialogOpen(true)}
            required={true}
            errorMessage={error.workTypeList}
            isColsTwo={true}
          />
          <WorkTypeList
            workTypeList={workTypeList}
            setWorkTypeList={setWorkTypeList}
            updatedWorkTypeList={updatedWorkTypeList}
            setUpdatedWorkTypeList={setUpdatedWorkTypeList}
            deletedWorkTypeList={deletedWorkTypeList}
            setDeletedWorkTypeList={setDeletedWorkTypeList}
          />
        
          <FormActionButton
            heading="Worker Role"
            label="Add"
            onClick={() => setWorkerRoleDialogOpen(true)}
            required={true}
            errorMessage={error.workerRoleList}
            isColsTwo={true}
          />
          <WorkerRoleList
            workerRoleList={workerRoleList}
            setWorkerRoleList={setWorkerRoleList}
            updateworkerRoleList={updateworkerRoleList}
            setUpdateWorkerRoleList={setUpdateWorkerRoleList}
            deleteworkerRoleList={deleteworkerRoleList}
            setDeleteWorkerRoleList={setDeleteWorkerRoleList}
          />

          <TextareaField
            label="Notes"
            inputValue={notes ?? ""}
            setInputValue={setNotes}
            placeholder="Enter your notes"
          />

          {/* Is Active Toggle */}
          <FormSubmissionButtons
            onCancel={handleCancel}
            onSave={handleSubmission}
          />

        </CardContent>
      </Card>

      {/* Work Type Dialog */}
      <Dialog open={workTypeDialogOpen} onOpenChange={setWorkTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Work Type</DialogTitle>
          </DialogHeader>
          <WorkTypeCreateForm
            workTypeList={workTypeList}
            setWorkTypeList={setWorkTypeList}
            updatedWorkTypeList={updatedWorkTypeList}
            onClose={() => setWorkTypeDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Worker Role Dialog */}
      <Dialog open={workerRoleDialogOpen} onOpenChange={setWorkerRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Worker Role</DialogTitle>
          </DialogHeader>
          <WorkerRoleCreateForm
            workerRoleList={workerRoleList}
            setWorkerRoleList={setWorkerRoleList}
            updateworkerRoleList={updateworkerRoleList}
            onClose={() => setWorkerRoleDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

    </div>
  );
};

export { WorkerCategoryEditPage };