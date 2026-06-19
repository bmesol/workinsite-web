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
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { Header } from "@/shared/components/Header/Header";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { DatePicker } from "@/shared/components/FormFields/DatePicker";
import { SelectField } from "@/shared/components/FormFields/SelectField";
import SupervisorSelector from "../../components/SupervisorSelector/SupervisorSelector";
import { useTaskCreation } from "./useTaskCreate";
import { TaskUrls } from "../../utils/urls";
import PurchasePhoto from "@/shared/features/materials/pages/purchase-photo/PurchasePhoto";
import { UploadButton } from "@/shared/components/UploadButton/UploadButton";

const TaskCreationPage = () => {
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
  } = useTaskCreation();

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title="Create Task" />

      <Card className="mt-4 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Site */}
          <ComboboxField
            id="site-combobox"
            label="Site"
            items={siteDetails}
            selectedValue={siteId}
            onValueChange={handleSiteChange}
            onSearch={fetchSites}
            error={error.site}
            required
          />

          {/* Task Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="taskName" className="text-base">
              Task Name <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter your Task name"
              rows={2}
            />
            {error.taskName && (
              <p className="text-sm text-red-500">{error.taskName}</p>
            )}
          </div>

          {/* Date */}
          <DatePicker
            label="Date"
            date={date}
            onDateChange={setDate}
            errorMessage={error.date}
            required
            defaultDate={true}
          />

          {/* Priority */}
          <SelectField
            label="Priority"
            items={priorityType}
            selectedValue={priority}
            onValueChange={(val) => setPriority(val as string)}
            errorMessage={error.priority}
            required
          />

          {/* Status */}
          <SelectField
            label="Status"
            items={workflowStatus}
            selectedValue={status}
            onValueChange={(val) => setStatus(val as string)}
            errorMessage={error.status}
            required
          />

          {/* Remarks */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="remarks" className="text-base">
              Remarks
            </Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter your Remarks"
              rows={3}
            />
          </div>
        </div>

  <FormActionButton
    heading="Assign Supervisor"
    label="Select"
    onClick={() => setSupervisorDialogOpen(true)}
    isColsTwo={true}
    required={true}
    errorMessage={error.supervisor}
  />

  {supervisorId && (
    <div className="mt-2 p-3 rounded-xl border border-[var(--primary)] bg-white flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: "var(--primary)" }}
      >
        <span className="text-sm font-bold text-white">
          {supervisorDetails
            .find((s) => s.value === supervisorId)
            ?.label?.substring(0, 2)
            .toUpperCase()}
        </span>
      </div>
      <span className="text-base font-semibold text-black">
        {supervisorDetails.find((s) => s.value === supervisorId)?.label}
      </span>
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
            text="Upload Images"
            onFilesSelected={(files) =>
              handleFileChange({
                target: { files },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            buttonClassName="mt-2"
          />
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end gap-2 pt-6">
          <FormSubmissionButtons
            onCancel={() => navigate(TaskUrls.list)}
            onSave={handleSubmission}
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
            <DialogTitle>Select Supervisor</DialogTitle>
          </DialogHeader>
          <SupervisorSelector
            supervisorDetails={supervisorDetails}
            supervisorId={supervisorId}
            setSupervisorId={setSupervisorId}
            onSelect={() => setSupervisorDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { TaskCreationPage };