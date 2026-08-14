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
import { useWorkerTransactionEdit } from './useWorkerTransactionEdit';
import PaymentMethodSelector from '../../components/PaymentMethodSelector/PaymentMethodSelector';
import { usePermission } from '@/shared/hooks/usePermission';
import { WorkerTransactionUrls } from '../../utils/urls';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const WorkerTransactionEditPage = () => {
  const navigate = useNavigate();
  const { canEdit } = usePermission();
  const editable = canEdit('Worker Transaction');
  const { t } = useLanguage();

  const {
    handleBack,
    handleSelect,
    handleSubmit,
    amount, setAmount,
    remark, setRemark,
    date, setDate,
    workerId, setWorkerId,
    fetchWorkers,
    workerDetails,
    paymentMethod,
    error,
    loading,
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  } = useWorkerTransactionEdit();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* ── Header ── */}
      <Header title={t('Edit Worker Transaction')} />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* ── Worker ── */}
          <ComboboxField
            id="worker"
            label={t('Worker')}
            items={workerDetails}
            selectedValue={workerId}
            onValueChange={setWorkerId}
            onSearch={fetchWorkers}
            required
            error={error.workerId}
            disabled={!editable}
          />

          {/* ── Date ── */}
          <DatePicker
            label={t('Date')}
            date={date}
            onDateChange={setDate}
            required
            errorMessage={error.date}
            disable={!editable}
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
            isDisabled={!editable}
          />

          {/* ── Payment Method ── */}
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelect={handleSelect}
            required
            errorMessage={error.paymentMethod}
            disable={!editable}
          />

          {/* ── Remark ── */}
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
                navigate(WorkerTransactionUrls.list);
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

export default WorkerTransactionEditPage;