import { useNavigate } from 'react-router-dom';
import { Header } from '@/shared/components/Header/Header';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
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
import { useWorkerTransactionCreation } from './useWorkerTransactionCreation';
import PaymentMethodSelector from '../../components/PaymentMethodSelector/PaymentMethodSelector';
import { WorkerTransactionUrls } from '../../utils/urls';

const WorkerTransactionCreationPage = () => {
  const navigate = useNavigate();

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
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  } = useWorkerTransactionCreation();

  return (
    <div className="w-full min-h-screen px-4 pb-10">

      {/* ── Header ── */}
      <Header title="Create Worker Transaction" />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* Row 1: Worker + Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComboboxField
              id="worker"
              label="Worker"
              items={workerDetails}
              selectedValue={workerId}
              onValueChange={setWorkerId}
              onSearch={fetchWorkers}
              required
              error={error.clientId}
            />
            <DatePicker
              label="Date"
              date={date}
              onDateChange={setDate}
              required
              defaultDate
              errorMessage={error.date}
            />
          </div>

          {/* Row 2: Amount — full width */}
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

          {/* Row 3: Payment Method — full width */}
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelect={handleSelect}
            required
            errorMessage={error.paymentMethod}
          />

          {/* Row 4: Remark — full width */}
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
                Save
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default WorkerTransactionCreationPage;