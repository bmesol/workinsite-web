// import { useRef } from 'react';
// import { Header } from '@/shared/components/Header/Header';
// import { Button } from '@/shared/components/ui/button';
// import { Card, CardContent } from '@/shared/components/ui/card';
// import { useAttendanceCreation } from './useAttendanceCreation';
// import { AttendanceSplitCreationPage } from '';
// import { AttendanceSplitList } from '../AttendanceSplitList/AttendanceSplitList';
// import { NameField } from '@/shared/components/FormFields/NameField';
// import { ComboField } from '@/shared/components/FormFields/ComboField';
// import { DateField } from '@/shared/components/FormFields/DateField';
// import { TextareaField } from '@/shared/components/FormFields/TextareaField';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/shared/components/ui/dialog';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/shared/components/ui/alert-dialog';
// import { PlusCircle, Upload, X } from 'lucide-react';

// const AttendanceCreationPage = () => {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const {
//     siteDetails,
//     workTypeDetails,
//     unitDetails,
//     workerDetails,
//     wageTypeDetails,
//     workModeDetails,
//     error,
//     siteId,
//     workType,
//     unitId,
//     workerId,
//     wageTypeId,
//     workModeId,
//     notes,
//     workedQuantity,
//     date,
//     attendanceSplit,
//     uploadedImages,
//     setAttendanceSplit,
//     setDate,
//     setWorkedQuantity,
//     setSiteId,
//     setUnitId,
//     setWorkerId,
//     setWageTypeId,
//     setWorkModeId,
//     setNotes,
//     setUploadedImages,
//     fetchSites,
//     fetchWorkTypes,
//     fetchUnits,
//     fetchWorkers,
//     fetchWageTypes,
//     fetchWorkModes,
//     handleSubmit,
//     handleImageUpload,
//     deleteImage,
//     isSplitDialogOpen,
//     setIsSplitDialogOpen,
//     deleteConfirmIndex,
//     confirmDelete,
//     handleDelete,
//     cancelDelete,
//     isWorkTypeChangeDialogOpen,
//     confirmWorkTypeChange,
//     cancelWorkTypeChange,
//     handleWorkTypeChange,
//   } = useAttendanceCreation();

//   const handleFormSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     handleSubmit();
//   };

//   return (
//     <div className="min-h-screen w-full px-4 py-6 pb-10">
//       <Header title="Create Attendance" />

//       <Card className="mt-4">
//         <CardContent className="pt-4">
//           <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">

//             {/* Date */}
//             <DateField
//               label="Date"
//               value={date}
//               onChange={setDate}
//               errorMessage={error.date}
//               required
//             />

//             {/* Site */}
//             <ComboField
//               label="Site"
//               items={siteDetails}
//               selectedValue={siteId}
//               onValueChange={setSiteId}
//               onSearch={fetchSites}
//               errorMessage={error.site}
//               required
//             />

//             {/* Wage Type */}
//             <ComboField
//               label="Wage Type"
//               items={wageTypeDetails}
//               selectedValue={wageTypeId}
//               onValueChange={setWageTypeId}
//               onSearch={fetchWageTypes}
//               errorMessage={error.wageType}
//               required
//             />

//             {/* Work Type */}
//             <ComboField
//               label="Work Type"
//               items={workTypeDetails}
//               selectedValue={workType.id.toString()}
//               onValueChange={(value, fullItem) =>
//                 handleWorkTypeChange(fullItem?.allItems)
//               }
//               onSearch={fetchWorkTypes}
//               errorMessage={error.workType}
//               required
//             />

//             {/* Worker */}
//             <ComboField
//               label="Worker"
//               items={workerDetails}
//               selectedValue={workerId}
//               onValueChange={setWorkerId}
//               onSearch={fetchWorkers}
//               errorMessage={error.worker}
//               required
//               isDisabled={!workType.workerCategory.id}
//             />

