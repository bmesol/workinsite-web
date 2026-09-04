import { useState } from 'react';
import { Header } from '@/shared/components/Header/Header';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useAttendanceEditScreen } from './useAttendanceEdit';
import { AttendanceSplitCreationPage } from '../attendance-split-creation/AttendanceSplitCreationPage';
import AttendanceSplitList from '../attendance-split-list/AttendanceSplitList';
import { NameField } from '@/shared/components/FormFields/NameField';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { usePermission } from '@/shared/hooks/usePermission';
import { X } from 'lucide-react';
import { FormActionButton } from '@/shared/components/FormActionButton/FormActionButton';
import { UploadButton } from '@/shared/components/UploadButton/UploadButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const AttendanceEditPage = () => {
  const { canEdit } = usePermission();
  const editable = canEdit('Attendance');
  const [splitOpen, setSplitOpen] = useState(false);
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
    loading,
    viewImages,
    setViewImages,
    removeImages,
    setRemoveImages,
    setAttendanceSplit,
    setDate,
    setWorkedQuantity,
    setSiteId,
    setWorkType,
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
    handleBackPress,
    handleSubmit,
    confirmDelete,
    handleDelete,
    cancelDelete,
    deleteIndex,
    handleImageUpload,
    workQuantityIndicator,
  } = useAttendanceEditScreen();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

   if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      <Header title={t('Edit Attendance')} />

      <Card className="mt-4">
        <CardContent className="pt-4">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">

            {/* Row 1: Date + Site — always locked on edit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker
                date={date}
                onDateChange={setDate}
                errorMessage={error.date}
                label={t('Date')}
                required
                disable={true}
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
                disabled={true}
              />
            </div>

            {/* Row 2: Wage Type + Work Type — always locked on edit */}
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
                disabled={true}
              />
              <ComboboxField
                id="workType"
                label={t('Work Type')}
                items={workTypeDetails}
                selectedValue={workType.id.toString()}
                onValueChange={(val) => {
                  const found = workTypeDetails.find(i => i.value === val);
                  if (found?.allItems) setWorkType(found.allItems as any);
                }}
                onSearch={fetchWorkTypes}
                error={error.workType}
                required
                disabled={true}
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
                disabled={true}
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
                disabled={!editable}
              />
            </div>

            {/* Worked Quantity — permission-based */}
            <NameField
              label={t('Worked Quantity')}
              inputValue={workedQuantity}
              setInputValue={setWorkedQuantity}
              placeholder={t('Enter Worked Quantity')}
              errorMessage={error.workedQuantity}
              required
              isDisabled={!editable}
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

            {/* Attendance Split */}
            {editable && (
              <FormActionButton
                heading={t('Attendance Split')}
                label={t('Add')}
                onClick={() => setSplitOpen(true)}
                isColsTwo
                errorMessage={error.attendanceSplit}
              />
            )}

            <AttendanceSplitList
              attendanceSplit={attendanceSplit}
              setAttendanceSplit={setAttendanceSplit}
              confirmDelete={confirmDelete}
              workerCategoryId={workType.workerCategory.id}
            />

            {/* View Images */}
            {viewImages && viewImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {viewImages.map((img, index) => (
                  <div key={img.id} className="relative w-20 h-20">
                    <img
                      src={`${img.staticBaseUrl}/${img.imagePath}`}
                      alt={img.imagePath}
                      className="w-full h-full object-cover rounded-md border"
                    />
                    {editable && (
                      <button
                        type="button"
                        onClick={() => {
                          setRemoveImages(prev => [...prev, img]);
                          setViewImages(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Uploaded Images */}
            {uploadedImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={img.uri}
                      alt={img.name}
                      className="w-full h-full object-cover rounded-md border"
                    />
                    {editable && (
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(img.uri);
                          setUploadedImages(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {editable && (
              <div className="flex">
                <UploadButton
                  text={t('Upload Images')}
                  onFilesSelected={handleImageUpload}
                />
              </div>
            )}

            <TextareaField
              label={t('Notes')}
              placeholder={t('Enter your Notes')}
              inputValue={notes}
              setInputValue={setNotes}
              isDisabled={!editable}
            />

            {/* ✅ Cancel + Save buttons */}
            {editable && (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-24"
                  onClick={handleBackPress}  // ✅ Cancel — unsaved changes check பண்ணி navigate
                >
                  {t('Cancel')}
                </Button>
                <Button type="submit" className="w-24">
                  {t('Save')}
                </Button>
              </div>
            )}

          </form>
        </CardContent>
      </Card>

      {/* Attendance Split Dialog */}
      <Dialog open={splitOpen} onOpenChange={setSplitOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('Attendance Split')}</DialogTitle>
          </DialogHeader>
          <AttendanceSplitCreationPage
            workerCategoryId={workType?.workerCategory?.id}
            attendanceSplit={attendanceSplit}
            setAttendanceSplit={setAttendanceSplit}
            onClose={() => setSplitOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteIndex !== null}>
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
              onClick={() => handleDelete(deleteIndex!)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {t('Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export { AttendanceEditPage };