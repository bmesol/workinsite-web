import { useNavigate } from "react-router-dom";
import { Header, Actions } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { NameField } from "@/shared/components/FormFields/NameField";
import { usePurchaseList } from "./usePurchaseList";
import { ContactCard } from "@/shared/components/ContactCard/ContactCard";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { DatePicker } from "@/shared/components/FormFields/DatePicker";
import clientcreation from "@/assets/images/client-creation-illustration.png";
import { PurchaseUrls } from "../../utils/urls";
import { SlidersHorizontal, X } from "lucide-react";
import { MapPin, FileText, Calendar } from "lucide-react";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar/SerchFilterBar";

const PurchaseListPage = () => {
  const navigate = useNavigate();

  const {
    purchaseDetails,
    fetchPurchases,
    handleEditPurchase,
    handleDeletePurchase,
    loading,
    paginationLoading,
    hasMore,
    confirmDelete,
    date,
    setDate,
    billNumber,
    setBillNumber,
    siteId,
    setSiteId,
    supplierId,
    setSupplierId,
    siteDetails,
    supplierDetails,
    fetchSites,
    fetchSuppliers,
    handleSearch,
    handleClearSearch,
    appliedFilters,
    filterOpen,
    setFilterOpen,
    deleteId,
    setDeleteId,
  } = usePurchaseList();

  const isFiltered = !!(
    date ||
    billNumber ||
    siteId?.value ||
    supplierId?.value
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!purchaseDetails.length && !appliedFilters) {
    return (
      <GetStartedCard
        imgSrc={clientcreation}
        buttonClick={PurchaseUrls.create}
        buttonLabel="New Purchase"
      >
        Manage and track your purchases seamlessly with WorkInsite. Add new
        purchases and keep your construction materials organized.
      </GetStartedCard>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6">
      {/* Header */}
      <Header title="Purchase List">
        <Actions>
          <Button onClick={() => navigate(PurchaseUrls.create)}>
            New Purchase
          </Button>
        </Actions>
      </Header>

      {/* Search Bar — matches WorkerListPage pattern */}
      <div className="flex justify-end ">
        <SearchFilterBar
          appliedFilters={appliedFilters}
          placeholder="Search Purchases..."
          onFilterOpen={() => setFilterOpen(true)}
          onClearSearch={handleClearSearch}
        />
      </div>

      {/* Purchase List */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mt-4">
        {purchaseDetails.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground mt-10">
            No purchases found
          </p>
        ) : (
          purchaseDetails.map((item) => (
            <ContactCard
              key={item.id}
              name={item.supplier?.name}
              onPress={() => handleEditPurchase(item.id)}
              onDelete={(e) => {
                e.stopPropagation();
                confirmDelete(item.id);
              }}
              subDetails={[
                { icon: MapPin, text: item.site?.name ?? "" },
                { icon: FileText, text: item.billNumber ?? "" },
                { icon: Calendar, text: item.date ?? "" },
              ]}
            />
          ))
        )}
      </div>

      {/* Filter Dialog — matches WorkerListPage pattern */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Purchase Search</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <DatePicker label="Date" date={date} onDateChange={setDate} />
            <NameField
              label="Bill Number"
              inputValue={billNumber}
              setInputValue={setBillNumber}
              placeholder="Enter bill number"
            />
            <ComboboxField
              id="site"
              label="Site"
              items={siteDetails}
              selectedValue={siteId.value}
              onValueChange={(val) =>
                setSiteId({
                  value: val,
                  name: siteDetails.find((s) => s.value === val)?.label || "",
                })
              }
              onSearch={fetchSites}
            />
            <ComboboxField
              id="supplier"
              label="Supplier"
              items={supplierDetails}
              selectedValue={supplierId.value}
              onValueChange={(val) =>
                setSupplierId({
                  value: val,
                  name:
                    supplierDetails.find((s) => s.value === val)?.label || "",
                })
              }
              onSearch={fetchSuppliers}
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

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this purchase?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => deleteId && handleDeletePurchase(deleteId)}
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

export default PurchaseListPage;
