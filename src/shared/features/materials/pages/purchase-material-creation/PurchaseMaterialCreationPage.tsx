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
        label="Material"
        items={materialDetails}
        selectedValue={materialId}
        onValueChange={setMaterialId}
        onSearch={fetchMaterials}
        required={true}
        error={error.materialId}
      />

     <NameField
        label="Received Quantity"
        inputValue={receivedQuantity}
        setInputValue={setReceivedQuantity}
        placeholder="Enter Received Quantity"
        required={true}
        regex="^[0-9]*\.?[0-9]*$"
        errorMessage={error.receivedQuantity}
      />

      {/* Rate */}
      <NameField
        label="Rate (₹/Unit)"
        inputValue={rate}
        setInputValue={setRate}
        placeholder="Enter Rate"
        required={true}
        regex="^[0-9]*\.?[0-9]*$"
        errorMessage={error.rate}
      />

      {/* Additional Charges */}
      <NameField
        label="Additional Charges"
        inputValue={additionalCharges}
        setInputValue={setAdditionalCharges}
        placeholder="Enter Additional Charges"
        regex="^[0-9]*\.?[0-9]*$"
      />

      {/* Discount */}
      <NameField
        label="Discount"
        inputValue={discount}
        setInputValue={setDiscount}
        placeholder="Enter Discount"
        regex="^[0-9]*\.?[0-9]*$"
      />

      {/* Received Quality */}
    <SelectField
  label="Received Quality"
  items={ReceivedQualityItems}
  selectedValue={receivedQuality}
  onValueChange={(val) => setReceivedQuality(val as ReceivedQualityTypes)}
  required={true}
  errorMessage={error.receivedQuality}
/>

      {/* Received Date */}
      <DatePicker
        label="Received Date"
        date={receivedDate}
        onDateChange={setReceivedDate}
        required={true}
        errorMessage={error.receivedDate}
        defaultDate={true}
      />

      {/* Received Quantity */}
      

      {/* Notes */}
      <TextareaField
        label="Notes"
        inputValue={notes}
        setInputValue={setNotes}
        placeholder="Enter your notes"
      />

      {/* Purchase Photos */}
      <PurchasePhoto
        photo={uploadedImages}
        setPhoto={setUploadedImages}
      />

      {/* Image Upload */}
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

      {/* Add Button */}
      <Button onClick={handleAddPurchaseItem} className="w-full">
        Add
      </Button>

    </div>
  );
};

export default PurchaseMaterialsCreationScreen;