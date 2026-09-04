import { Header } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useAttendanceCreation } from "./useAttendanceCreation";
import { AttendanceSplitCreationPage } from "../attendance-split-creation/AttendanceSplitCreationPage";
import AttendanceSplitList from "../attendance-split-list/AttendanceSplitList";
import { NameField } from "@/shared/components/FormFields/NameField";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { DatePicker } from "@/shared/components/FormFields/DatePicker";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { X } from "lucide-react";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { UploadButton } from "@/shared/components/UploadButton/UploadButton";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const AttendanceCreationPage = () => {
  const { t } = useLanguage();

  const {
    siteDetails,
    workTypeDetails,
    workerDetails,
    wageTypeDetails,
    workModeDetails,
    error,
    siteId,
    workType,
    workerId,
    wageTypeId,
    workModeId,
    notes,
    workedQuantity,
    date,
    attendanceSplit,
    uploadedImages,
    setAttendanceSplit,
    setDate,
    setWorkedQuantity,
    setSiteId,
    setWorkerId,
    setWageTypeId,
    setWorkModeId,
    setNotes,
    setUploadedImages,
    fetchSites,
    fetchWorkTypes,
    fetchWorkers,
    fetchWageTypes,
    fetchWorkModes,
    handleSubmit,
    handleImageUpload,
    deleteImage,
    isSplitDialogOpen,
    setIsSplitDialogOpen,
    deleteConfirmIndex,
    confirmDelete,
    handleDelete,
    cancelDelete,
    isWorkTypeChangeDialogOpen,
    confirmWorkTypeChange,
    cancelWorkTypeChange,
    handleWorkTypeChange,
    workQuantityIndicator,
  } = useAttendanceCreation();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Create Attendance')} />

      <Card className="mt-4">
        <CardContent className="pt-4">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            {/* Row 1: Date + Site */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker
                date={date}
                onDateChange={setDate}
                errorMessage={error.date}
                label={t('Date')}
                required
                defaultDate
              />
              <ComboboxField
                id="site"
                label={t('Site')}
                items={siteDetails}
                selectedValue={siteId}
                onValueChange={setSiteId}
                onSearch={fetchSites}
                error={error.site}
                required
              />
            </div>

            {/* Row 2: Wage Type + Work Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ComboboxField
                id="wageType"
                label={t('Wage Type')}
                items={wageTypeDetails}
                selectedValue={wageTypeId}
                onValueChange={setWageTypeId}
                onSearch={fetchWageTypes}
                error={error.wageType}
                required
              />
              <ComboboxField
                id="workType"
                label={t('Work Type')}
                items={workTypeDetails}
                selectedValue={workType.id.toString()}
                onValueChange={(val) => {
                  const found = workTypeDetails.find((i) => i.value === val);
                  if (found?.allItems)
                    handleWorkTypeChange(found.allItems as any);
                }}
                onSearch={fetchWorkTypes}
                error={error.workType}
                required
              />
            </div>

            {/* Row 3: Worker + Work Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ComboboxField
                id="worker"
                label={t('Worker')}
                items={workerDetails}
                selectedValue={workerId}
                onValueChange={setWorkerId}
                onSearch={fetchWorkers}
                error={error.worker}
                required
                disabled={!workType.workerCategory.id}
              />
              <ComboboxField
                id="workMode"
                label={t('Work Mode')}
                items={workModeDetails}
                selectedValue={workModeId}
                onValueChange={setWorkModeId}
                onSearch={fetchWorkModes}
                error={error.workMode}
                required
              />
            </div>

            {/* Worked Quantity */}
            <NameField
              label={t('Worked Quantity')}
              inputValue={workedQuantity}
              setInputValue={setWorkedQuantity}
              placeholder={t('Enter Worked Quantity')}
              errorMessage={error.workedQuantity}
              required
              regex="^[0-9.]*$"
            />

            {/* Worked vs Estimated Plan indicator */}
            {workQuantityIndicator && (
              <p
                className="text-sm font-semibold -mt-2"
                style={{ color: workQuantityIndicator.color }}
              >
                {workQuantityIndicator.text}
              </p>
            )}

            {/* Attendance Split — Add Button */}
            <FormActionButton
              heading={t('Attendance Split')}
              label={t('Add')}
              onClick={() => setIsSplitDialogOpen(true)}
              isColsTwo
              errorMessage={error.attendanceSplit}
            />

            {/* Attendance Split List */}
            <AttendanceSplitList
              attendanceSplit={attendanceSplit}
              setAttendanceSplit={setAttendanceSplit}
              confirmDelete={confirmDelete}
              workerCategoryId={workType.workerCategory.id}
            />

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={img.uri}
                      alt={img.name}
                      className="w-full h-full object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => deleteImage(index)}
                      className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Images Button */}
            <div className="flex">
              <UploadButton
                text={t('Upload Images')}
                onFilesSelected={handleImageUpload}
              />
            </div>

            {/* Notes */}
            <TextareaField
              label={t('Notes')}
              placeholder={t('Enter your Notes')}
              inputValue={notes}
              setInputValue={setNotes}
            />

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" className="w-24">
                {t('Save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Attendance Split Dialog */}
      <Dialog open={isSplitDialogOpen} onOpenChange={setIsSplitDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('Attendance Split')}</DialogTitle>
          </DialogHeader>
          <AttendanceSplitCreationPage
            workerCategoryId={workType?.workerCategory?.id}
            attendanceSplit={attendanceSplit}
            setAttendanceSplit={setAttendanceSplit}
            onClose={() => setIsSplitDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Split Confirm Dialog */}
      <AlertDialog open={deleteConfirmIndex !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Confirm Delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Are you sure you want to remove this attendance split? This action cannot be undone.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {t('Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Work Type Change Confirm Dialog */}
      <AlertDialog open={isWorkTypeChangeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Change Work Type')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Selected work type belongs to a different worker category. This will reset the selected worker and attendance split. Do you want to continue?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelWorkTypeChange}>
              {t('Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmWorkTypeChange}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {t('Continue')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { AttendanceCreationPage };