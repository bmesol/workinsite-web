// import { useCallback, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { useClientService } from '@/shared/features/clients/service/ClientService';
// import { useClientTransactionService } from '../../service/ClientTransactionService';
// import { useInputValidate } from '../../components/InputValidate/ClientTransactionInputValidate';
// import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';

// import { formatDateToString } from '@/shared/utils/function';
// import { ClientTransactionUrls } from '../../utils/urls';
// import type { Client } from '@/shared/features/clients/DTOs/ClientProps';

// const useClientTransactionCreation = () => {
//   const navigate = useNavigate();
//   const clientService = useClientService();
//   const clientTransactionService = useClientTransactionService();

//   const today = new Date();
//   const formatted = formatDateToString(today);

//   const [amount, setAmount] = useState('');
//   const [date, setDate] = useState(formatted);
//   const [remark, setRemark] = useState('');
//   const [clientId, setClientId] = useState('');
//   const [clientList, setClientList] = useState<Client[]>([]);
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(PaymentMethodEnum.CASH);
//   const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

//   const { error, validate, setError, initialError } = useInputValidate({
//     clientId,
//     date,
//     amount,
//     paymentMethod,
//   });

//   const resetFormFields = () => {
//     setAmount('');
//     setRemark('');
//     setClientId('');
//     setPaymentMethod(PaymentMethodEnum.CASH);
//     setDate(formatted);
//     setError(initialError);
//   };

//   const fetchClients = async (searchString: string = '') => {
//     const clients = await clientService.getClients(searchString, false);
//     if (!clients) return;
//     setClientList(searchString ? clients.slice(0, 3) : clients);
//   };

//   const clientDetails = clientList.map(item => ({
//     label: item.name,
//     value: item.id.toString(),
//   }));


// const handleSelect = (id: string) => {
//   setPaymentMethod(id as PaymentMethodEnum);
// };
//   const hasUnsavedChanges = useCallback(() =>
//     amount.trim() !== '' ||
//     remark.trim() !== '' ||
//     clientId !== '' ||
//     date !== formatted ||
//     paymentMethod !== PaymentMethodEnum.CASH,
//   [amount, remark, clientId, date, paymentMethod, formatted]);

//   const handleBack = () => {
//     if (hasUnsavedChanges()) {
//       setShowUnsavedDialog(true);
//     } else {
//       resetFormFields();
//       navigate(ClientTransactionUrls.list);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;
//     try {
//       await clientTransactionService.createClientTransaction({
//         clientId,
//         date: date.trim(),
//         amount: amount.trim(),
//         paymentMethod,
//         remark: remark.trim(),
//       });
//       resetFormFields();
//       navigate(ClientTransactionUrls.list);
//     } catch (err: any) {
//       toast.error(
//         err?.response?.data?.[0]?.message ||
//         err?.response?.data?.message ||
//         'Failed to Create Client Transaction.',
//       );
//     }
//   };

//   return {
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
//     hasUnsavedChanges,
//     showUnsavedDialog,
//     setShowUnsavedDialog,
//     resetFormFields,
//   };
// };

// export { useClientTransactionCreation };


import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useClientService } from '@/shared/features/clients/service/ClientService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useClientTransactionService } from '../../service/ClientTransactionService';
import { useInputValidate } from '../../components/InputValidate/ClientTransactionInputValidate';
import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';

import { formatDateToString } from '@/shared/utils/function';
import { ClientTransactionUrls } from '../../utils/urls';
import type { Client } from '@/shared/features/clients/DTOs/ClientProps';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';

export interface SplitItem {
  siteId: string;
  siteName: string;
  amount: string;
}

