// import { useState, useEffect, useCallback } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { toast } from 'sonner';
// import type { Client } from '@/shared/features/clients/DTOs/ClientProps';
// import { useClientService } from '@/shared/features/clients/service/ClientService';
// import { useInputValidate } from '../../components/InputValidate/ClientTransactionInputValidate';
// import { useClientTransactionService } from '../../service/ClientTransactionService';
// import type { ClientTransactionProps } from '../../DTOs/ClientTransaction';
// import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';
// import { formatDateToString } from '@/shared/features/attendance/utils/functions';
// import { ClientTransactionUrls } from '../../utils/urls';

// type PaymentMethodType = typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];

// const useClientTransactionEdit = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const clientService = useClientService();
//   const clientTransactionService = useClientTransactionService();
//   const [amount, setAmount] = useState('');
//   const [date, setDate] = useState('');
//   const [remark, setRemark] = useState('');
//   const [clientId, setClientId] = useState('');
//   const [clientList, setClientList] = useState<Client[]>([]);
//  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethodEnum.CASH);
//   const [clientTransaction, setClientTransaction] = useState<ClientTransactionProps>();
//   const [loading, setLoading] = useState(true);
//   const [showUnsavedDialog, setShowUnsavedDialog] = useState(false); // ✅ replaces Alert

//   const today = new Date();
//   const formatted = formatDateToString(today);

//   const { error, validate, setError, initialError } = useInputValidate({
//     clientId,
//     date,
//     amount,
//     paymentMethod,
//   });

//   const fetchClients = async (searchString: string = '') => {
//     const clients = await clientService.getClients(searchString);
//     if (!clients) return;
//     setClientList(searchString ? clients.slice(0, 3) : clients);
//   };

//   const clientDetails = clientList.map(item => ({
//     label: item.name,
//     value: item.id.toString(),
//   }));

//  const handleSelect = (id: string) => {
//   setPaymentMethod(id as PaymentMethodEnum);
// };

//   const hasUnsavedChanges = useCallback(() => {
//     return (
//       amount.trim() !== clientTransaction?.amount ||
//       remark.trim() !== clientTransaction?.remark ||
//       clientId.trim() !== clientTransaction?.client.id.toString() ||
//       date !== clientTransaction?.date ||
//       paymentMethod !== clientTransaction?.paymentMethod
//     );
//   }, [amount, remark, clientId, date, paymentMethod, clientTransaction]);

//   const resetFormFields = () => {
//     setAmount('');
//     setRemark('');
//     setClientId('');
//     setPaymentMethod(PaymentMethodEnum.CASH);
//     setDate(formatted);
//     setError(initialError);
//   };

//   const handleBack = () => {
//     if (hasUnsavedChanges()) {
//       setShowUnsavedDialog(true); // ✅ opens AlertDialog
//     } else {
//       resetFormFields();
//       navigate(ClientTransactionUrls.list);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;
//     try {
//       const payload = {
//         clientId,
//         date: date.trim(),
//         amount: amount.trim(),
//         paymentMethod,
//         remark: remark.trim(),
//       };

//       await clientTransactionService.updateClientTransaction(
//         parseInt(id!),
//         payload,
//       );
//       resetFormFields();
//       navigate(ClientTransactionUrls.list);
//     } catch (err: any) {
//       const errorMsg =
//         err?.response?.data?.[0]?.message || 'Failed to Edit Client Transaction';
//       toast.error(errorMsg);
//     }
//   };

//   const fetchClientTransaction = async () => {
//     setLoading(true);
//     try {
//       const data: ClientTransactionProps =
//         await clientTransactionService.getClientTransaction(parseInt(id!));
//       setAmount(data.amount);
//       setDate(data.date);
//       setClientId(data.client.id.toString());
//       setPaymentMethod(data.paymentMethod);
//       setRemark(data.remark);
//       setClientList([data.client]);
//       setClientTransaction(data);
//     } catch (error) {
//       console.error('ClientTransactionEdit: fetch failed', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClientTransaction();
//   }, [id]);

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
//     loading,
//     hasUnsavedChanges,
//     showUnsavedDialog,
//     setShowUnsavedDialog,
//     resetFormFields,
//   };
// };

// export { useClientTransactionEdit };


