import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, Actions } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { NameField } from "@/shared/components/FormFields/NameField";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { DatePicker } from "@/shared/components/FormFields/DatePicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
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
import { usePurchaseEdit } from "./usePurchaseEdit";
import PurchaseMaterialsList from "../purchase-material-list/PurchaseMaterialListPage";
import PurchaseMaterialsCreationScreen from "../purchase-material-creation/PurchaseMaterialCreationPage";
import PurchasePhoto from "../purchase-photo/PurchasePhoto";
import { usePermission } from "@/shared/hooks/usePermission";
import { PurchaseUrls } from "../../utils/urls";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { Card } from "@/shared/components/ui/card";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const PurchaseEditScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canEdit } = usePermission();
  const editable = canEdit("Purchase");
  const { t } = useLanguage();

  const [addMaterialOpen, setAddMaterialOpen] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const {
    billNumber,
    setBillNumber,
    supplierId,
    setSupplierId,
    siteId,
    setSiteId,
    date,
    setDate,
    totalAmount,
    setTotalAmount,
    gst,
    setGst,
    additionalCharges,
    setAdditionalCharges,
    discount,
    setDiscount,
    notes,
    setNotes,
    siteDetails,
    supplierDetails,
    fetchSites,
    fetchSuppliers,
    purchaseDetails,
    error,
    loading,
    handleSubmission,
    hasUnsavedChanges,
    addPurchaseMaterial,
    newPurchaseMaterials,
    setNewPurchaseMaterials,
    updatedPurchaseMaterials,
    setUpdatedPurchaseMaterials,
    removedPurchaseMaterialIds,
    setRemovedPurchaseMaterialIds,
    uploadedImages,
    setUploadedImages,
    handleImageUpload,
    showImage,
    setShowImage,
    removedImages,
    setRemovedImages,
  } = usePurchaseEdit(id!);

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      navigate(PurchaseUrls.list);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      {/* Header */}
      <Header title={t('Edit Purchase')} />

      {purchaseDetails && (
        <Card className="mt-4 p-6">
          {/* Bill Number */}
          <NameField
            label={t('Bill Number')}
            required
            inputValue={billNumber}
            setInputValue={setBillNumber}
            placeholder={t('Enter bill number')}
            errorMessage={error.billNumber}
            isDisabled={!editable}
          />

          {/* Site */}
          <ComboboxField
            id="site"
            label={t('Site')}
            required
            items={siteDetails}
            selectedValue={siteId}
            onValueChange={setSiteId}
            onSearch={fetchSites}
            error={error.siteId}
            disabled={!editable}
          />

          {/* Supplier */}
          <ComboboxField
            id="supplier"
            label={t('Supplier')}
            required
            items={supplierDetails}
            selectedValue={supplierId}
            onValueChange={setSupplierId}
            onSearch={fetchSuppliers}
            error={error.supplierId}
            disabled={!editable}
          />

          {/* Date */}
          <DatePicker
            label={t('Date')}
            required
            date={date}
            onDateChange={setDate}
            errorMessage={error.date}
            disable={!editable}
          />

          {/* Add Purchase Material Button */}
          <FormActionButton
            heading="Purchase Material"
            label={t('Add')}
            onClick={() => setAddMaterialOpen(true)}
            isAddDisabled={!editable}
            isColsTwo={true}
          />
          {/* Purchase Materials List */}
          <PurchaseMaterialsList
            newPurchaseMaterials={newPurchaseMaterials}
            setNewPurchaseMaterials={setNewPurchaseMaterials}
            updatedPurchaseMaterials={updatedPurchaseMaterials}
            setUpdatedPurchaseMaterials={setUpdatedPurchaseMaterials}
            removedPurchaseMaterialIds={removedPurchaseMaterialIds}
            setRemovedPurchaseMaterialIds={setRemovedPurchaseMaterialIds}
          />

          {/* Total Amount — read only */}
          <NameField
            label={t('Total Amount')}
            required
            inputValue={totalAmount}
            setInputValue={setTotalAmount}
            placeholder={t('Enter total amount')}
            errorMessage={error.totalAmount}
            isDisabled={true}
            regex="^[0-9]*\.?[0-9]*$"
          />

          {/* GST */}
          <NameField
            label={t('GST')}
            required
            inputValue={gst}
            setInputValue={setGst}
            placeholder={t('Enter GST')}
            errorMessage={error.gst}
            isDisabled={!editable}
          />

          {/* Additional Charges — read only */}
          <NameField
            label={t('Additional Charges')}
            inputValue={additionalCharges}
            setInputValue={setAdditionalCharges}
            placeholder={t('Enter additional charges')}
            isDisabled={true}
            regex="^[0-9]*\.?[0-9]*$"
          />

          {/* Discount — read only */}
          <NameField
            label={t('Discount')}
            inputValue={discount}
            setInputValue={setDiscount}
            placeholder={t('Enter discount')}
            isDisabled={true}
            regex="^[0-9]*\.?[0-9]*$"
          />

          {/* Notes */}
          <TextareaField
            label={t('Notes')}
            inputValue={notes && notes !== "null" ? notes : ""}
            setInputValue={setNotes}
            placeholder={t('Enter your notes')}
            isDisabled={!editable}
          />

          {/* Photos */}
          <PurchasePhoto
            photo={uploadedImages}
            setPhoto={setUploadedImages}
            showImages={showImage}
            setShowImages={setShowImage}
            removeImages={removedImages}
            setRemoveImages={setRemovedImages}
          />

          {/* Image Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-base font-medium">{t('Upload Images')}</label>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={!editable}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
          </div>

          {/* Save Button */}
          <FormSubmissionButtons
            onSave={() => handleSubmission()}
            onCancel={handleBack}
          />
        </Card>
      )}

      {/* Add Purchase Material Dialog */}
      <Dialog open={addMaterialOpen} onOpenChange={setAddMaterialOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('Add Purchase Material')}</DialogTitle>
          </DialogHeader>
          <PurchaseMaterialsCreationScreen
            purchaseMaterials={newPurchaseMaterials}
            setPurchaseMaterials={setNewPurchaseMaterials}
            onClose={() => setAddMaterialOpen(false)}
            addPurchaseMaterial={addPurchaseMaterial}
            updatedPurchaseMaterials={updatedPurchaseMaterials}
          />
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save them before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => navigate(PurchaseUrls.list)}>
              Exit without Saving
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={() => {
                  handleSubmission();
                  setShowUnsavedDialog(false);
                }}
              >
                {t('Save')}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PurchaseEditScreen;
