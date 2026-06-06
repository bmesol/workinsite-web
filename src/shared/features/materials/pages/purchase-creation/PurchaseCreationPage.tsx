import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/shared/components/Header/Header";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/shared/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
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

const PurchaseCreationPage = () => {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [addMaterialOpen, setAddMaterialOpen] = useState(false);

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
    handleBackPress,
    handleConfirmExit,
    handleSaveAndExit,
    purchaseMaterials,
    setPurchaseMaterials,
    addPurchaseMaterial,
    uploadedImages,
    setUploadedImages,
    handleImageUpload,
  } = usePurchaseCreation();

  const onBackPress = () => {
    const hasChanges = handleBackPress();
    if (hasChanges) setShowExitDialog(true);
  };

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      {/* Header */}
      <Header title="Create Purchase" />

      {/* Form Card */}
      <Card className="mt-4 p-6">
  <div className="flex flex-col gap-4">

    {/* Row 1: Bill Number + Date */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NameField
        label="Bill Number"
        inputValue={billNumber}
        setInputValue={setBillNumber}
        placeholder="Enter bill number"
        required={true}
        errorMessage={error.billNumber}
      />
      <DatePicker
        label="Date"
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
        label="Site"
        items={siteDetails}
        selectedValue={siteId}
        onValueChange={setSiteId}
        onSearch={fetchSites}
        required={true}
        error={error.siteId}
      />
      <ComboboxField
        id="supplier"
        label="Supplier"
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
      label="Add"
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
        label="Total Amount"
        inputValue={totalAmount}
        setInputValue={setTotalAmount}
        placeholder="Enter total amount"
        required={true}
        errorMessage={error.totalAmount}
        isDisabled={true}
      />
      <NameField
        label="GST"
        inputValue={gst}
        setInputValue={setGst}
        placeholder="Enter GST"
        required={true}
        errorMessage={error.gst}
      />
    </div>

    {/* Row 4: Additional Charges + Discount */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NameField
        label="Additional Charges"
        inputValue={additionalCharges}
        setInputValue={setAdditionalCharges}
        placeholder="Enter additional charges"
        isDisabled={true}
      />
      <NameField
        label="Discount"
        inputValue={discount}
        setInputValue={setDiscount}
        placeholder="Enter discount"
        isDisabled={true}
      />
    </div>

    {/* Notes - full width */}
    <TextareaField
      label="Notes"
      inputValue={notes}
      setInputValue={setNotes}
      placeholder="Enter your notes"
    />

    {/* Purchase Photos - full width */}
    <PurchasePhoto photo={uploadedImages} setPhoto={setUploadedImages} />

    {/* Image Upload - full width */}
    <div className="flex flex-col gap-1.5">
      <label className="text-base font-medium">Upload Images</label>
      <input
        type="file"
        accept="image/*"
        multiple
        className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
        onChange={(e) => handleImageUpload(e.target.files)}
      />
    </div>

    {/* Save / Cancel */}
    <FormSubmissionButtons
      onSave={() => handleSubmission()}
      onCancel={onBackPress}
    />
  </div>
</Card>

      {/* Add Purchase Material Dialog */}
      <Dialog open={addMaterialOpen} onOpenChange={setAddMaterialOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Purchase Material</DialogTitle>
          </DialogHeader>
          <PurchaseMaterialsCreationScreen
            purchaseMaterials={purchaseMaterials}
            setPurchaseMaterials={setPurchaseMaterials}
            addPurchaseMaterial={addPurchaseMaterial}
            onClose={() => setAddMaterialOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => {
                setShowExitDialog(false);
                handleSaveAndExit();
              }}
            >
              Save
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowExitDialog(false);
                handleConfirmExit();
              }}
            >
              Exit Without Saving
            </Button>
            <AlertDialogCancel onClick={() => setShowExitDialog(false)}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { PurchaseCreationPage };