import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import type { Client } from '@/shared/features/clients/DTOs/ClientProps';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import { useClientService } from '@/shared/features/clients/service/ClientService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useInputValidate } from '../../components/InputValidate/ClientTransactionInputValidate';
import { useClientTransactionService } from '../../service/ClientTransactionService';
import type { ClientTransactionProps } from '../../DTOs/ClientTransaction';
import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';
import { formatDateToString } from '@/shared/features/attendance/utils/functions';
import { ClientTransactionUrls } from '../../utils/urls';

type PaymentMethodType = typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];

export interface SplitItem {
  siteId: string;
  siteName: string;
  amount: string;
}

const useClientTransactionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const clientService = useClientService();
  const siteService = useSiteService();
  const clientTransactionService = useClientTransactionService();

  const [date, setDate] = useState('');
  const [remark, setRemark] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientList, setClientList] = useState<Client[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethodEnum.CASH);
  const [clientTransaction, setClientTransaction] = useState<ClientTransactionProps>();
  const [loading, setLoading] = useState(true);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // Splits
  const [splits, setSplits] = useState<SplitItem[]>([]);
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [splitSiteId, setSplitSiteId] = useState('');
  const [splitSiteList, setSplitSiteList] = useState<Site[]>([]);
  const [allSplitSites, setAllSplitSites] = useState<Site[]>([]);
  const [splitAmount, setSplitAmount] = useState('');
  const [splitError, setSplitError] = useState({ siteId: '', amount: '' });

  const today = new Date();
  const formatted = formatDateToString(today);

  const totalAmount = splits
    .reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0)
    .toFixed(2);

  const { error, validate, setError, initialError } = useInputValidate({
    clientId,
    date,
    paymentMethod,
    splits,
  });

  const fetchClients = async (searchString: string = '') => {
    const clients = await clientService.getClients(searchString);
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

  const resetFormFields = () => {
    setDate(formatted);
    setRemark('');
    setClientId('');
    setPaymentMethod(PaymentMethodEnum.CASH);
    setSplits([]);
    setSplitSiteId('');
    setSplitAmount('');
    setSplitSiteList([]);
    setAllSplitSites([]);
    setSplitError({ siteId: '', amount: '' });
    setError(initialError);
  };

  const originalSplitsJson = JSON.stringify(
    (clientTransaction?.clientTransactionSplits ?? []).map(s => ({
      siteId: s.site.id.toString(),
      amount: s.amount,
    })),
  );

  const hasUnsavedChanges = useCallback(() => {
    return (
      date !== (clientTransaction?.date ?? '') ||
      remark.trim() !== (clientTransaction?.remark ?? '') ||
      clientId !== (clientTransaction?.client.id.toString() ?? '') ||
      paymentMethod !== (clientTransaction?.paymentMethod ?? PaymentMethodEnum.CASH) ||
      JSON.stringify(splits.map(s => ({ siteId: s.siteId, amount: s.amount }))) !==
        originalSplitsJson
    );
  }, [date, remark, clientId, paymentMethod, splits, clientTransaction, originalSplitsJson]);

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
      const payload = {
        clientId,
        date: date.trim(),
        totalAmount,
        paymentMethod,
        remark: remark.trim(),
        clientTransactionSplits: splits.map(s => ({
          siteId: parseInt(s.siteId, 10),
          amount: s.amount,
        })),
      };

      await clientTransactionService.updateClientTransaction(
        parseInt(id!),
        payload,
      );
      resetFormFields();
      navigate(ClientTransactionUrls.list);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.[0]?.message || 'Failed to Edit Client Transaction';
      toast.error(errorMsg);
    }
  };

  const fetchClientTransaction = async () => {
    setLoading(true);
    try {
      const data: ClientTransactionProps =
        await clientTransactionService.getClientTransaction(parseInt(id!));
      setDate(data.date);
      setClientId(data.client.id.toString());
      setPaymentMethod(data.paymentMethod);
      setRemark(data.remark ?? '');
      setClientList([data.client]);
      setSplits(
        (data.clientTransactionSplits ?? []).map(s => ({
          siteId: s.site.id.toString(),
          siteName: s.site.name,
          amount: s.amount,
        })),
      );
      setClientTransaction(data);
    } catch (error) {
      console.error('ClientTransactionEdit: fetch failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientTransaction();
  }, [id]);

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
    loading,
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

export { useClientTransactionEdit };