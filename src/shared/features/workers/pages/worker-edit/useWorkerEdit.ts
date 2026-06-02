import { useContactValidate } from "../../../clients/components/ContactValidate/ContactValidate";
import { useWorkerInputValidate } from "../../components/InputValidate/WorkerInputValidate";
import { useWorkerCategoryService } from "@/shared/features/workers/service/WorkerCategoryService";
import { useContactService } from "@/shared/features/contacts/service/ContactService";
import type { GenderTypes, WorkerRequest, Worker } from "../../DTOs/WorkerProps";
import { WorkerCategoriesUrls, WorkersUrls } from "../../utils/urls";
import type { WorkerCategoryProps } from "../../DTOs/WorkerCategoryProps";
import { UpiTypes } from "../../../suppliers/DTOs/SupplierProps";
import { useWorkerService } from "@/shared/features/workers/service/WorkerService";
import type { Contact } from "../../../contacts/DTOs/ContactProps";
import { KYCTypes } from "../../../clients/DTOs/ClientProps";
import { ContactsUrls } from "../../../contacts/utils/urls";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const useWorkerEdit = (id: string, queryString: URLSearchParams) => {
  const navigate = useNavigate();

  const workerService = useWorkerService();
  const workerCategoryService = useWorkerCategoryService();
  const contactService = useContactService();

  const newContactId = queryString.get("contactId") || "";
  const newWorkerCategoryId = queryString.get("workerCategoryId") || "";

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [contactId, setContactId] = useState(newContactId);
  const [workerCategoryId, setWorkerCategoryId] = useState(newWorkerCategoryId);
  const [notes, setNotes] = useState<string>();
  const [gender, setGender] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>({ id: 0, name: "", contactDetails: [] });
  const [workerCategoryList, setWorkerCategoryList] = useState<WorkerCategoryProps[]>([]);
 const [workerCategory, setWorkerCategory] = useState<WorkerCategoryProps>({
  id: 0, name: "", note: "", isActive: true, workTypes: [], workerRoles: [],
});
const [loading, setLoading] = useState(true);

  const [workerDetails, setWorkerDetails] = useState<Worker | WorkerRequest>({
    id: 0,
    name: "",
    dateOfBirth,
    contact: { id: 0, name: "", contactDetails: [] },
    workerCategory: { id: 0, name: "", note: "", isActive: true, workTypes: [], workerRoles: [] },
    note: "",
    gender: gender as GenderTypes,
    kycDetails: [],
    bankAccounts: [],
    upiDetails: [],
    isActive: true,
  });

 const fetchWorker = async () => {
  setLoading(true); 
  try {
    const workerData: Worker = await workerService.getWorker(parseInt(id));
    setWorkerDetails(workerData);
    setName(workerData.name);
    setDateOfBirth(workerData.dateOfBirth);
    setNotes(workerData.note);
    setGender(workerData.gender);
    setIsActive(workerData.isActive as boolean);
    if (!newContactId) setContactId(workerData.contact.id.toString());
    if (!newWorkerCategoryId) setWorkerCategoryId(workerData.workerCategory.id.toString());
  } finally {
    setLoading(false);  
  }
};

  useEffect(() => { fetchWorker(); }, []);

  const fetchContacts = async (searchString: string = "") => {
    if (!searchString) return;
    const contacts = await contactService.getContacts(searchString, false);
    if (!contacts) return;
    if (contactId) {
      const validContacts = contacts.filter((item: Contact) => item.id !== parseInt(contactId));
      setContactList([contact, ...validContacts.slice(0, 3)]);
      return;
    }
    setContactList(contacts.slice(0, 3));
  };

  useEffect(() => {
    const fetchContactById = async () => {
      if (!contactId) return;
      const fetchedContact = await contactService.getContact(parseInt(contactId));
      setContact(fetchedContact);
      setContactList([fetchedContact]);
    };
    fetchContactById();
  }, [contactId]);

  const fetchWorkerCategories = async (searchString: string = "") => {
    if (!searchString) return;
    const workerCategories = await workerCategoryService.getWorkerCategories(searchString, false);
    if (!workerCategories) return;
    if (workerCategoryId) {
      const validWorkerCategories = workerCategories.filter(
        (item: WorkerCategoryProps) => item.id !== parseInt(workerCategoryId)
      );
      setWorkerCategoryList([workerCategory, ...validWorkerCategories.slice(0, 3)]);
      return;
    }
    setWorkerCategoryList(workerCategories.slice(0, 3));
  };

  useEffect(() => {
    const fetchWorkerCategoryById = async () => {
      if (!workerCategoryId) return;
      const fetchedCategory = await workerCategoryService.getWorkerCategory(parseInt(workerCategoryId));
      setWorkerCategory(fetchedCategory);
      setWorkerCategoryList([fetchedCategory]);
    };
    fetchWorkerCategoryById();
  }, [workerCategoryId]);

  const { genderItems, error, validate } = useWorkerInputValidate({
    name, dateOfBirth, workerCategoryId, contactId, gender,
  });
  const { primaryContactDetails, hasMoreDetails } = useContactValidate(contact);

  const contactDetails = contactList.map((item) => ({ label: item.name, value: item.id.toString() }));
  const workerCategoryDetails = workerCategoryList.map((item) => ({ 
  label: item.name,  
  value: item.id.toString() 
}));

  const validKycDetails = workerDetails.kycDetails.filter((item) => item.value);
  const validBankAccounts = workerDetails.bankAccounts.filter(
    (item) => item.accountName && item.accountNumber && item.ifscCode
  );
  const validUpiDetails = workerDetails.upiDetails.filter((item) => item.value);

  const isKycAddDisabled = [KYCTypes.AADHAAR, KYCTypes.PAN, KYCTypes.GST].every(
    (type) => workerDetails.kycDetails.some((item) => item.kycType === type && item.value)
  );
  const isBankAccountsAddDisabled = validBankAccounts.length >= 2;
  const isUpiAddDisabled = [UpiTypes.GPAY, UpiTypes.PHONEPE, UpiTypes.UPI_ID].every(
    (type) => workerDetails.upiDetails.some((item) => item.upiType === type && item.value)
  );

  const handleContactChange = (value: string) => setContactId(value);
  const handleWorkerCategoryChange = (value: string) => setWorkerCategoryId(value);

  const redirectUrl = WorkersUrls.edit(parseInt(id));
  const redirectParams = `${redirectUrl}?contactId=${contactId}&workerCategoryId=${workerCategoryId}`;

  const handleContactCreate = (searchString: string) => {
    navigate(`${ContactsUrls.create}?name=${searchString}&redirect=${encodeURIComponent(`${redirectUrl}?workerCategoryId=${workerCategoryId}`)}`);
  };

  const handleContactEdit = () => {
    navigate(`${ContactsUrls.edit(parseInt(contactId))}?redirect=${encodeURIComponent(redirectParams)}`);
  };

  const handleWorkerCategoryCreate = (searchString: string) => {
    navigate(`${WorkerCategoriesUrls.create}?workerCategoryName=${searchString}&redirect=${encodeURIComponent(`${redirectUrl}?contactId=${contactId}`)}`);
  };

  const handleWorkerCategoryEdit = () => {
    navigate(`${WorkerCategoriesUrls.edit(parseInt(workerCategoryId))}?redirect=${encodeURIComponent(redirectParams)}`);
  };

  const handleSubmission = async () => {
    if (validate()) {
      const worker = {
        name, gender: gender as GenderTypes, dateOfBirth,
        note: notes as string,
        workerCategoryId: parseInt(workerCategoryId),
        contactId: parseInt(contactId),
        kycDetails: validKycDetails,
        bankAccounts: validBankAccounts,
        upiDetails: validUpiDetails,
        isActive,
      };
      await workerService.updateWorker(parseInt(id), worker);
      navigate(WorkersUrls.list);
    }
  };

  return {
    name, setName,
    dateOfBirth, setDateOfBirth,
    genderItems,
    gender, setGender,
    notes, setNotes,
    isActive, setIsActive,
    workerDetails, setWorkerDetails,
    loading,
    error, navigate,
    handleSubmission,
    isKycAddDisabled, isBankAccountsAddDisabled, isUpiAddDisabled,
    contactDetails, workerCategoryDetails,
    contactId, workerCategoryId,
    handleWorkerCategoryCreate, handleWorkerCategoryEdit,
    handleContactCreate, handleContactEdit,
    handleContactChange, handleWorkerCategoryChange,
    fetchContacts, fetchWorkerCategories,
    contact, workerCategory,
    primaryContactDetails, hasMoreDetails,
  };
};

export { useWorkerEdit };