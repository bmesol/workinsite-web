import { Card } from '@/shared/components/ui/card';
import { Header } from '@/shared/components/Header/Header';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { NameField } from '@/shared/components/FormFields/NameField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import { useSupplierTransactionCreation } from './useSupplierTransactionCreation';
import { UnsavedChangesDialog } from '@/shared/components/UnsavedChangesDialog/UnsavedChangesDialog';
import PaymentMethodSelector from '../../components/PaymentMethodSelector/PaymentMethodSelector';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const SupplierTransactionCreationPage = () => {
  const { t } = useLanguage();

  const {
    handleCancel,
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
    showUnsavedDialog,
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
  } = useSupplierTransactionCreation();

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* ── Header ── */}
      <Header title={t('Create Supplier Transaction')} />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* ── Supplier ── */}
          <ComboboxField
            id="supplier"
            label={t('Supplier')}
            items={supplierDetails}
            selectedValue={supplierId}
            onValueChange={setSupplierId}
            onSearch={fetchSuppliers}
            required
            error={error.supplierId}
          />

          {/* ── Date ── */}
          <DatePicker
            label={t('Date')}
            date={date}
            onDateChange={setDate}
            required
            defaultDate
            errorMessage={error.date}
          />

          {/* ── Amount ── */}
          <NameField
            label={t('Amount')}
            inputValue={amount}
            setInputValue={setAmount}
            placeholder={t('Enter Amount')}
            required
            regex="^[0-9]*(\.[0-9]*)?$"
            length={10}
            errorMessage={error.amount}
          />

          {/* ── Payment Method ── */}
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelect={handleSelect}
            required
            errorMessage={error.paymentMethod}
          />

          {/* ── Remark ── */}
          <TextareaField
            label={t('Remark')}
            inputValue={remark}
            setInputValue={setRemark}
            placeholder={t('Enter Remark')}
          />

          {/* ── Save / Cancel ── */}
          <FormSubmissionButtons
            onSave={handleSubmit}
            onCancel={handleCancel}
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

export default SupplierTransactionCreationPage;