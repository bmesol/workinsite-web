import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { NameField } from '@/shared/components/FormFields/NameField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import { SelectField } from '@/shared/components/FormFields/SelectField';
import PurchasePhoto from '../purchase-photo/PurchasePhoto';
import { usePurchaseMaterialsCreation } from './usePurchaseMaterialCreation';
import type {
  PurchaseMaterialCreationListProps,
  PurchaseMaterialUpdationListProps,
} from '../../DTOs/PurchaseMaterialProps';
import type { ReceivedQualityTypes } from '../../DTOs/PurchaseProps';
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { UploadButton } from '@/shared/components/UploadButton/UploadButton';

interface PurchaseMaterialsProps {
  purchaseMaterials: PurchaseMaterialCreationListProps[];
  setPurchaseMaterials: (value: PurchaseMaterialCreationListProps[]) => void;
  onClose?: () => void;
  addPurchaseMaterial: (item: PurchaseMaterialCreationListProps) => void;
  updatedPurchaseMaterials?: PurchaseMaterialUpdationListProps[];
}

const PurchaseMaterialsCreationScreen: React.FC<PurchaseMaterialsProps> = ({
  purchaseMaterials,
  setPurchaseMaterials,
  onClose,
  addPurchaseMaterial,
  updatedPurchaseMaterials,
}) => {
  const { t } = useLanguage();

  const {
    materialId,
    setMaterialId,

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
    handleAddPurchaseItem,
    error,
  } = usePurchaseMaterialsCreation({
    purchaseMaterials,
    setPurchaseMaterials,
    onClose,
    addPurchaseMaterial,
    updatedPurchaseMaterials,
  });

  return (
   <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto px-2 py-2 pr-2">

      {/* Material */}
      <ComboboxField
        id="material"
        label={t("Material")}
        items={materialDetails}
        selectedValue={materialId}
        onValueChange={setMaterialId}
        onSearch={fetchMaterials}
        required={true}
        error={error.materialId}
        className="bg-transparent dark:bg-transparent"
      />

     <NameField
        label={t("Received Quantity")}
        inputValue={receivedQuantity}
        setInputValue={setReceivedQuantity}
        placeholder={t("Enter Received Quantity")}
        required={true}
        regex="^[0-9]*\.?[0-9]*$"
        errorMessage={error.receivedQuantity}
        inputClassName="bg-transparent dark:bg-transparent"
      />

      {/* Rate */}
      <NameField
        label={t("Rate (₹/Unit)")}
        inputValue={rate}
        setInputValue={setRate}
        placeholder={t("Enter Rate")}
        required={true}
        regex="^[0-9]*\.?[0-9]*$"
        errorMessage={error.rate}
      />

      {/* Additional Charges */}
      <NameField
        label={t("Additional Charges")}
        inputValue={additionalCharges}
        setInputValue={setAdditionalCharges}
        placeholder={t("Enter Additional Charges")}
        regex="^[0-9]*\.?[0-9]*$"
      />

      {/* Discount */}
      <NameField
        label={t("Discount")}
        inputValue={discount}
        setInputValue={setDiscount}
        placeholder={t("Enter Discount")}
        regex="^[0-9]*\.?[0-9]*$"
      />

      {/* Received Quality */}
    <SelectField
  label={t("Received Quality")}
  items={ReceivedQualityItems}
  selectedValue={receivedQuality}
  onValueChange={(val) => setReceivedQuality(val as ReceivedQualityTypes)}
  required={true}
  errorMessage={error.receivedQuality}
/>

      {/* Received Date */}
      <DatePicker
        label={t("Received Date")}
        date={receivedDate}
        onDateChange={setReceivedDate}
        required={true}
        errorMessage={error.receivedDate}
        defaultDate={true}
        className="bg-transparent dark:bg-transparent"
      />

      {/* Received Quantity */}


      {/* Notes */}
      <TextareaField
        label={t("Notes")}
        inputValue={notes}
        setInputValue={setNotes}
        placeholder={t("Enter your Notes")}
      />

      {/* Purchase Photos */}
      <PurchasePhoto
        photo={uploadedImages}
        setPhoto={setUploadedImages}
      />

      {/* Image Upload */}
      <div className="flex">
        <UploadButton
          text={t("Upload Images")}
          onFilesSelected={handleImageUpload}
        />
      </div>

      {/* Add Button */}
      <Button onClick={handleAddPurchaseItem} className="w-full">
        {t("Add")}
      </Button>

    </div>
  );
};

export default PurchaseMaterialsCreationScreen;
