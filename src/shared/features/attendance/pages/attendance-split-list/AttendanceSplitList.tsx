import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { usePermission } from '@/shared/hooks/usePermission';
import { cn } from '@/shared/components/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import AttendanceSplitEditForm from '../attendance-split-edit/AttendanceSplitEditForm';
import type { Shift } from '@/shared/features/workers/DTOs/ShiftProps';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

export type WorkerCategory = {
  id: number;
  name: string;
  note: string;
};

export type WorkerRole = {
  id: number;
  name: string;
  salaryPerShift: string;
  hoursPerShift: string;
  workerCategory: WorkerCategory;
};

interface AttendanceSplit {
  workerRole: WorkerRole;
  shift: Shift;
  noOfPersons: string;
}

interface AttendanceSplitListProps {
  attendanceSplit: AttendanceSplit[];
  setAttendanceSplit: (attendanceSplit: AttendanceSplit[]) => void;
  confirmDelete: (index: number) => void;
  workerCategoryId: number;
}

const AttendanceSplitList = ({
  attendanceSplit,
  setAttendanceSplit,
  confirmDelete,
  workerCategoryId,
}: AttendanceSplitListProps) => {
  const { canEdit } = usePermission();
  const editable = canEdit('Attendance');
  const { t } = useLanguage();

  const [selectedAttendance, setSelectedAttendance] =
    useState<AttendanceSplit | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const openEditDialog = (attendance: AttendanceSplit) => {
    setSelectedAttendance(attendance);
    setIsEditDialogOpen(true);
  };

  if (!attendanceSplit?.length) return null;

 return (
  <div className="rounded-xl bg-[var(--card)] shadow-md overflow-hidden">

    {/* Table Header */}
  <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-[var(--table-header-bg)] border-b border-[var(--border)] px-4 py-3">
      {[t('Role'), t('No.'), t('Shift'), t('Action')].map((col, idx) => (
        <p
          key={idx}
          className="text-xs font-semibold text-[var(--gray-color)] uppercase tracking-wide"
        >
          {col}
        </p>
      ))}
    </div>

    {/* Table Rows */}
    {attendanceSplit.map((item, i) => (
      <div
        key={i}
        className={cn(
          'grid grid-cols-[2fr_1fr_1fr_1fr] px-4 py-3 items-center border-b border-[var(--border)]',
          i % 2 === 1 ? 'bg-[var(--background)]' : 'bg-[var(--card)]',
        )}
      >
        {/* Worker Role */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[var(--foreground)] mb-1">
            {item.workerRole.name}
          </span>
          <span className="text-xs text-[var(--gray-color)]">
            {item.workerRole.workerCategory.name}
          </span>
        </div>

        {/* No Of Persons */}
        <span className="text-sm text-[var(--foreground)]">{item.noOfPersons}</span>

        {/* Shift */}
        <span className="text-sm text-[var(--foreground)]">{item.shift.name}</span>

        {/* Actions */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            disabled={!editable}
            onClick={() => openEditDialog(item)}
            className={cn(
              'h-8 w-8',
              !editable
                ? 'text-[var(--disabled-text)] cursor-not-allowed pointer-events-none'
                : 'text-[var(--secondary)] hover:opacity-80',
            )}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!editable}
            onClick={() => confirmDelete(i)}
            className={cn(
              'h-8 w-8',
              !editable
                ? 'text-[var(--disabled-text)] cursor-not-allowed pointer-events-none'
                : 'text-destructive hover:opacity-80',
            )}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    ))}

    {/* Edit Dialog */}
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('Edit Attendance Split')}</DialogTitle>
        </DialogHeader>
        {selectedAttendance && (
          <AttendanceSplitEditForm
            attendanceSplit={attendanceSplit}
            setAttendanceSplit={setAttendanceSplit}
            selectedAttendance={selectedAttendance}
            closeModal={() => setIsEditDialogOpen(false)}
            workerCategoryId={workerCategoryId}
          />
        )}
      </DialogContent>
    </Dialog>

  </div>
);
};

export default AttendanceSplitList;
