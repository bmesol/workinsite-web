import { useContactValidate } from "../../../clients/components/ContactValidate/ContactValidate";
import { useInputValidate } from "../../../suppliers/components/InputValidate/InputValidate";
import type { Supplier, SupplierRequest } from "../../DTOs/SupplierProps";
import { UpiTypes } from "../../DTOs/SupplierProps";
import { useContactService } from "@/shared/features/contacts/service/ContactService";
import { useSupplierService } from "@/shared/features/suppliers/service/SupplierService";
import type { Contact } from "../../../contacts/DTOs/ContactProps";
import { KYCTypes } from "../../../clients/DTOs/ClientProps";
import { ContactsUrls } from "../../../contacts/utils/urls";
import { SuppliersUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const useSupplierCreation = (queryString: URLSearchParams) => {
  const navigate = useNavigate();
  const supplierService = useSupplierService();
  const contactService = useContactService();
  const getQueryParam = (param: string) => queryString.get(param)?.trim() || "";

  const [name, setName] = useState(getQueryParam("name"));
  const [contactId, setContactId] = useState(getQueryParam("contactId"));
  const [notes, setNotes] = useState(getQueryParam("notes"));
  const [isActive, setIsActive] = useState(true);
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>({ id: 0, name: "", contactDetails: [] });

  const [supplierDetails, setSupplierDetails] = useState<Supplier | SupplierRequest>(
    {
      name: "",
      contactId: parseInt(contactId),
      note: "",
      kycDetails: [
        { kycType: KYCTypes.AADHAAR, value: getQueryParam("AADHAAR") },
        { kycType: KYCTypes.PAN, value: getQueryParam("PAN") },
        { kycType: KYCTypes.GST, value: getQueryParam("GST") },
      ],
      bankAccounts: [
        {
          accountName: getQueryParam("accountName1"),
          accountNumber: getQueryParam("accountNumber1"),
          ifscCode: getQueryParam("ifscCode1"),
        },
        {
          accountName: getQueryParam("accountName2"),
          accountNumber: getQueryParam("accountNumber2"),
          ifscCode: getQueryParam("ifscCode2"),
        },
      ],
      upiDetails: [
        { upiType: UpiTypes.GPAY, value: getQueryParam("GPAY") },
        { upiType: UpiTypes.PHONEPE, value: getQueryParam("PHONEPE") },
        { upiType: UpiTypes.UPI_ID, value: getQueryParam("UPI_ID") },
      ],
    } as SupplierRequest
  );

  const fetchContacts = async (searchString: string = "") => {
    if (!searchString) return;

    const contacts = await contactService.getContacts(searchString); // ✅ removed false
    if (!contacts) return;

    if (contactId) {
      const validContacts = contacts.filter((item: Contact) => item.id !== parseInt(contactId));
      setContactList([contact, ...validContacts.slice(0, 3)].filter(Boolean) as Contact[]);
      return;
    }
    setContactList(contacts.slice(0, 3));
  };

  useEffect(() => {
    const fetchContactById = async () => {
      if (contactId) {
        const found = await contactService.getContact(parseInt(contactId));
        setContact(found);
        setContactList([found]);
      }
    };
    fetchContactById();
  }, [contactId]);

  const { error, validate } = useInputValidate({ name, contactId });
  const { primaryContactDetails, hasMoreDetails } = useContactValidate(contact);
  const contactDetails = contactList.map((item) => ({ label: item.name, value: item.id.toString() }));

  const validKycDetails = supplierDetails.kycDetails.filter((item) => item.value);
  const validBankAccounts = supplierDetails.bankAccounts.filter(
    (item) => item.accountName && item.accountNumber && item.ifscCode
  );
  const validUpiDetails = supplierDetails.upiDetails.filter((item) => item.value);

  const isKycAddDisabled = [KYCTypes.AADHAAR, KYCTypes.PAN, KYCTypes.GST].every((type) =>
    supplierDetails.kycDetails.some((item) => item.kycType === type && item.value)
  );

  const isBankAccountsAddDisabled = validBankAccounts.length >= 2;

  const isUpiAddDisabled = [UpiTypes.GPAY, UpiTypes.PHONEPE, UpiTypes.UPI_ID].every((type) =>
    supplierDetails.upiDetails.some((item) => item.upiType === type && item.value)
  );

  const handleContactChange = (value: string) => setContactId(value);

  const redirectUrl = SuppliersUrls.create;
  const redirectParams = new URLSearchParams({ notes });
  if (validKycDetails) validKycDetails.map((item) => redirectParams.append(item.kycType, item.value));
  if (validUpiDetails) validUpiDetails.map((item) => redirectParams.append(item.upiType, item.value));
  if (validBankAccounts) {
    validBankAccounts.forEach((item, index) => {
      redirectParams.append("accountName" + (index + 1), item.accountName);
      redirectParams.append("accountNumber" + (index + 1), item.accountNumber);
      redirectParams.append("ifscCode" + (index + 1), item.ifscCode);
    });
  }

  const handleContactCreate = (searchString: string) => {
    const contactCreateParams = new URLSearchParams({
      name: searchString,
      redirect: `${redirectUrl}?${redirectParams.toString()}`,
    });
    navigate(`${ContactsUrls.create}?${contactCreateParams}`);
  };

  const handleContactEdit = (onClose?: () => void) => { 
    const redirectParamsWithContactId = new URLSearchParams(redirectParams);
    redirectParamsWithContactId.append("name", name);
    redirectParamsWithContactId.append("contactId", contactId);
    const contactEditParams = new URLSearchParams({
      redirect: `${redirectUrl}?${redirectParamsWithContactId.toString()}`,
    });
    navigate(`${ContactsUrls.edit(parseInt(contactId))}?${contactEditParams.toString()}`);
    onClose?.(); // ✅ replaces model.close()
  };

  const handleSubmission = async () => {
    if (validate()) {
      const supplier = {
        name,
        note: notes,
        contactId: parseInt(contactId),
        kycDetails: validKycDetails,
        bankAccounts: validBankAccounts,
        upiDetails: validUpiDetails,
        isActive,
      };
      await supplierService.createSupplier(supplier);
      navigate(SuppliersUrls.list);
    }
  };

  return {
    name,
    setName,
    notes,
    setNotes,
    isActive,
    setIsActive,
    supplierDetails,
    setSupplierDetails,
    error,
    navigate,
    handleSubmission,
    isKycAddDisabled,
    isBankAccountsAddDisabled,
    isUpiAddDisabled,
    contactDetails,
    contactId,
    handleContactCreate,
    handleContactChange,
    fetchContacts,
    contact,                  
    primaryContactDetails,
    hasMoreDetails,
    handleContactEdit,
  };
};

export { useSupplierCreation };