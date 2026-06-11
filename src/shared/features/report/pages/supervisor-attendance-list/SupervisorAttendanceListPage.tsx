import { Header, Actions } from '@/shared/components/Header/Header';
import { Button } from '@/shared/components/ui/button';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { SearchFilterBar } from '@/shared/components/SearchFilterBar/SerchFilterBar';
import SupervisorAttendanceCard from '@/shared/components/SupervisorAttendanceCard/SupervisorAttendanceCard';
import { DateFilter } from '../../components/DateFilter/DateFilter';
import { useSupervisorAttendanceList } from './useSuperVisorAttendanceList';
import type { SupervisorAttendance } from '../../DTOs/SupervisorAttendanceProps';
import { Loader2 } from 'lucide-react';
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
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

const SupervisorAttendanceListPage = () => {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const {
    attendances,
    loading,
    paginationLoading,
    hasMore,
    appliedFilters,
    filterOpen,
    setFilterOpen,
    supervisor,
    setSupervisor,
    dateRange,
    setDateRange,
    selectedOption,
    setSelectedOption,
    error,
    supervisorDetails,
    fetchSupervisors,
    fetchAttendances,
    handleSearch,
    handleClearSearch,
    handleDelete,
    isFiltered,
  } = useSupervisorAttendanceList();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-10">

      {/* ── Header ── */}
       <Header title="Supervisor Attendance">
        <Actions>
          <SearchFilterBar
            appliedFilters={appliedFilters}
            placeholder="Search Supervisor Attendance..."
            onFilterOpen={() => setFilterOpen(true)}
            onClearSearch={handleClearSearch}
          />
        </Actions>
      </Header>

      {/* ── List ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {attendances.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground mt-10">
            No Data Found
          </p>
        ) : (
          attendances.map((item: SupervisorAttendance) => (
            <div key={item.id} className="relative">
              <SupervisorAttendanceCard
                supervisorName={item.supervisor[0]?.name ?? ''}
                supervisorRole={item.supervisor[0]?.role?.name ?? ''}
                date={item.date}
                address={item.currentLocation?.address ?? ''}
              />
              {/* ── Delete Button ── */}
              <button
                onClick={() => setDeleteId(item.id)}
                className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-red-50 transition-colors"
              >
                <Trash2
                  className="w-4 h-4"
                  style={{ color: 'var(--danger-color)' }}
                />
              </button>
            </div>
          ))
        )}
      </div>

      {/* ── View More ── */}
      {hasMore && (
        <div className="flex justify-end mt-4">
          {paginationLoading ? (
            <Loader2
              className="animate-spin"
              size={24}
              style={{ color: 'var(--secondary)' }}
            />
          ) : (
            <Button variant="outline" onClick={() => fetchAttendances()}>
              View More
            </Button>
          )}
        </div>
      )}

      {/* ── Filter Dialog ── */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[var(--card)]">
          <DialogHeader>
            <DialogTitle>Filter Supervisor Attendance</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <ComboboxField
              id="supervisor"
              label="Supervisor"
              items={supervisorDetails}
              selectedValue={supervisor.value}
              onValueChange={(val) => {
                const found = supervisorDetails.find(i => i.value === val);
                if (found?.allItems) setSupervisor(found.allItems as any);
              }}
              onSearch={fetchSupervisors}
            />
            <DateFilter
              selectedOption={selectedOption}
              dateRange={dateRange}
              setDateRange={setDateRange}
              onOptionChange={(opt) => setSelectedOption(opt)}
              errors={{
                fromDate: error.fromDate,
                toDate: error.toDate,
              }}
            />
            <Button
              onClick={handleSearch}
              disabled={!isFiltered}
              className="w-full"
            >
              Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this supervisor attendance record?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteId) handleDelete(deleteId);
                  setDeleteId(null);
                }}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default SupervisorAttendanceListPage;