import { useState } from "react";
import { Header } from "@/shared/components/Header/Header";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent } from "@/shared/components/ui/card";
import { UnitList } from "../unit-list/UnitListPage";
import { useUnitCreation } from "./useUnitCreation";
import { usePermission } from "@/shared/hooks/usePermission";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";
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
import { NameField } from "@/shared/components/FormFields/NameField";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const PAGE_SIZE = 10;

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

const UnitCreationPage = () => {
  const { canEdit } = usePermission();
  const editable = canEdit("Unit");
  const { t } = useLanguage();

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (text: string) => {
    setSearchText(text);
    setCurrentPage(1);
  };

  const {
    name,
    unitDetails,
    loading,
    isEditing,
    error,
    editingUnitId,
    deleteId,
    setDeleteId,
    setName,
    resetFormFields,
    handleSubmission,
    handleBackPress,
    handleUnitUpdate,
    handleUnitDelete,
    confirmDelete,
    setEditingUnit,
  } = useUnitCreation();

  return (
    <div className="min-h-screen w-full px-4  pb-10">
      {/* Header */}
      <Header title={t('Create Unit')} />

      <Card className="mt-2">
        <CardContent className=" flex flex-col gap-4">
          {/* Input */}
          <NameField
            label={t('Unit')}
            inputValue={name}
            setInputValue={setName}
            errorMessage={error.name}
            placeholder="Enter unit"
            required
            isDisabled={!editable}
          />
          {/* Save / Update + Cancel Buttons */}
          <div className="flex justify-end gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                className="w-24"
                onClick={resetFormFields}
                disabled={!editable}
              >
                {t('Cancel')}
              </Button>
            )}
            <Button
              className="w-24"
              onClick={isEditing ? handleUnitUpdate : handleSubmission}
              disabled={!editable}
            >
              {isEditing ? t('Update') : t('Save')}
            </Button>
          </div>

          {/* Unit List Header: title left, search right */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-base font-medium text-foreground">{t('Unit List')}</p>
            <div className="w-56">
              <SearchBar
                searchText={searchText}
                setSearchText={handleSearch}
                placeholder={t('Search units')}
                allowAllCharacters
              />
            </div>
          </div>

          {/* Loader / List */}
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2
                className="animate-spin"
                style={{ color: "var(--secondary)" }}
                size={28}
              />
            </div>
          ) : (() => {
            const filtered = unitDetails.filter((u) =>
              u.name.toLowerCase().includes(searchText.toLowerCase())
            );
            const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
            const safePage = Math.min(currentPage, totalPages);
            const paginated = filtered.slice(
              (safePage - 1) * PAGE_SIZE,
              safePage * PAGE_SIZE
            );

            return (
              <>
                <UnitList
                  unitDetails={paginated}
                  handleUnitDelete={confirmDelete}
                  handleUnitEdit={setEditingUnit}
                  editingUnitId={editingUnitId}
                />

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      disabled={safePage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft size={15} />
                    </Button>

                    {getPageNumbers(safePage, totalPages).map((p, idx) =>
                      p === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="flex h-8 w-8 items-center justify-center select-none text-muted-foreground"
                          style={{ fontSize: "var(--font-sm)" }}
                        >
                          …
                        </span>
                      ) : (
                        <Button
                          key={p}
                          size="icon-sm"
                          variant={p === safePage ? "default" : "outline"}
                          onClick={() => setCurrentPage(p as number)}
                          style={{ fontSize: "var(--font-sm)" }}
                        >
                          {p}
                        </Button>
                      )
                    )}

                    <Button
                      variant="outline"
                      size="icon-sm"
                      disabled={safePage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      <ChevronRight size={15} />
                    </Button>
                  </div>
                )}
              </>
            );
          })()}
        </CardContent>
      </Card>

      {/* ✅ Delete Confirm Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete this unit?
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
                onClick={() => deleteId && handleUnitDelete(deleteId)}
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

export { UnitCreationPage };
