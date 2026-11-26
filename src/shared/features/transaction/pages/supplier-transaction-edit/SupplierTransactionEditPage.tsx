import { useNavigate } from 'react-router-dom';
import { Header } from '@/shared/components/Header/Header';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { NameField } from '@/shared/components/FormFields/NameField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import { useSupplierTransactionEdit } from './useSupplierTransactionEdit';
import { UnsavedChangesDialog } from '@/shared/components/UnsavedChangesDialog/UnsavedChangesDialog';
import PaymentMethodSelector from '../../components/PaymentMethodSelector/PaymentMethodSelector';
import { usePermission } from '@/shared/hooks/usePermission';
import { SupplierTransactionUrls } from '../../utils/urls';
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { SkRow2, SkField, SkPaymentMethod, SkTextarea, SkButtons } from '@/shared/components/EditPageSkeleton/EditPageSkeleton';

const SupplierTransactionEditPage = () => {
  const navigate = useNavigate();
  const { canEdit } = usePermission();
  const editable = canEdit('Supplier Transaction');
  const { t } = useLanguage();

  const {
    handleBack,
    handleSelect,
    handleSubmit,
    amount, setAmount,
    remark, setRemark,
    date, setDate,
    supplierId, setSupplierId,
    fetchSuppliers,
    supplierDetails,
    paymentMethod,
    error,
    loading,
    showUnsavedDialog,
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
  } = useSupplierTransactionEdit();

  if (loading) {
    return (
      <div className="w-full min-h-screen px-4 pb-10">
        <Header title={t('Edit Supplier Transaction')} />
        <Card className="mt-4 p-6">
          <div className="flex flex-col gap-4">
            <SkRow2 />
            <SkField />
            <SkPaymentMethod />
            <SkTextarea />
            <SkButtons />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* ── Header ── */}
      <Header title={t('Edit Supplier Transaction')} />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* Row 1: Supplier + Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComboboxField
              id="supplier"
              label={t('Supplier')}
              items={supplierDetails}
              selectedValue={supplierId}
              onValueChange={setSupplierId}
              onSearch={fetchSuppliers}
              required
              error={error.supplierId}
              disabled={!editable}
            />
            <DatePicker
              label={t('Date')}
              date={date}
              onDateChange={setDate}
              required
              errorMessage={error.date}
              disable={!editable}
            />
          </div>

          {/* Row 2: Amount — full width */}
          <NameField
            label={t('Amount')}
            inputValue={amount}
            setInputValue={setAmount}
            placeholder={t('Enter Amount')}
            required
            regex="^[0-9]*(\.[0-9]*)?$"
            length={10}
            errorMessage={error.amount}
            isDisabled={!editable}
          />

          {/* Row 3: Payment Method — full width */}
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelect={handleSelect}
            required
            errorMessage={error.paymentMethod}
            disable={!editable}
          />

          {/* Row 4: Remark — full width */}
          <TextareaField
            label={t('Remark')}
            inputValue={remark}
            setInputValue={setRemark}
            placeholder={t('Enter Remark')}
            isDisabled={!editable}
          />

          {/* ── Save / Cancel ── */}
          <FormSubmissionButtons
            onSave={handleSubmit}
            onCancel={handleBack}
            disabled={!editable}
          />

        </div>
      </Card>

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onKeepEditing={handleKeepEditing}
        onDiscard={handleDiscardChanges}
        onSave={handleSaveFromDialog}
      />

    </div>
  );
};

export default SupplierTransactionEditPage;