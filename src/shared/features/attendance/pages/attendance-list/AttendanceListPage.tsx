import { Header, Actions } from '@/shared/components/Header/Header';
import { Button } from '@/shared/components/ui/button';
import { useAttendanceList } from './useAttendanceList';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import { AttendanceUrls } from '../../utils/urls';
import { GetStartedCard } from '@/shared/components/GetStartedCard/GetStartedCard';
import workerIllustration from "@/assets/images/worker-creation-illustration.png";
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { usePermission } from '@/shared/hooks/usePermission';
import { useState } from 'react';
import { AttendanceCard } from '@/shared/components/AttendanceCard/AttendanceCard';
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

const AttendanceListPage = () => {
  const navigate = useNavigate();
  const { canEdit } = usePermission();
  const editable = canEdit('Attendance');
  const [filterOpen, setFilterOpen] = useState(false);

  const {
    attendance,
    loading,
    paginationLoading,
    hasMore,
    appliedFilters,
    date,
    setDate,
    siteId,
    setSiteId,
    wageTypeId,
    setWageTypeId,
    workTypeId,
    workerId,
    setWorkerId,
    fetchSites,
    fetchWageTypes,
    fetchWorkTypes,
    fetchWorkers,
    siteDetails,
    workTypeDetails,
    wageTypeDetails,
    workerDetails,
    handleWorkTypeChange,
    fetchAttendance,
    handlePress,
    handleSearch,
    handleClearSearch,
    confirmDelete,
    handleDelete,
    cancelDelete,
    deleteConfirmId,
    handleEditAttendance,
    isWorkTypeChangeDialogOpen,
    confirmWorkTypeChange,
    cancelWorkTypeChange,
  } = useAttendanceList();

  const isFiltered = !!(
    date ||
    siteId.value ||
    wageTypeId.value ||
    workTypeId.value ||
    workerId.value
  );

  // Loading state
    if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  // Empty state
  if (!attendance.length && !appliedFilters) {
    return (
      <div className="min-h-screen w-full px-4 py-6 pb-10">
        
        <GetStartedCard
          imgSrc={workerIllustration}
          buttonLabel="Create Attendance"
          buttonClick={AttendanceUrls.create}
        >
          Simplify attendance tracking for your construction team. Start by
          adding a new record.
        </GetStartedCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-10">

      {/* Header */}
      <Header title="Attendance List">
        {editable && (
          <Actions>
            <Button onClick={handlePress}>New Attendance</Button>
          </Actions>
        )}
      </Header>

      {/* Search Filter Bar */}
      <div className="flex justify-end items-center gap-2 mt-4">
        {appliedFilters ? (
          <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 text-sm text-foreground bg-background flex-1 md:flex-none md:w-auto">
            <span className="truncate">{appliedFilters}</span>
            <button
              onClick={handleClearSearch}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 border border-border rounded-md px-3 py-2 text-sm text-muted-foreground bg-background hover:border-ring transition-colors flex-1 md:flex-none md:min-w-48"
          >
            <SlidersHorizontal className="h-4 w-4 shrink-0" />
            <span>Search Attendance...</span>
          </button>
        )}

        {appliedFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* ✅ Attendance List — AttendanceCard */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {attendance.length === 0 ? (
          <p className="text-center text-sm text-gray-500 mt-10">
            No Attendance found
          </p>
        ) : (
          attendance.map(item => (
            <AttendanceCard
              key={item.id}
              siteName={item.site?.name ?? ""}
              workTypeName={item.workType?.name ?? ""}
              wageTypeName={item.wageType?.name ?? ""}
              date={item.date ?? ""}
              worker={item.worker?.name ?? ""}
              onDelete={() => confirmDelete(item.id)}
              onPress={() => handleEditAttendance(item.id)}
              permissionKey="Attendance"
            />
          ))
        )}
      </div>

      {/* View More Button */}
      {hasMore && attendance.length > 0 && (
        <div className="flex justify-end mt-4">
          {paginationLoading ? (
            <Loader2 className="animate-spin text-[var(--secondary)]" size={24} />
          ) : (
            <Button
              variant="outline"
              className="text-[var(--secondary)]"
              onClick={() => fetchAttendance()}
            >
              View More
            </Button>
          )}
        </div>
      )}

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Attendance Search</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <DatePicker
              date={date}
              onDateChange={setDate}
              label="Date"
            />
            <ComboboxField
              id="site"
              label="Site"
              items={siteDetails}
              selectedValue={siteId.value}
              onValueChange={(val) => {
                const found = siteDetails.find(i => i.value === val);
                if (found?.allItems) setSiteId(found.allItems as any);
              }}
              onSearch={fetchSites}
            />
            <ComboboxField
              id="wageType"
              label="Wage Type"
              items={wageTypeDetails}
              selectedValue={wageTypeId.value}
              onValueChange={(val) => {
                const found = wageTypeDetails.find(i => i.value === val);
                if (found?.allItems) setWageTypeId(found.allItems as any);
              }}
              onSearch={fetchWageTypes}
            />
            <ComboboxField
              id="workType"
              label="Work Type"
              items={workTypeDetails}
              selectedValue={workTypeId.value}
              onValueChange={(val) => {
                const found = workTypeDetails.find(i => i.value === val);
                if (found?.allItems) handleWorkTypeChange(found.allItems as any);
              }}
              onSearch={fetchWorkTypes}
            />
            <ComboboxField
              id="worker"
              label="Worker"
              items={workerDetails}
              selectedValue={workerId.value}
              onValueChange={(val) => {
                const found = workerDetails.find(i => i.value === val);
                if (found?.allItems) setWorkerId(found.allItems as any);
              }}
              onSearch={fetchWorkers}
              disabled={!workTypeId.workerCategoryId}
            />
            <Button
              onClick={() => {
                handleSearch();
                setFilterOpen(false);
              }}
              disabled={!isFiltered}
              className="w-full"
            >
              Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteConfirmId !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this attendance? This action
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
              will reset the selected worker. Do you want to continue?
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

export { AttendanceListPage };