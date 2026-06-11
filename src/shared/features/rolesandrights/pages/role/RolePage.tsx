import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Header, Actions } from '@/shared/components/Header/Header';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { NameField } from '@/shared/components/FormFields/NameField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
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
import RoleCard from '../../components/RoleCard/RoleCard';
import { useRolesScreen } from './useRole';
import type { Roles } from '../../DTOs/DTOs';

// ── Empty State ──
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <Shield className="w-12 h-12" style={{ color: '#9CA3AF' }} />
    <p className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
      No Roles Yet
    </p>
    <p className="text-sm text-center" style={{ color: '#9CA3AF' }}>
      Create your first role to get started
    </p>
  </div>
);

const RolesPage = () => {
  const navigate = useNavigate();

  const {
    roles,
    isLoading,
    name,
    note,
    editId,
    isSheetOpen,
    setIsSheetOpen,
    deleteId,
    setDeleteId,
    handleSaveRole,
    handleEditRole,
    handleDeleteRole,
    confirmDelete,
    resetForm,
    setName,
    setNote,
    isSuperAdmin,
  } = useRolesScreen();

  const handlePageRoleOpen = (role: Roles) => {
    navigate(`/roles-rights/${role.id}`, { state: { role } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-10">

      {/* ── Header ── */}
      <Header title="Roles & Rights">
        {isSuperAdmin && (
          <Actions>
            <Button
              onClick={() => {
                resetForm();
                setIsSheetOpen(true);
              }}
            >
              Create New Role
            </Button>
          </Actions>
        )}
      </Header>

      <Card className="mt-4 p-6">

        {/* ── Section Header ── */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-base font-bold"
            style={{ color: 'var(--foreground)' }}
          >
            Existing Roles
          </span>
          <div
            className="min-w-[40px] h-8 px-2 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--secondary)' }}
            >
              {roles.length}
            </span>
          </div>
        </div>

        {/* ── Role List ── */}
        {roles.length > 0 ? (
          <div className="flex flex-col gap-2">
            {roles.map(role => (
              <RoleCard
                key={role.id}
                role={role}
                onEdit={handleEditRole}
                onDelete={confirmDelete}
                handlePress={handlePageRoleOpen}
                isSuperAdmin={isSuperAdmin}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </Card>

      {/* ── Create / Edit Dialog ── */}
      <Dialog
        open={isSheetOpen}
        onOpenChange={(val) => {
          if (!val) resetForm();
          setIsSheetOpen(val);
        }}
      >
        <DialogContent className="sm:max-w-md bg-white dark:bg-[var(--card)]">
          <DialogHeader>
            <DialogTitle>
              {editId ? 'Edit Role' : 'Create New Role'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <NameField
              label="Name"
              inputValue={name}
              setInputValue={setName}
              placeholder="Enter Role Name"
              required
              length={50}
            />
            <TextareaField
              label="Note"
              inputValue={note}
              setInputValue={setNote}
              placeholder="Enter Note (optional)"
            />
            <Button onClick={handleSaveRole} className="w-full">
              {editId ? 'Update Role' : 'Create Role'}
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
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this role?
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
                  if (deleteId) handleDeleteRole(deleteId);
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

export default RolesPage;