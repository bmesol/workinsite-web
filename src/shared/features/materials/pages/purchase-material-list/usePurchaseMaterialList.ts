import { useState } from 'react';
import type {
  PurchaseMaterialCreationListProps,
  PurchaseMaterialUpdationListProps,
} from '../../DTOs/PurchaseMaterialProps';

export const usePurchaseMaterialList = (props: {
  newPurchaseMaterials: PurchaseMaterialCreationListProps[];
  setNewPurchaseMaterials: React.Dispatch<React.SetStateAction<PurchaseMaterialCreationListProps[]>>;
  updatedPurchaseMaterials?: PurchaseMaterialUpdationListProps[];
  setUpdatedPurchaseMaterials?: React.Dispatch<React.SetStateAction<PurchaseMaterialUpdationListProps[]>>;
  removedPurchaseMaterialIds?: number[];
  setRemovedPurchaseMaterialIds?: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const {
    newPurchaseMaterials,
    setNewPurchaseMaterials,
    updatedPurchaseMaterials = [],
    setUpdatedPurchaseMaterials,
    removedPurchaseMaterialIds = [],
    setRemovedPurchaseMaterialIds,
  } = props;

  type CombinedItem = {
    index: number;
    value: PurchaseMaterialCreationListProps | PurchaseMaterialUpdationListProps;
    source: 'new' | 'update';
  };

  const [selectedItem, setSelectedItem] = useState<CombinedItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogItem, setDeleteDialogItem] = useState <
  PurchaseMaterialCreationListProps | PurchaseMaterialUpdationListProps | null
  >(null);

  const handleEdit = (
    item: PurchaseMaterialCreationListProps | PurchaseMaterialUpdationListProps
  ) => {
    let index = 0;
    let source: 'new' | 'update' = 'new';

    const purchaseMaterialId =
      'purchaseMaterialId' in item
        ? item.purchaseMaterialId
        : 'id' in item
        ? (item as any).id
        : undefined;

    if (purchaseMaterialId) {
      source = 'update';
      index = updatedPurchaseMaterials.findIndex(
        m => m.purchaseMaterialId === purchaseMaterialId
      );
    } else {
      index = newPurchaseMaterials.indexOf(
        item as PurchaseMaterialCreationListProps
      );
    }

    setSelectedItem({ index, value: { ...item, purchaseMaterialId }, source });
    setEditDialogOpen(true);
  };

  const confirmDelete = (
    item: PurchaseMaterialCreationListProps | PurchaseMaterialUpdationListProps
  ) => {
    setDeleteDialogItem(item);
  };

  const handleDelete = () => {
    if (!deleteDialogItem) return;

    const item = deleteDialogItem;

    const purchaseMaterialId =
      'purchaseMaterialId' in item
        ? item.purchaseMaterialId
        : 'id' in item
        ? (item as any).id
        : undefined;

    if (purchaseMaterialId) {
      if (setUpdatedPurchaseMaterials) {
        const updated = [...updatedPurchaseMaterials];
        const idx = updated.findIndex(
          m => m.purchaseMaterialId === purchaseMaterialId
        );
        if (idx !== -1) updated.splice(idx, 1);
        setUpdatedPurchaseMaterials(updated);
      }
      setRemovedPurchaseMaterialIds?.([
        ...removedPurchaseMaterialIds,
        purchaseMaterialId,
      ]);
    } else {
      const updated = [...newPurchaseMaterials];
      const idx = updated.indexOf(item as PurchaseMaterialCreationListProps);
      if (idx !== -1) updated.splice(idx, 1);
      setNewPurchaseMaterials(updated);
    }

    setDeleteDialogItem(null);
  };

  return {
    selectedItem,
    setSelectedItem,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogItem,
    setDeleteDialogItem,
    handleEdit,
    confirmDelete,
    handleDelete,
  };
};