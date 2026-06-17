import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Header } from '@/shared/components/Header/Header';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { NameField } from '@/shared/components/FormFields/NameField';
import { TextareaField } from '@/shared/components/FormFields/TextareaField';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/components/ui/alert-dialog';
import { useSupplierTransactionCreation } from './useSupplierTransactionCreation';
import PaymentMethodSelector from '../../components/PaymentMethodSelector/PaymentMethodSelector';
import { SupplierTransactionUrls } from '../../utils/urls';

const SupplierTransactionCreationPage = () => {
  const navigate = useNavigate();

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
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  } = useSupplierTransactionCreation();

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* ── Header ── */}
      <Header title="Create Supplier Transaction" />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* ── Supplier ── */}
          <ComboboxField
            id="supplier"
            label="Supplier"
            items={supplierDetails}
            selectedValue={supplierId}
            onValueChange={setSupplierId}
            onSearch={fetchSuppliers}
            required
            error={error.clientId}
          />

          {/* ── Date ── */}
          <DatePicker
            label="Date"
            date={date}
            onDateChange={setDate}
            required
            defaultDate
            errorMessage={error.date}
          />

          {/* ── Amount ── */}
          <NameField
            label="Amount"
            inputValue={amount}
            setInputValue={setAmount}
            placeholder="Enter Amount"
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
            label="Remark"
            inputValue={remark}
            setInputValue={setRemark}
            placeholder="Enter Remark"
          />

          {/* ── Save / Cancel ── */}
          <FormSubmissionButtons
            onSave={handleSubmit}
            onCancel={handleBack}
          />

        </div>
      </Card>

      {/* ── Unsaved Changes Dialog ── */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save them before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                resetFormFields();
                navigate(SupplierTransactionUrls.list);
              }}
            >
              Exit without Saving
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={() => {
                  handleSubmit();
                  setShowUnsavedDialog(false);
                }}
              >
                Save
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default SupplierTransactionCreationPage;