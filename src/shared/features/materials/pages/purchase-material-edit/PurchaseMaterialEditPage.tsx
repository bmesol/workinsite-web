import React from "react";
import { Button } from "@/shared/components/ui/button";
import { SelectField } from "@/shared/components/FormFields/SelectField";

import { usePurchaseMaterialsEdit } from "./usePurchaseMaterialEdit";
import type {
  PurchaseMaterialCreationListProps,
  PurchaseMaterialUpdationListProps,
} from "../../DTOs/PurchaseMaterialProps";
import PurchasePhoto from "../purchase-photo/PurchasePhoto";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
// ── Replaced imports ──
import { NameField } from "@/shared/components/FormFields/NameField";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { DatePicker } from "@/shared/components/FormFields/DatePicker";
import type { ReceivedQualityTypes } from "../../DTOs/PurchaseProps";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

interface Props {
  newPurchaseMaterials: PurchaseMaterialCreationListProps[];
  setNewPurchaseMaterials: React.Dispatch<
    React.SetStateAction<PurchaseMaterialCreationListProps[]>
  >;
  updatedPurchaseMaterials?: PurchaseMaterialUpdationListProps[];
  setUpdatedPurchaseMaterials?: React.Dispatch<
    React.SetStateAction<PurchaseMaterialUpdationListProps[]>
  >;
  selectedItem: {
    index: number;
    value:
      | PurchaseMaterialCreationListProps
      | PurchaseMaterialUpdationListProps;
  };
  closeModal: () => void;
  removedPurchaseMaterialIds?: number[];
  setRemovedPurchaseMaterialIds?: React.Dispatch<
    React.SetStateAction<number[]>
  >;
}

const PurchaseMaterialsEditScreen = (props: Props) => {
  const { t } = useLanguage();

  const {
    materialId,
    setMaterialId,
    handleReceivedQuantityChange,
    rate,
    setRate,
    additionalCharges,
    setAdditionalCharges,
    discount,
    setDiscount,
    receivedQuality,
    setReceivedQuality,
    receivedDate,
    setReceivedDate,
    receivedQuantity,
    setReceivedQuantity,
    notes,
    setNotes,
    materialDetails,
    fetchMaterials,
    ReceivedQualityItems,
    uploadedImages,
    setUploadedImages,
    handleImageUpload,
    handleFileChange,
    fileInputRef,
    handleSubmit,
    error,
    showImage,
    setShowImage,
    removedImages,
    setRemovedImages,
    minQuantity,
  } = usePurchaseMaterialsEdit(props);

  const MinQuantityBadge = () => {
    if (!minQuantity || minQuantity <= 0) return null;

    const entered = parseFloat(receivedQuantity);
    const isBelow = !isNaN(entered) && entered < minQuantity;

    return (
      <div
        className={`self-start px-2.5 py-1 rounded-md border text-xs font-medium -mt-2 ${
          isBelow
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-blue-50 border-blue-200 text-blue-700"
        }`}
      >
        {isBelow
          ? `⚠  Value must be ${minQuantity} or greater`
          : `✓  Minimum allowed: ${minQuantity}`}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto px-4 py-2 pr-3">
      {/* ── Material ── */}
      <ComboboxField
        id="material"
        label={t("Material")}
        required
        items={materialDetails}
        selectedValue={materialId}
        onValueChange={setMaterialId}
        onSearch={fetchMaterials}
        error={error.materialId}
      />

      {/* ── Quantity ── */}
      <NameField
        label={t("Received Quantity")}
        required
        inputValue={receivedQuantity}
        setInputValue={handleReceivedQuantityChange}
        placeholder={t("Enter Received Quantity")}
        errorMessage={error.receivedQuantity}
        regex="^[0-9]*\.?[0-9]*$"
      />
      <MinQuantityBadge />

      {/* ── Rate ── */}
      <NameField
        label={t("Rate (₹/Unit)")}
        required
        inputValue={rate}
        setInputValue={setRate}
        placeholder={t("Enter Rate")}
        errorMessage={error.rate}
        regex="^[0-9]*\.?[0-9]*$"
      />
      {/* ── Additional Charges ── */}
      <NameField
        label={t("Additional Charges")}
        inputValue={additionalCharges}
        setInputValue={setAdditionalCharges}
        placeholder={t("Enter Additional Charges")}
        regex="^[0-9]*\.?[0-9]*$"
      />
      {/* ── Discount ── */}
      <NameField
        label={t("Discount")}
        inputValue={discount}
        setInputValue={setDiscount}
        placeholder={t("Enter Discount")}
        regex="^[0-9]*\.?[0-9]*$"
      />

      {/* ── Received Quality ── */}
      <SelectField
        label={t("Received Quality")}
        required
        items={ReceivedQualityItems}
        selectedValue={receivedQuality}
        onValueChange={(val) => setReceivedQuality(val as ReceivedQualityTypes)}
        placeholder="Select Quality"
        errorMessage={error.receivedQuality}
      />

      {/* ── Received Date ── */}
      <DatePicker
        label={t("Received Date")}
        required
        date={receivedDate}
        onDateChange={setReceivedDate}
        errorMessage={error.receivedDate}
        defaultDate
      />

      {/* ── Notes ── */}
      <TextareaField
        label={t("Notes")}
        inputValue={notes && notes !== "null" ? notes : ""}
        setInputValue={setNotes}
        placeholder={t("Enter your Notes")}
      />
      {/* ── Photos ── */}
      <PurchasePhoto
        photo={uploadedImages}
        setPhoto={setUploadedImages}
        showImages={showImage}
        setShowImages={setShowImage}
        removeImages={removedImages}
        setRemoveImages={setRemovedImages}
      />

      {/* ── Upload button ── */}
      <Button variant="outline" onClick={handleImageUpload}>
        {t("Upload Images")}
      </Button>

      {/* ── Hidden file input ── */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ── Submit ── */}
      <Button onClick={handleSubmit} className="w-full">
        Update
      </Button>
    </div>
  );
};

export default PurchaseMaterialsEditScreen;
