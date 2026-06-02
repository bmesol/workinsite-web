import { useContactValidate } from "../../../clients/components/ContactValidate/ContactValidate";
import { useInputValidate } from "../../../suppliers/components/InputValidate/InputValidate";
import { UpiTypes } from "../../DTOs/SupplierProps";  
import type { Supplier, SupplierRequest } from "../../DTOs/SupplierProps";
import { useContactService } from "@/shared/features/contacts/service/ContactService";
import { useSupplierService } from "@/shared/features/suppliers/service/SupplierService";
import type { Contact } from "../../../contacts/DTOs/ContactProps";
import { KYCTypes } from "../../../clients/DTOs/ClientProps";
import { ContactsUrls } from "../../../contacts/utils/urls";
import { SuppliersUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const useSupplierEdit = (id: string, queryString: URLSearchParams) => {
  const navigate = useNavigate();
  const supplierService = useSupplierService();
  const contactService = useContactService();

  const newContactId = queryString.get("contactId") || "";
  const [name, setName] = useState("");
  const [contactId, setContactId] = useState(newContactId);
  const [notes, setNotes] = useState<string>();
  const [isActive, setIsActive] = useState(true);
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>({ id: 0, name: "", contactDetails: [] });
  const [contactEditOpen, setContactEditOpen] = useState(false); 
  const [loading, setLoading] = useState(true);

  const [supplierDetails, setSupplierDetails] = useState<Supplier | SupplierRequest>(
    {
      name: "",
      contact: { id: 0, name: "", contactDetails: [{}] },
      note: "",
      kycDetails: [{}],
      bankAccounts: [{}],
      upiDetails: [{}],
      isActive: true,
    } as Supplier
  );

  const fetchSupplier = async () => {
    setLoading(true); 
    try {
      const supplierData: Supplier = await supplierService.getSupplier(parseInt(id));
      setSupplierDetails(supplierData);
      setName(supplierData.name);
      setNotes(supplierData.note);
      setIsActive(supplierData.isActive as boolean);
      if (!newContactId) setContactId(supplierData.contact.id.toString());
    } finally {
      setLoading(false); 
    }
  };
  useEffect(() => { fetchSupplier(); }, []);

  const fetchContacts = async (searchString: string = "") => {
    if (searchString) {
      const contacts = await contactService.getContacts(searchString, false);
      if (contactId && contacts) {
        const validContacts = contacts.filter((item: Contact) => item.id !== parseInt(contactId));
        setContactList([contact, validContacts.slice(0, 3)].flat());
        return;
      }
      if (contacts) setContactList(contacts.slice(0, 3));
    }
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

  const isKycAddDisabled = [KYCTypes.AADHAAR, KYCTypes.PAN, KYCTypes.GST].every(
    (type) => supplierDetails.kycDetails.some((item) => item.kycType === type && item.value)
  );

  const isBankAccountsAddDisabled = supplierDetails.bankAccounts.length >= 2;

  const isUpiAddDisabled = [UpiTypes.GPAY, UpiTypes.PHONEPE, UpiTypes.UPI_ID].every(
    (type) => supplierDetails.upiDetails.some((item) => item.upiType === type && item.value)
  );

  const handleContactChange = (value: string) => setContactId(value);

  const handleContactCreate = (searchString: string) => {
    const redirectParams = new URLSearchParams({ name: searchString, redirect: `${SuppliersUrls.edit(parseInt(id))}?` });
    navigate(`${ContactsUrls.create}?${redirectParams.toString()}`);
  };

  const handleContactEdit = () => {
    const redirectParams = new URLSearchParams({ redirect: `${SuppliersUrls.edit(parseInt(id))}?contactId=${contactId}` });
    navigate(`${ContactsUrls.edit(parseInt(contactId))}?${redirectParams.toString()}`);
    setContactEditOpen(false);
  };

  const handleSubmission = async () => {
    if (validate()) {
      const supplier = {
        name,
        note: notes as string,
        contactId: parseInt(contactId),
        kycDetails: supplierDetails.kycDetails,
        bankAccounts: supplierDetails.bankAccounts,
        upiDetails: supplierDetails.upiDetails,
        isActive,
      };
      await supplierService.updateSupplier(parseInt(id), supplier);
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
    loading,
    contactEditOpen,      
    setContactEditOpen,   
    primaryContactDetails,
    hasMoreDetails,
    handleContactEdit,
  };
};

export { useSupplierEdit };