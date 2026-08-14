// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/shared/components/ui/button';
// import { Card } from '@/shared/components/ui/card';
// import { Header } from '@/shared/components/Header/Header';
// import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
// import { NameField } from '@/shared/components/FormFields/NameField';
// import { TextareaField } from '@/shared/components/FormFields/TextareaField';
// import { DatePicker } from '@/shared/components/FormFields/DatePicker';
// import { FormSubmissionButtons } from '@/shared/components/FormFields/FormSubmissionButton';
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from '@/shared/components/ui/alert-dialog';
// import { useClientTransactionCreation } from './useClientTransactionCreation';
// import PaymentMethodSelector from '../../components/PaymentMethodSelector/PaymentMethodSelector';
// import { ClientTransactionUrls } from '../../utils/urls';
// import { useLanguage } from '@/shared/hooks/useLanguageContext';

// const ClientTransactionCreationPage = () => {
//   const navigate = useNavigate();
//   const { t } = useLanguage();

//   const {
//     handleBack,
//     handleSelect,
//     handleSubmit,
//     amount, setAmount,
//     remark, setRemark,
//     date, setDate,
//     clientId, setClientId,
//     fetchClients,
//     clientDetails,
//     paymentMethod,
//     error,
//     showUnsavedDialog,
//     setShowUnsavedDialog,
//     resetFormFields,
//   } = useClientTransactionCreation();

//   return (
//     <div className="w-full min-h-screen px-4 pb-10">

//       {/* ── Header ── */}
//       <Header title={t('Create Client Transaction')} />

//  <Card className="mt-4 p-6">
//   <div className="flex flex-col gap-4">

//     {/* Row 1: Client + Date */}
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <ComboboxField
//         id="client"
//         label={t('Client')}
//         items={clientDetails}
//         selectedValue={clientId}
//         onValueChange={setClientId}
//         onSearch={fetchClients}
//         required
//         error={error.clientId}
//       />
//       <DatePicker
//         label={t('Date')}
//         date={date}
//         onDateChange={setDate}
//         required
//         defaultDate
//         errorMessage={error.date}
//       />
//     </div>

//     {/* Row 2: Amount — full width */}
//     <NameField
//       label={t('Amount')}
//       inputValue={amount}
//       setInputValue={setAmount}
//       placeholder={t('Enter Amount')}
//       required
//       regex="^[0-9]*(\.[0-9]*)?$"
//       length={10}
//       errorMessage={error.amount}
//     />

//     {/* Row 3: Payment Method — full width, 4 cards in one row */}
    
//     <PaymentMethodSelector
//       selectedMethod={paymentMethod}
//       onSelect={handleSelect}
//       required
//       errorMessage={error.paymentMethod}
//     />
   

//     {/* Row 4: Remark — full width */}
//     <TextareaField
//       label={t('Remark')}
//       inputValue={remark}
//       setInputValue={setRemark}
//       placeholder={t('Enter Remark')}
//     />

//     {/* Save / Cancel */}
//     <FormSubmissionButtons
//       onSave={handleSubmit}
//       onCancel={handleBack}
//     />

//   </div>
// </Card>

//       {/* ── Unsaved Changes Dialog ── */}
//       <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
//             <AlertDialogDescription>
//               You have unsaved changes. Do you want to save them before leaving?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel
//               onClick={() => {
//                 resetFormFields();
//                 navigate(ClientTransactionUrls.list);
//               }}
//             >
//               Exit without Saving
//             </AlertDialogCancel>
//             <AlertDialogAction asChild>
//               <Button
//                 onClick={() => {
//                   handleSubmit();
//                   setShowUnsavedDialog(false);
//                 }}
//               >
//                 {t('Save')}
//               </Button>
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//     </div>
//   );
// };

// export default ClientTransactionCreationPage;


import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { useClientTransactionCreation } from './useClientTransactionCreation';
import { FormActionButton } from '@/shared/components/FormActionButton/FormActionButton';
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
    remark, setRemark,
    date, setDate,
    clientId, setClientId,
    fetchClients,
    clientDetails,
    paymentMethod,
    error,
    splits,
    totalAmount,
    splitSiteId, setSplitSiteId,
    splitSiteDetails,
    fetchSplitSites,
    splitAmount, setSplitAmount,
    splitError,
    showSplitDialog,
    openSplitDialog,
    closeSplitDialog,
    handleAddSplit,
    handleRemoveSplit,
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

          {/* Row 2: Payment Method */}
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelect={handleSelect}
            required
            errorMessage={error.paymentMethod}
          />

          {/* Row 3: Site Splits */}
          <div>
            <FormActionButton
              heading={t('Site Split')}
              label={t('Add')}
              onClick={openSplitDialog}
              isColsTwo={true}
              required
              errorMessage={error.splits}
            />

            {splits.map((split, index) => (
              <div
                key={index}
                className={`flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-1.5 ${index === 0 ? 'mt-2' : ''}`}
              >
                <div className="flex-1 mr-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{split.siteName}</p>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">₹{split.amount}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSplit(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {splits.length > 0 && (
              <div className="flex items-center justify-between px-1 mt-2">
                <span className="text-sm font-semibold text-gray-700">{t('Total Amount')}</span>
                <span className="text-base font-bold text-green-600">₹{totalAmount}</span>
              </div>
            )}
          </div>

          {/* Row 4: Remark */}
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

      {/* ── Add Split Dialog ── */}
      <Dialog open={showSplitDialog} onOpenChange={(open) => !open && closeSplitDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Add Site Split')}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <ComboboxField
              id="split-site"
              label={t('Site')}
              items={splitSiteDetails}
              selectedValue={splitSiteId}
              onValueChange={setSplitSiteId}
              onSearch={fetchSplitSites}
              required
              error={splitError.siteId}
              listClassName="max-h-[200px]"
            />
            <NameField
              label={t('Amount')}
              inputValue={splitAmount}
              setInputValue={setSplitAmount}
              placeholder={t('Enter Amount')}
              required
              regex="^[0-9]*(\.[0-9]*)?$"
              length={10}
              errorMessage={splitError.amount}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeSplitDialog}>
              {t('Cancel')}
            </Button>
            <Button onClick={handleAddSplit}>
              {t('Add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Unsaved Changes Dialog ── */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Unsaved Changes')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('You have unsaved changes. Do you want to save them before leaving?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                resetFormFields();
                navigate(ClientTransactionUrls.list);
              }}
            >
              {t('Exit without Saving')}
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