//             {/* Worked Quantity */}
//             <NameField
//               label="Worked Quantity"
//               inputValue={workedQuantity}
//               setInputValue={setWorkedQuantity}
//               placeholder="Enter Worked Quantity"
//               errorMessage={error.workedQuantity}
//               required
//             />

//             {/* Unit */}
//             <ComboField
//               label="Unit"
//               items={unitDetails}
//               selectedValue={unitId}
//               onValueChange={setUnitId}
//               onSearch={fetchUnits}
//               errorMessage={error.unit}
//               required
//             />

//             {/* Work Mode */}
//             <ComboField
//               label="Work Mode"
//               items={workModeDetails}
//               selectedValue={workModeId}
//               onValueChange={setWorkModeId}
//               onSearch={fetchWorkModes}
//               errorMessage={error.workMode}
//               required
//             />

//             {/* Attendance Split — Add Button */}
//             <div className="flex flex-col gap-1">
//               <button
//                 type="button"
//                 onClick={() => setIsSplitDialogOpen(true)}
//                 className="flex items-center gap-2 text-sm font-medium text-[var(--secondary)] hover:opacity-80 w-fit"
//               >
//                 <PlusCircle size={18} />
//                 Attendance Split
//               </button>
//               {error.attendanceSplit && (
//                 <p className="text-xs text-destructive">{error.attendanceSplit}</p>
//               )}
//             </div>

//             {/* Attendance Split List */}
//             <AttendanceSplitList
//               attendanceSplit={attendanceSplit}
//               setAttendanceSplit={setAttendanceSplit}
//               confirmDelete={confirmDelete}
//               workerCategoryId={workType.workerCategory.id}
//             />

//             {/* Uploaded Images Preview */}
//             {uploadedImages.length > 0 && (
//               <div className="flex flex-wrap gap-2">
//                 {uploadedImages.map((img, index) => (
//                   <div key={index} className="relative w-20 h-20">
//                     <img
//                       src={img.uri}
//                       alt={img.name}
//                       className="w-full h-full object-cover rounded-md border"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => deleteImage(index)}
//                       className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5"
//                     >
//                       <X size={12} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Upload Images Button */}
//             <button
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               className="flex items-center gap-2 text-sm font-medium text-[var(--secondary)] hover:opacity-80 w-fit"
//             >
//               <Upload size={18} />
//               Upload Images
//             </button>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               multiple
//               className="hidden"
//               onChange={handleImageUpload}
//             />

//             {/* Notes */}
//             <TextareaField
//               label="Notes"
//               placeholder="Enter your Notes"
//               value={notes}
//               onChange={setNotes}
//             />

//             {/* Save Button */}
//             <div className="flex justify-end">
//               <Button type="submit" className="w-24">
//                 Save
//               </Button>
//             </div>

//           </form>
//         </CardContent>
//       </Card>

//       {/* Attendance Split Dialog */}
//       <Dialog open={isSplitDialogOpen} onOpenChange={setIsSplitDialogOpen}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Attendance Split</DialogTitle>
//           </DialogHeader>
//           <AttendanceSplitCreationPage
//             workerCategoryId={workType?.workerCategory?.id}
//             attendanceSplit={attendanceSplit}
//             setAttendanceSplit={setAttendanceSplit}
//             onClose={() => setIsSplitDialogOpen(false)}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* Delete Split Confirm Dialog */}
//       <AlertDialog open={deleteConfirmIndex !== null}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to remove this attendance split? This action
//               cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               className="bg-destructive text-white hover:bg-destructive/90"
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Work Type Change Confirm Dialog */}
//       <AlertDialog open={isWorkTypeChangeDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Change Work Type</AlertDialogTitle>
//             <AlertDialogDescription>
//               Selected work type belongs to a different worker category. This
//               will reset the selected worker and attendance split. Do you want
//               to continue?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={cancelWorkTypeChange}>
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={confirmWorkTypeChange}
//               className="bg-destructive text-white hover:bg-destructive/90"
//             >
//               Continue
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export { AttendanceCreationPage };