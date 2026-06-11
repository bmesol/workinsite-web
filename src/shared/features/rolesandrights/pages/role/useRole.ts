import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRoleService } from '../../service/RoleService';
import type { RoleRequest, Roles } from '../../DTOs/DTOs';
import { usePermission } from '@/shared/hooks/usePermission';

export const useRolesScreen = () => {
  const { getRoles, createRole, updateRole, deleteRole } = useRoleService();
  const { isSuperAdmin } = usePermission();

  const [roles, setRoles] = useState<Roles[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false); 
  const [deleteId, setDeleteId] = useState<number | null>(null); 

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await getRoles();
      setRoles(response.items || []);
    } catch (err) {
      toast.error('Failed to fetch roles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRole = async () => {
    if (!isSuperAdmin) {
      toast.error('Only Super Admins can manage roles.');
      return;
    }
    if (!name.trim()) {
      toast.error('Please enter a role name');
      return;
    }

    const payload: RoleRequest = { name: name.trim(), note: note.trim() };

    try {
      if (editId) {
        await updateRole(editId, payload);
      } else {
        await createRole(payload);
      }
      resetForm();
      setIsSheetOpen(false);
      fetchRoles();
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.[0]?.message || 'Failed to Save Role';
      toast.error(errorMsg);
      setIsSheetOpen(false);
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (!isSuperAdmin) {
      toast.error('Only Super Admins can manage roles.');
      return;
    }
    try {
      await deleteRole(id);
      setDeleteId(null);
      fetchRoles();
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || 'Failed to delete Role';
      toast.error(errorMsg);
      setDeleteId(null);
    }
  };

  const handleEditRole = (role: Roles) => {
    setEditId(role.id);
    setName(role.name);
    setNote(role.note || '');
    setIsSheetOpen(true);
  };

  const confirmDelete = (id: number) => {
    if (!isSuperAdmin) {
      toast.error('Only Super Admins can manage roles.');
      return;
    }
    setDeleteId(id); 
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setNote('');
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
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
  };
};