const useClientTransactionCreation = () => {
  const navigate = useNavigate();
  const clientService = useClientService();
  const siteService = useSiteService();
  const clientTransactionService = useClientTransactionService();

  const today = new Date();
  const formatted = formatDateToString(today);

  const [date, setDate] = useState(formatted);
  const [remark, setRemark] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientList, setClientList] = useState<Client[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(PaymentMethodEnum.CASH);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // Splits
  const [splits, setSplits] = useState<SplitItem[]>([]);
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [splitSiteId, setSplitSiteId] = useState('');
  const [splitSiteList, setSplitSiteList] = useState<Site[]>([]);
  const [allSplitSites, setAllSplitSites] = useState<Site[]>([]);
  const [splitAmount, setSplitAmount] = useState('');
  const [splitError, setSplitError] = useState({ siteId: '', amount: '' });

  const totalAmount = splits
    .reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0)
    .toFixed(2);

  const { error, validate, setError, initialError } = useInputValidate({
    clientId,
    date,
    paymentMethod,
    splits,
  });

  const resetFormFields = () => {
    setRemark('');
    setClientId('');
    setPaymentMethod(PaymentMethodEnum.CASH);
    setDate(formatted);
    setSplits([]);
    setSplitSiteId('');
    setSplitAmount('');
    setSplitSiteList([]);
    setAllSplitSites([]);
    setSplitError({ siteId: '', amount: '' });
    setError(initialError);
  };

  const fetchClients = async (searchString: string = '') => {
    const clients = await clientService.getClients(searchString, false);
    if (!clients) return;
    setClientList(searchString ? clients.slice(0, 3) : clients);
  };

  const fetchSplitSites = async (searchString: string = '') => {
    let source = allSplitSites;
    if (!source.length) {
      const sites = await siteService.getSites({ status: 'Working' });
      if (!sites) return;
      setAllSplitSites(sites);
      source = sites;
    }
    const lower = searchString.toLowerCase();
    setSplitSiteList(
      searchString ? source.filter(s => s.name.toLowerCase().includes(lower)) : source,
    );
  };

  const clientDetails = clientList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const splitSiteDetails = splitSiteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const handleSelect = (id: string) => {
    setPaymentMethod(id as PaymentMethodEnum);
  };

  const openSplitDialog = () => setShowSplitDialog(true);

  const closeSplitDialog = () => {
    setShowSplitDialog(false);
    setSplitSiteId('');
    setSplitAmount('');
    setSplitSiteList([]);
    setSplitError({ siteId: '', amount: '' });
  };

  const handleAddSplit = () => {
    const errs = { siteId: '', amount: '' };
    let valid = true;
    if (!splitSiteId) { errs.siteId = 'Please select site'; valid = false; }
    else if (splits.some(s => s.siteId === splitSiteId)) { errs.siteId = 'This site is already added'; valid = false; }
    if (!splitAmount || isNaN(Number(splitAmount))) { errs.amount = 'Please enter valid amount'; valid = false; }
    setSplitError(errs);
    if (!valid) return;

    const site = splitSiteList.find(s => s.id.toString() === splitSiteId);
    setSplits(prev => [...prev, { siteId: splitSiteId, siteName: site?.name ?? '', amount: splitAmount }]);
    closeSplitDialog();
  };

  const handleRemoveSplit = (index: number) => {
    setSplits(prev => prev.filter((_, i) => i !== index));
  };

  const hasUnsavedChanges = useCallback(() =>
    remark.trim() !== '' ||
    clientId !== '' ||
    date !== formatted ||
    paymentMethod !== PaymentMethodEnum.CASH ||
    splits.length > 0,
  [remark, clientId, date, paymentMethod, splits, formatted]);

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      resetFormFields();
      navigate(ClientTransactionUrls.list);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await clientTransactionService.createClientTransaction({
        clientId,
        date: date.trim(),
        totalAmount,
        paymentMethod,
        remark: remark.trim(),
        clientTransactionSplits: splits.map(s => ({
          siteId: parseInt(s.siteId, 10),
          amount: s.amount,
        })),
      });
      resetFormFields();
      navigate(ClientTransactionUrls.list);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.[0]?.message ||
        err?.response?.data?.message ||
        'Failed to Create Client Transaction.',
      );
    }
  };

  return {
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
    hasUnsavedChanges,
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  };
};

export { useClientTransactionCreation };