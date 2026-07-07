import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Header } from '@/shared/components/Header/Header';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import { SelectField } from '@/shared/components/FormFields/SelectField';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import { FormActionButton } from '@/shared/components/FormActionButton/FormActionButton';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/components/ui/alert-dialog';
import { useState } from 'react';
import { useTaskEdit } from './useTaskEdit';
import { usePermission } from '@/shared/hooks/usePermission';
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { TaskUrls } from '../../utils/urls';
import SupervisorSelector from '../../components/SupervisorSelector/SupervisorSelector';
import SelectedSupervisorCard from '@/shared/components/SelectedSupervisorCard/SelectedSupervisorCard';
import RemarkSection from '@/shared/components/RemarkSection/RemarkSection';
import PurchasePhoto from '@/shared/features/materials/pages/purchase-photo/PurchasePhoto';
import { UploadButton } from "@/shared/components/UploadButton/UploadButton";

export const TaskEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canEdit } = usePermission();
  const editable = canEdit('Task');
  const { t } = useLanguage();

  const [supervisorDialogOpen, setSupervisorDialogOpen] = useState(false);

  if (!id) return null;

  const {
    taskName, setTaskName,
    siteId,
    supervisorId, setSupervisorId,
    date, setDate,
    priority, setPriority,
    status, setStatus,
    remarks,
    handleSiteChange,
    handleSubmission,
    handleFileChange,
    uploadedImages,
    setUploadedImages,
    showImage, setShowImage,
    removedImages, setRemovedImages,
    loading,
    workflowStatus,
    priorityType,
    error,
    fetchSites,
    handleBack,
    isImageSheetOpen,
    handleImageSheetOpen,
    handleImageSheetClose,
    handleImageUpload,
    siteDetails,
    supervisorDetails,
    taskDetails,
    newRemark, setNewRemark,
    taskCreatorId,
    showUnsavedDialog,
    setShowUnsavedDialog,
    fetchTask,
    resetFormFields,
    setError,
    initialError,
  } = useTaskEdit(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">{t('Loading...')}</p>
      </div>
    );
  }

  if (!taskDetails) return null;

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Edit Task')} />

      <Card className="mt-4 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Site */}
          <ComboboxField
            id="site"
            label={t('Site')}
            items={siteDetails}
            selectedValue={siteId}
            onValueChange={handleSiteChange}
            onSearch={fetchSites}
            required
            error={error.site}
            disabled={!editable}
          />

          {/* Task Name */}
          <TextareaField
            label={t('Task Name')}
            inputValue={taskName}
            setInputValue={setTaskName}
            placeholder={t('Enter your Task name')}
            required
            errorMessage={error.taskName}
            isDisabled={!editable}
          />

          {/* Date */}
          <DatePicker
            label={t('Date')}
            date={date}
            onDateChange={setDate}
            required
            errorMessage={error.date}
            defaultDate
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
          />

          {/* New Remark input */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-base font-medium">{t('Remarks')}</Label>
            <Textarea
              value={newRemark}
              onChange={e => setNewRemark(e.target.value)}
              placeholder={t('Type your remark...')}
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
            />
            {error.supervisor && (
              <p className="text-sm text-red-500 mt-1">{error.supervisor}</p>
            )}
            {supervisorId && (
              <SelectedSupervisorCard
                supervisorId={supervisorId}
                supervisorDetails={supervisorDetails}
              />
            )}
          </div>
        )}

        {/* ── Remark chat history ── */}
        {remarks.length > 0 && (
          <div className="mt-4">
            <RemarkSection
              remarks={remarks}
              newRemark={newRemark}
              setNewRemark={setNewRemark}
              taskCreatorId={taskCreatorId}
            />
          </div>
        )}

        {/* ── Photos ── */}
        <div className="mt-4">
          <PurchasePhoto
            photo={uploadedImages}
            setPhoto={setUploadedImages}
            showImages={showImage}
            setShowImages={setShowImage}
            removeImages={removedImages}
            setRemoveImages={setRemovedImages}
            permissionKey="Task"
          />
          <UploadButton
            text={t('Upload Images')}
            onFilesSelected={(files) =>
              handleFileChange({ target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            disabled={!editable}
            buttonClassName="mt-2"
          />
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end gap-2 pt-6">
          <FormSubmissionButtons
            onSave={handleSubmission}
            onCancel={handleBack}
            disabled={!editable}
          />
        </div>
      </Card>

      {/* ── Supervisor Dialog ── */}
      <Dialog
        open={supervisorDialogOpen}
        onOpenChange={setSupervisorDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
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

      {/* ── Unsaved Changes Dialog ── */}
      <AlertDialog
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Unsaved Changes')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('You have unsaved changes. Do you want to save them before leaving?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                resetFormFields();
                fetchTask();
                setError(initialError);
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
