import { useNavigate } from "react-router-dom";
import { Header, Actions } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { NameField } from "@/shared/components/FormFields/NameField";
import { DatePicker } from "@/shared/components/FormFields/DatePicker";
import MaterialCard from "@/shared/components/MaterialCard/MaterialCard";
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
import { useMaterialShiftList } from "./useMaterialShiftList";
import { MaterialShiftUrls } from "../../utils/urls";
import materialShiftImage from "@/assets/images/client-creation-illustration.png";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar/SerchFilterBar";
import MaterialUsedCard from "@/shared/components/MaterialUsedCard/MaterialUsedCard";

const MaterialShiftListPage = () => {
  const navigate = useNavigate();

  const {
    materialShiftDetails,
    loading,
    paginationLoading,
    hasMore,
    fetchMaterialShifts,
    handleSearch,
    handleClearSearch,
    confirmDelete,
    deleteId,
    setDeleteId,
    handleDeleteMaterialShift,
    handleEditMaterialShift,
    handleAddShift,
    materialId,
    setMaterialId,
    sourceSiteId,
    setSourceSiteId,
    targetSiteId,
    setTargetSiteId,
    date,
    setDate,
    quantity,
    setQuantity,
    fetchSites,
    fetchMaterials,
    siteDetails,
    materialDetails,
    appliedFilters,
    filterOpen,
    setFilterOpen,
  } = useMaterialShiftList();

  const isFiltered = !!(
    date ||
    materialId?.value ||
    sourceSiteId?.value ||
    targetSiteId?.value ||
    quantity
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!materialShiftDetails.length && !appliedFilters) {
    return (
      <GetStartedCard
        imgSrc={materialShiftImage}
        buttonClick={MaterialShiftUrls.create}
        buttonLabel="New Material Shift"
      >
        Manage and track your material shifts efficiently. Start by creating a
        new record.
      </GetStartedCard>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 py-6">
      {/* ── Header ── */}
      <Header title="Material Shift List">
        <Actions>
          <Button onClick={handleAddShift}>New Material Shift</Button>
        </Actions>
      </Header>

      {/* ── Filter / Search bar ── */}
      <div className="flex justify-end ">
        <SearchFilterBar
          appliedFilters={appliedFilters}
          placeholder="Search Material Shift..."
          onFilterOpen={() => setFilterOpen(true)}
          onClearSearch={handleClearSearch}
        />
      </div>

      {/* ── List ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {materialShiftDetails.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground mt-10">
            No material shifts found
          </p>
        ) : (
          materialShiftDetails.map((item) => (
            <MaterialUsedCard
              key={item.id}
              material={item.material}
              sourceSite={item.sourceSite?.name}
              targetSite={item.targetSite?.name}
              date={item.date}
              quantity={item.quantity}
              unit={item.material?.unit?.name}
              onDelete={() => confirmDelete(item.id)}
              onPress={() => handleEditMaterialShift(item.id)}
              permissionKey="Material Shift"
            />
          ))
        )}
      </div>

      {/* ── View More ── */}
      {hasMore && (
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => fetchMaterialShifts()}
            disabled={paginationLoading}
          >
            {paginationLoading ? "Loading..." : "View More"}
          </Button>
        </div>
      )}

      {/* ── Filter Dialog ── */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Material Shift Search</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <DatePicker label="Date" date={date} onDateChange={setDate} />
            <NameField
              label="Quantity"
              inputValue={quantity}
              setInputValue={setQuantity}
              placeholder="Enter quantity"
              regex="^[0-9]*\.?[0-9]*$"
            />
            <ComboboxField
              id="material"
              label="Material"
              items={materialDetails}
              selectedValue={materialId.value}
              onValueChange={(val) =>
                setMaterialId({
                  value: val,
                  name:
                    materialDetails.find((m) => m.value === val)?.label || "",
                })
              }
              onSearch={fetchMaterials}
            />
            <ComboboxField
              id="sourceSite"
              label="Source Site"
              items={siteDetails}
              selectedValue={sourceSiteId.value}
              onValueChange={(val) =>
                setSourceSiteId({
                  value: val,
                  name: siteDetails.find((s) => s.value === val)?.label || "",
                })
              }
              onSearch={fetchSites}
            />
            <ComboboxField
              id="targetSite"
              label="Target Site"
              items={siteDetails}
              selectedValue={targetSiteId.value}
              onValueChange={(val) =>
                setTargetSiteId({
                  value: val,
                  name: siteDetails.find((s) => s.value === val)?.label || "",
                })
              }
              onSearch={fetchSites}
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

      {/* ── Delete Dialog ── */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this material shift?
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
                onClick={() => deleteId && handleDeleteMaterialShift(deleteId)}
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

export default MaterialShiftListPage;
