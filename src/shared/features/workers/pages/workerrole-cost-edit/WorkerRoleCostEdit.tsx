import { useParams, useSearchParams } from 'react-router-dom';
import { HardHat, Wallet, Clock, UserX, Pencil, ArrowLeft } from 'lucide-react';
import { Header } from '@/shared/components/Header/Header';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useWorkerRoleCostEdit } from './useWorkerRoleCostEdit';
import type { WorkerRoles } from '../../DTOs/WorkRoleProps';
import { usePermission } from '@/shared/hooks/usePermission';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const WorkerRoleCostEditPage = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const workerCategoryId = searchParams.get('workerCategoryId') ?? '';
  const redirect = searchParams.get('redirect') ?? '';

  const { canEdit } = usePermission();
  const editable = canEdit('Worker');

  const {
    costs,
    setEditingCost,
    error,
    editingCost,
    handleEdit,
    handleSave,
    loading,
    handleBack,
    isDialogOpen,
    setDialogOpen,
  } = useWorkerRoleCostEdit(workerCategoryId, redirect, id as string);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">{t('Loading...')}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header
        title={t('Edit Worker Role Costs')}
       
      />

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {costs.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <UserX size={48} className="text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-500">
              {t('No worker roles found')}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {t('Worker role costs will appear here once added')}
            </p>
          </div>
        ) : (
          costs.map((item: WorkerRoles) => (
            <Card key={item.id}>
              <CardContent className="py-0 px-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/15">
                    <HardHat size={16} className="text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">{t('Worker Role')}</p>
                    <p className="truncate text-sm font-semibold text-secondary">
                      {item.name}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className={`rounded-full border-secondary/30 ${!editable ? 'opacity-60' : ''}`}
                    disabled={!editable}
                    onClick={() => { handleEdit(item); setDialogOpen(true); }}
                  >
                    <Pencil size={14} className="text-secondary" />
                  </Button>
                </div>

                <div className="mt-3.5 flex items-center">
                  <div className="flex flex-1 items-center gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50">
                      <Wallet size={13} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t('Salary per shift')}</p>
                      <p className="text-sm font-semibold text-green-600">
                        ₹{parseFloat(item.salaryPerShift.toString()).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="mx-2 h-6 w-px bg-gray-200" />

                  <div className="flex flex-1 items-center gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50">
                      <Clock size={13} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t('Hours per shift')}</p>
                      <p className="text-sm font-semibold text-secondary">
                        {item.hoursPerShift}h
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ✅ CustomBottomSheet → shadcn Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Edit Worker Role Cost')}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>{t('Name')}</Label>
              <Input
                value={editingCost.name}
                onChange={e =>
                  setEditingCost(prev => ({ ...prev, name: e.target.value }))
                }
                disabled
              />
              {error.name && (
                <p className="text-sm text-red-500">{error.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>
                {t('Salary Per Shift')} <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder={t('Salary Per Shift')}
                value={editingCost.salaryPerShift}
                onChange={e =>
                  setEditingCost(prev => ({
                    ...prev,
                    salaryPerShift: e.target.value,
                  }))
                }
              />
              {error.salaryPerShift && (
                <p className="text-sm text-red-500">{error.salaryPerShift}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>
                {t('Hours Per Shift')} <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder={t('Hours Per Shift')}
                value={editingCost.hoursPerShift}
                onChange={e =>
                  setEditingCost(prev => ({
                    ...prev,
                    hoursPerShift: e.target.value,
                  }))
                }
              />
              {error.hoursPerShift && (
                <p className="text-sm text-red-500">{error.hoursPerShift}</p>
              )}
            </div>

            <Button onClick={handleSave}>{t('Save')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { WorkerRoleCostEditPage };