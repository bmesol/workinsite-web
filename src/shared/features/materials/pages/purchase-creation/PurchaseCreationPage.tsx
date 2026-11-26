import React, { useState } from "react";
import { Header } from "@/shared/components/Header/Header";
import { Card } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { UnsavedChangesDialog } from "@/shared/components/UnsavedChangesDialog/UnsavedChangesDialog";
import { NameField } from "@/shared/components/FormFields/NameField";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { DatePicker } from "@/shared/components/FormFields/DatePicker";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { usePurchaseCreation } from "./usePurchaseCreation";
import PurchaseMaterialsCreationScreen from "../purchase-material-creation/PurchaseMaterialCreationPage";
import PurchaseMaterialsList from "../purchase-material-list/PurchaseMaterialListPage";
import PurchasePhoto from "../purchase-photo/PurchasePhoto";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { useLanguage } from "@/shared/hooks/useLanguageContext";
import { UploadButton } from "@/shared/components/UploadButton/UploadButton";

const PurchaseCreationPage = () => {
  const [addMaterialOpen, setAddMaterialOpen] = useState(false);
  const { t } = useLanguage();

  const {
    billNumber,
    setBillNumber,
    supplierId,
    setSupplierId,
    siteDetails,
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
    fetchSites,
    fetchSuppliers,
    supplierDetails,
    error,
    handleSubmission,
    handleCancel,
    purchaseMaterials,
    setPurchaseMaterials,
    addPurchaseMaterial,
    uploadedImages,
    setUploadedImages,
    handleImageUpload,
    showUnsavedDialog,
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
  } = usePurchaseCreation();

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      {/* Header */}
      <Header title={t('Create Purchase')} />

      {/* Form Card */}
      <Card className="mt-4 p-6">
  <div className="flex flex-col gap-4">

    {/* Row 1: Bill Number + Date */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NameField
        label={t('Bill Number')}
        inputValue={billNumber}
        setInputValue={setBillNumber}
        placeholder={t('Enter bill number')}
        required={true}
        errorMessage={error.billNumber}
      />
      <DatePicker
        label={t('Date')}
        date={date}
        onDateChange={setDate}
        errorMessage={error.date}
        defaultDate={true}
        required={true}
      />
    </div>

    {/* Row 2: Site + Supplier */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ComboboxField
        id="site"
        label={t('Site')}
        items={siteDetails}
        selectedValue={siteId}
        onValueChange={setSiteId}
        onSearch={fetchSites}
        required={true}
        error={error.siteId}
      />
      <ComboboxField
        id="supplier"
        label={t('Supplier')}
        items={supplierDetails}
        selectedValue={supplierId}
        onValueChange={setSupplierId}
        onSearch={fetchSuppliers}
        required={true}
        error={error.supplierId}
      />
    </div>

    {/* Purchase Materials - full width */}
    <FormActionButton
      heading="Purchase Material"
      label={t('Add')}
      onClick={() => setAddMaterialOpen(true)}
      isColsTwo={true}
    />
    <PurchaseMaterialsList
      newPurchaseMaterials={purchaseMaterials}
      setNewPurchaseMaterials={setPurchaseMaterials}
    />

    {/* Row 3: Total Amount + GST */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NameField
        label={t('Total Amount')}
        inputValue={totalAmount}
        setInputValue={setTotalAmount}
        placeholder={t('Enter total amount')}
        required={true}
        errorMessage={error.totalAmount}
        isDisabled={true}
      />
      <NameField
        label={t('GST')}
        inputValue={gst}
        setInputValue={setGst}
        placeholder={t('Enter GST')}
        required={true}
        errorMessage={error.gst}
      />
    </div>

    {/* Row 4: Additional Charges + Discount */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NameField
        label={t('Additional Charges')}
        inputValue={additionalCharges}
        setInputValue={setAdditionalCharges}
        placeholder={t('Enter additional charges')}
        isDisabled={true}
      />
      <NameField
        label={t('Discount')}
        inputValue={discount}
        setInputValue={setDiscount}
        placeholder={t('Enter discount')}
        isDisabled={true}
      />
    </div>

    {/* Notes - full width */}
    <TextareaField
      label={t('Notes')}
      inputValue={notes}
      setInputValue={setNotes}
      placeholder={t('Enter your notes')}
    />

    {/* Purchase Photos - full width */}
    <PurchasePhoto photo={uploadedImages} setPhoto={setUploadedImages} />

    {/* Image Upload */}
    <div className="flex">
      <UploadButton
        text={t('Upload Images')}
        onFilesSelected={handleImageUpload}
      />
    </div>

    {/* Save / Cancel */}
    <FormSubmissionButtons
      onSave={() => handleSubmission()}
      onCancel={handleCancel}
    />
  </div>
</Card>

      {/* Add Purchase Material Dialog */}
      <Dialog open={addMaterialOpen} onOpenChange={setAddMaterialOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('Add Purchase Material')}</DialogTitle>
          </DialogHeader>
          <PurchaseMaterialsCreationScreen
            purchaseMaterials={purchaseMaterials}
            setPurchaseMaterials={setPurchaseMaterials}
            addPurchaseMaterial={addPurchaseMaterial}
            onClose={() => setAddMaterialOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onKeepEditing={handleKeepEditing}
        onDiscard={handleDiscardChanges}
        onSave={handleSaveFromDialog}
      />
    </div>
  );
};

export { PurchaseCreationPage };
