import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Actions } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import MaterialCard from "@/shared/components/MaterialCard/MaterialCard";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import { useMaterialList } from "./useMaterialList";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";
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
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const MaterialListScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    materialDetails,
    fetchMaterial,
    handleMaterialSelect,
    handleMaterialDelete,
    confirmDelete,
    loading,
    searchText,
    setSearchText,
    deleteId,
    setDeleteId,
  } = useMaterialList();

  // ✅ Filter
  const filteredMaterialList = materialDetails.filter((item: any) =>
    item.name.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  // ✅ Initial load
  useEffect(() => {
    setSearchText("");
    fetchMaterial("");
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!materialDetails.length) {
    return (
      <GetStartedCard
        imgSrc="/images/empty.png"
        buttonClick="/material-create"
        buttonLabel={t("Create Materials")}
      >
        Create your first material to get started.
      </GetStartedCard>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6">
      {/* ✅ Header */}
      <Header title={t("Materials")}>
        <Actions>
          <Button onClick={() => navigate("/materials/create")}>
            New Material
          </Button>
        </Actions>
      </Header>

      {/* ✅ Search + Refresh */}

      <div className="flex justify-end mt-4 mb-4">
        <div className="w-full md:w-3/12">
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={t('Search materials')}
            allowAllCharacters={true}
          />
        </div>
      </div>

      {/* ✅ List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pb-4">
        {filteredMaterialList.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            {t("No materials found")}
          </div>
        ) : (
          filteredMaterialList.map((item: any) => (
            <div
              key={item.id}
              className="cursor-pointer"
              onClick={() => handleMaterialSelect(item.id)}
            >
              <MaterialCard
                material={item}
                unit={item.unit?.name}
                hsnCode={item.hsnCode}
                onDelete={() => confirmDelete(item.id)}
                onPress={() => handleMaterialSelect(item.id)}
                permissionKey="Material"
              />
            </div>
          ))
        )}
      </div>
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
              Are you sure you want to delete this material?
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
                onClick={() => deleteId && handleMaterialDelete(deleteId)}
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

export default MaterialListScreen;
