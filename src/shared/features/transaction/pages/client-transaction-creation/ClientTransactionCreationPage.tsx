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
import { useClientTransactionCreation } from './useClientTransactionCreation';
import PaymentMethodSelector from '../../components/PaymentMethodSelector/PaymentMethodSelector';
import { ClientTransactionUrls } from '../../utils/urls';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const ClientTransactionCreationPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    handleBack,
    handleSelect,
    handleSubmit,
    amount, setAmount,
    remark, setRemark,
    date, setDate,
    clientId, setClientId,
    fetchClients,
    clientDetails,
    paymentMethod,
    error,
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  } = useClientTransactionCreation();

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* ── Header ── */}
      <Header title={t('Create Client Transaction')} />

 <Card className="mt-4 p-6">
  <div className="flex flex-col gap-4">

    {/* Row 1: Client + Date */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ComboboxField
        id="client"
        label={t('Client')}
        items={clientDetails}
        selectedValue={clientId}
        onValueChange={setClientId}
        onSearch={fetchClients}
        required
        error={error.clientId}
      />
      <DatePicker
        label={t('Date')}
        date={date}
        onDateChange={setDate}
        required
        defaultDate
        errorMessage={error.date}
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
    />

    {/* Row 3: Payment Method — full width, 4 cards in one row */}
    
    <PaymentMethodSelector
      selectedMethod={paymentMethod}
      onSelect={handleSelect}
      required
      errorMessage={error.paymentMethod}
    />
   

    {/* Row 4: Remark — full width */}
    <TextareaField
      label={t('Remark')}
      inputValue={remark}
      setInputValue={setRemark}
      placeholder={t('Enter Remark')}
    />

    {/* Save / Cancel */}
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
                navigate(ClientTransactionUrls.list);
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
                {t('Save')}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default ClientTransactionCreationPage;