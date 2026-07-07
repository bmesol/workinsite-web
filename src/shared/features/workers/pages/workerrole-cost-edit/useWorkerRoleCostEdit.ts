import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useWorkerRoleInputValidate } from '../../components/InputValidate/WorkerRoleValidate';
import { useWorkerRoleCostService } from '../../service/WorkerRoleService';
import type { WorkerRoles } from '../../DTOs/WorkRoleProps';
import { parseApiError } from '@/shared/utils/parseApiError';
import logger from "@/shared/utils/logger";


const useWorkerRoleCostEdit = (
  workerCategoryId: string,
  redirect: string,
  id: string,
) => {
  const navigate = useNavigate();

  const { getWorkerRoleCosts, createWorkerRoleCost } = useWorkerRoleCostService();

  const initalCost: WorkerRoles = {
    id: 0,
    name: '',
    salaryPerShift: '',
    hoursPerShift: '',
  };

  const [costs, setCosts] = useState<WorkerRoles[]>([]);
  const [editingCost, setEditingCost] = useState<WorkerRoles>(initalCost);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { error, validate, setError, initialError } = useWorkerRoleInputValidate(
    editingCost.name,
    editingCost.salaryPerShift,
    editingCost.hoursPerShift,
  );

  const fetchCosts = async () => {
    setLoading(true);
    try {
      const response = await getWorkerRoleCosts({
        WorkerCategoryId: Number(workerCategoryId),
        WorkerId: Number(id),
      });
      setCosts(response || []);
    } catch (err) {
      logger.error('Error fetching costs', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ useIsFocused → useEffect on mount / when route params change
  useEffect(() => {
    fetchCosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workerCategoryId, id]);

  const handleEdit = (cost: WorkerRoles) => {
    setEditingCost(cost);
    setError(initialError);
  };

  const handleBack = () => {
    navigate(redirect, { state: { id } });
  };

  const handleSave = async () => {
    if (validate()) {
      const originalCost = costs.find(cost => cost.id === editingCost.id);
      const hasChanges =
        originalCost &&
        (originalCost.salaryPerShift !== editingCost.salaryPerShift ||
          originalCost.hoursPerShift !== editingCost.hoursPerShift);

      if (!hasChanges) {
        // ✅ Alert.alert → sonner toast
        toast('No Changes', { description: 'Nothing to update' });
        setDialogOpen(false);
        setEditingCost(initalCost);
        return;
      }

      try {
        const updatedCost = {
          workerId: Number(id),
          workerRoleId: editingCost.id,
          salaryPerShift: editingCost.salaryPerShift,
          hoursPerShift: editingCost.hoursPerShift,
        };
        await createWorkerRoleCost(updatedCost);
        setDialogOpen(false);
        setEditingCost(initalCost);
        fetchCosts();
      } catch (error: any) {
        logger.error('WorkerRoleCostEdit: operation failed', error);
        const errorMsg = parseApiError(error, 'Failed to create unit');
        // ✅ Toast.show → sonner toast.error
        toast.error(errorMsg);
      }
    }
  };

  return {
    isDialogOpen,
    setDialogOpen,
    loading,
    error,
    costs,
    editingCost,
    setEditingCost,
    handleEdit,
    handleSave,
    handleBack,
  };
};

export { useWorkerRoleCostEdit };