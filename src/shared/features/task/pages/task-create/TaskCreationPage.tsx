import { useState } from "react";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { Header } from "@/shared/components/Header/Header";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { DatePicker } from "@/shared/components/FormFields/DatePicker";
import { SelectField } from "@/shared/components/FormFields/SelectField";
import SupervisorSelector from "../../components/SupervisorSelector/SupervisorSelector";
import SelectedSupervisorCard from "@/shared/components/SelectedSupervisorCard/SelectedSupervisorCard";
import { useTaskCreation } from "./useTaskCreation";
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { usePermission } from '@/shared/hooks/usePermission';
import { TaskUrls } from "../../utils/urls";
import PurchasePhoto from "@/shared/features/materials/pages/purchase-photo/PurchasePhoto";
import { UploadButton } from "@/shared/components/UploadButton/UploadButton";

const TaskCreationPage = () => {
  const { t } = useLanguage();
  const { canEdit } = usePermission();
  const editable = canEdit('Task');
  const [supervisorDialogOpen, setSupervisorDialogOpen] = useState(false);

  const {
    siteId,
    taskName,
    setTaskName,
    date,
    setDate,
    status,
    setStatus,
    priority,
    setPriority,
    workflowStatus,
    priorityType,
    remarks,
    setRemarks,
    error,
    siteDetails,
    fetchSites,
    handleSubmission,
    handleBackPress,
    handleSiteChange,
    supervisorId,
    setSupervisorId,
    supervisorDetails,
    loading,
    navigate,
    uploadedImages,
    setUploadedImages,
    handleFileChange,
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  } = useTaskCreation();

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Create Task')} />

      <Card className="mt-4 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Site */}
          <ComboboxField
            id="site-combobox"
            label={t('Site')}
            items={siteDetails}
            selectedValue={siteId}
            onValueChange={handleSiteChange}
            onSearch={fetchSites}
            error={error.site}
            required
            disabled={!editable}
          />

          {/* Task Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="taskName" className="text-base">
              {t('Task Name')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder={t('Enter your Task name')}
              rows={2}
              disabled={!editable}
            />
            {error.taskName && (
              <p className="text-sm text-red-500">{error.taskName}</p>
            )}
          </div>

          {/* Date */}
          <DatePicker
            label={t('Date')}
            date={date}
            onDateChange={setDate}
            errorMessage={error.date}
            required
            defaultDate={true}
            disable={!editable}
          />

          {/* Priority */}
          <SelectField
            label={t('Priority')}
            items={priorityType}
            selectedValue={priority}
            onValueChange={(val) => setPriority(val as string)}
            errorMessage={error.priority}
            required
            isDisabled={!editable}
          />

          {/* Status */}
          <SelectField
            label={t('Status')}
            items={workflowStatus}
            selectedValue={status}
            onValueChange={(val) => setStatus(val as string)}
            errorMessage={error.status}
            required
            isDisabled={!editable}
          />

          {/* Remarks */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="remarks" className="text-base">
              {t('Remarks')}
            </Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={t('Enter Remark')}
              rows={3}
              disabled={!editable}
            />
          </div>
        </div>

        {/* ── Assign Supervisor ── */}
        {siteId && (
          <div className="mt-4">
            <FormActionButton
              heading={t('Assign Supervisor')}
              label={t('Select')}
              onClick={() => setSupervisorDialogOpen(true)}
              isColsTwo={true}
              required={true}
              errorMessage={error.supervisor}
              isAddDisabled={!editable}
            />

            {supervisorId && (
              <SelectedSupervisorCard
                supervisorId={supervisorId}
                supervisorDetails={supervisorDetails}
              />
            )}
          </div>
        )}

        {/* ── Photos ── */}
        <div className="mt-4">
          <PurchasePhoto
            photo={uploadedImages}
            setPhoto={setUploadedImages}
            showImages={[]}
            setShowImages={() => {}}
            removeImages={[]}
            setRemoveImages={() => {}}
            permissionKey="Task"
          />
          <UploadButton
            text={t('Upload Images')}
            onFilesSelected={(files) =>
              handleFileChange({
                target: { files },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            buttonClassName="mt-2"
            disabled={!editable}
          />
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end gap-2 pt-6">
          <FormSubmissionButtons
            onCancel={handleBackPress}
            onSave={handleSubmission}
            disabled={loading || !editable}
          />
        </div>
      </Card>

      {/* ── Supervisor Dialog ── */}
      <Dialog
        open={supervisorDialogOpen}
        onOpenChange={(val) => !val && setSupervisorDialogOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Select Supervisor')}</DialogTitle>
          </DialogHeader>
          <SupervisorSelector
            supervisorDetails={supervisorDetails}
            supervisorId={supervisorId}
            setSupervisorId={setSupervisorId}
            onSelect={() => setSupervisorDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ── Unsaved Changes Dialog ──
          Mirrors mobile's 3-option Alert: Save / Exit without saving / Cancel */}
      <AlertDialog
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Unsaved Changes')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('You have unsaved changes. Do you want to save them?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUnsavedDialog(false)}>
              {t('Cancel')}
            </AlertDialogCancel>
            <AlertDialogCancel
              onClick={() => {
                resetFormFields();
                setShowUnsavedDialog(false);
                navigate(TaskUrls.list);
              }}
            >
              {t('Exit without Saving')}
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={() => {
                  handleSubmission();
                  setShowUnsavedDialog(false);
                }}
              >
                {t('Save')}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { TaskCreationPage };