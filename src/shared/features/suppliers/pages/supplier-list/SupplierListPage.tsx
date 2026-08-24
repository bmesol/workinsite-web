import { SupplierGetStartedPage } from "../supplier-get-started/SupplierGetStartedPage";
import { ContactCard } from "@/shared/components/ContactCard/ContactCard";
import { Header } from "@/shared/components/Header/Header";
import { ContactTypes } from "../../../contacts/DTOs/ContactProps";
import { useSupplierList } from "./useSupplierList";
import { SuppliersUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";
import { useState } from "react";
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
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const SupplierListPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const { t } = useLanguage();

  const {
    supplierDetails,
    fetchSupplier,
    handleSupplierSelect,
    confirmDelete,
    handleSupplierDelete,
    hasSearchFilter,
    loading,
    deleteId,
    setDeleteId,
  } = useSupplierList();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!supplierDetails.length && !hasSearchFilter)
    return <SupplierGetStartedPage />;

  return (
    <div className="min-h-screen w-full px-4 py-6">
      {/* Header */}
      <Header title={t('Supplier List')}>
        <Button onClick={() => navigate(SuppliersUrls.create)}>
          {t('New Supplier')}
        </Button>
      </Header>

      {/* SearchBar ✅ */}
      <div className="flex justify-end mt-4 mb-4">
        <div className="w-full md:w-3/12">
          <SearchBar
            searchText={searchValue}
            setSearchText={(val) => {
              setSearchValue(val);
              fetchSupplier(val);
            }}
            searchCategory={t('Suppliers')}
          />
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pb-4">
        {!supplierDetails.length ? (
          <div className="col-span-2 my-4 text-center text-muted-foreground">
            {t('No suppliers found')}
          </div>
        ) : (
          supplierDetails.map((supplier) => (
            <div
              key={supplier.id}
              onClick={() => handleSupplierSelect(supplier.id)}
              className="cursor-pointer"
            >
              <ContactCard
                name={supplier.name}
                phone={
                  supplier.contact?.contactDetails?.find(
                    (item) => item.contactType === ContactTypes.PHONE,
                  )?.value
                }
                email={
                  supplier.contact?.contactDetails?.find(
                    (item) => item.contactType === ContactTypes.EMAIL,
                  )?.value
                }
                onDelete={(e: React.MouseEvent) =>
                  confirmDelete(e, supplier.id)
                }
              />
            </div>
          ))
        )}
      </div>

      {/* ✅ Delete Confirm Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              {t('Confirm Delete')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {t('Are you sure you want to delete this supplier?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                {t('Cancel')}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => deleteId && handleSupplierDelete(deleteId)}
              >
                {t('Delete')}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { SupplierListPage };
