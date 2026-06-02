import { useRef } from "react";
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
import { PlusCircle, Upload, X } from "lucide-react";

const AttendanceCreationPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    siteDetails,
    workTypeDetails,
    unitDetails,
    workerDetails,
    wageTypeDetails,
    workModeDetails,
    error,
    siteId,
    workType,
    unitId,
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
    setUnitId,
    setWorkerId,
    setWageTypeId,
    setWorkModeId,
    setNotes,
    setUploadedImages,
    fetchSites,
    fetchWorkTypes,
    fetchUnits,
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
  } = useAttendanceCreation();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-10">
      <Header title="Create Attendance" />

      <Card className="mt-4">
        <CardContent className="pt-4">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            {/* Date */}
            <DatePicker
              date={date}
              onDateChange={setDate}
              errorMessage={error.date}
              label="Date"
              required
              defaultDate
            />

            {/* Site */}
            <ComboboxField
              id="site"
              label="Site"
              items={siteDetails}
              selectedValue={siteId}
              onValueChange={setSiteId}
              onSearch={fetchSites}
              error={error.site}
              required
            />

            {/* Wage Type */}
            <ComboboxField
              id="wageType"
              label="Wage Type"
              items={wageTypeDetails}
              selectedValue={wageTypeId}
              onValueChange={setWageTypeId}
              onSearch={fetchWageTypes}
              error={error.wageType}
              required
            />

            {/* Work Type */}
            <ComboboxField
              id="workType"
              label="Work Type"
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

            {/* Worker */}
            <ComboboxField
              id="worker"
              label="Worker"
              items={workerDetails}
              selectedValue={workerId}
              onValueChange={setWorkerId}
              onSearch={fetchWorkers}
              error={error.worker}
              required
              disabled={!workType.workerCategory.id}
            />

            {/* Worked Quantity */}
            <NameField
              label="Worked Quantity"
              inputValue={workedQuantity}
              setInputValue={setWorkedQuantity}
              placeholder="Enter Worked Quantity"
              errorMessage={error.workedQuantity}
              required
              regex="^[0-9.]*$"
            />
            {/* Unit */}
            <ComboboxField
              id="unit"
              label="Unit"
              items={unitDetails}
              selectedValue={unitId}
              onValueChange={setUnitId}
              onSearch={fetchUnits}
              error={error.unit}
              required
            />

            {/* Work Mode */}
            <ComboboxField
              id="workMode"
              label="Work Mode"
              items={workModeDetails}
              selectedValue={workModeId}
              onValueChange={setWorkModeId}
              onSearch={fetchWorkModes}
              error={error.workMode}
              required
            />

            {/* Attendance Split — Add Button */}
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setIsSplitDialogOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-[var(--secondary)] hover:opacity-80 w-fit"
              >
                <PlusCircle size={18} />
                Attendance Split
              </button>
              {error.attendanceSplit && (
                <p className="text-xs text-destructive">
                  {error.attendanceSplit}
                </p>
              )}
            </div>

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
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-sm font-medium text-[var(--secondary)] hover:opacity-80 w-fit"
            >
              <Upload size={18} />
              Upload Images
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Notes */}
            <TextareaField
              label="Notes"
              placeholder="Enter your Notes"
              inputValue={notes}
              setInputValue={setNotes}
            />

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" className="w-24">
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Attendance Split Dialog */}
      <Dialog open={isSplitDialogOpen} onOpenChange={setIsSplitDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Attendance Split</DialogTitle>
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
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this attendance split? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Work Type Change Confirm Dialog */}
      <AlertDialog open={isWorkTypeChangeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Work Type</AlertDialogTitle>
            <AlertDialogDescription>
              Selected work type belongs to a different worker category. This
              will reset the selected worker and attendance split. Do you want
              to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelWorkTypeChange}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmWorkTypeChange}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { AttendanceCreationPage };
