import { useNavigate } from "react-router-dom";
import { Header, Actions } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { NameField } from "@/shared/components/FormFields/NameField";
import { DatePicker } from "@/shared/components/FormFields/DatePicker";
import MaterialUsedCard from "@/shared/components/MaterialUsedCard/MaterialUsedCard";
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
import { useMaterialUsedList } from "./useMaterialUsedList";
import { MaterialUsedUrls } from "../../utils/urls";
import materialUsedImage from "@/assets/images/client-creation-illustration.png";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar/SearchFilterBar";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const MaterialUsedListPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    site,
    setSite,
    date,
    setDate,
    material,
    setMaterial,
    workMode,
    setWorkMode,
    quantity,
    setQuantity,
    fetchSites,
    fetchMaterials,
    fetchWorkModes,
    siteDetails,
    workModeDetails,
    materialDetails,
    hasMore,
    materialUsedDetails,
    loading,
    paginationLoading,
    appliedFilters,
    filterOpen,
    setFilterOpen,
    deleteId,
    setDeleteId,
    fetchMaterialUsed,
    handleMaterialUsedEdit,
    confirmDelete,
    handleDeleteMaterialUsed,
    handleClearSearch,
    handlePress,
    handleSearch,
  } = useMaterialUsedList();

  const isFiltered = !!(
    date ||
    material?.value ||
    site?.value ||
    workMode?.value ||
    quantity
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!materialUsedDetails.length && !appliedFilters) {
    return (
      <GetStartedCard
        imgSrc={materialUsedImage}
        buttonClick={MaterialUsedUrls.create}
        buttonLabel={t('New Material Used')}
      >
        {t('Manage and track your material used efficiently. Start by creating a new record.')}
      </GetStartedCard>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6">
      {/* ── Header ── */}
      <Header title={t("Material Used List")}>
        <Actions>
          <Button onClick={handlePress}>{t('New Material Used')}</Button>
        </Actions>
      </Header>

      {/* ── Filter / Search bar ── */}
      <div className="flex justify-end ">
       <SearchFilterBar
        appliedFilters={appliedFilters}
        placeholder={t('Search material used')}
        onFilterOpen={() => setFilterOpen(true)}
        onClearSearch={handleClearSearch}
      />

      </div>

      {/* ── List ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {materialUsedDetails.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground mt-10">
            {t("No material used found")}
          </p>
        ) : (
          materialUsedDetails.map((item) => (
            <MaterialUsedCard
              material={item.material}
              site={item.site?.name}
              quantity={item.quantity?.toString()}
              unit={item.material?.unit?.name}
              date={item.date}
              workmode={item.workMode?.name}
              onPress={() => handleMaterialUsedEdit(item.id)}
              onDelete={() => confirmDelete(item.id)}
              permissionKey="Material Used"
            />
          ))
        )}
      </div>

      {/* ── View More ── */}
      {hasMore && (
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => fetchMaterialUsed()}
            disabled={paginationLoading}
          >
            {paginationLoading ? "Loading..." : t("View More")}
          </Button>
        </div>
      )}

      {/* ── Filter Dialog ── */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[var(--card)]">
          <DialogHeader>
            <DialogTitle>{t('Material Used Search')}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <DatePicker label={t("Date")} date={date} onDateChange={setDate} />
            <ComboboxField
              id="site"
              label={t("Site")}
              items={siteDetails}
              selectedValue={site.value}
              onValueChange={(val) =>
                setSite({
                  value: val,
                  name: siteDetails.find((s) => s.value === val)?.label || "",
                })
              }
              onSearch={fetchSites}
            />
            <ComboboxField
              id="material"
              label={t("Material")}
              items={materialDetails}
              selectedValue={material.value}
              onValueChange={(val) =>
                setMaterial({
                  value: val,
                  name:
                    materialDetails.find((m) => m.value === val)?.label || "",
                })
              }
              onSearch={fetchMaterials}
            />
            <NameField
              label={t("Quantity")}
              inputValue={quantity}
              setInputValue={setQuantity}
              placeholder={t("Enter Quantity")}
              regex="^[0-9]*\.?[0-9]*$"
            />
            <ComboboxField
              id="workMode"
              label={t("Work Mode")}
              items={workModeDetails}
              selectedValue={workMode.value}
              onValueChange={(val) =>
                setWorkMode({
                  value: val,
                  name:
                    workModeDetails.find((w) => w.value === val)?.label || "",
                })
              }
              onSearch={fetchWorkModes}
            />
            <Button
              onClick={() => {
                handleSearch();
                setFilterOpen(false);
              }}
              disabled={!isFiltered}
              className="w-full"
            >
              {t("Search")}
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
            <AlertDialogTitle>{t('Confirm Delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Are you sure you want to delete this material used record?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                {t("Cancel")}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => deleteId && handleDeleteMaterialUsed(deleteId)}
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

export default MaterialUsedListPage;
