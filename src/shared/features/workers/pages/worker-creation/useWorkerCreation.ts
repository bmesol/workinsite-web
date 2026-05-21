import { useContactValidate } from "@/shared/features/clients/components/ContactValidate/ContactValidate";
import { useWorkerInputValidate } from "../../components/InputValidate/WorkerInputValidate";
import { useWorkerCategoryService } from "../../service/WorkerCategoryService";
import { useContactService } from "@/shared/features/contacts/service/ContactService";
import type { GenderTypes, WorkerRequest, Worker } from "../../DTOs/WorkerProps";
import { WorkerCategoriesUrls, WorkersUrls } from "../../utils/urls";
import type { WorkerCategoryProps } from "../../DTOs/WorkerCategoryProps";
import { UpiTypes } from "../../../suppliers/DTOs/SupplierProps";
import { useWorkerService } from "../../service/WorkerService";
import type { Contact } from "../../../contacts/DTOs/ContactProps";
import { KYCTypes } from "../../../clients/DTOs/ClientProps";
import { ContactsUrls } from "../../../contacts/utils/urls";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const useWorkerCreation = (queryString: URLSearchParams) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef({ 
    open: () => setIsModalOpen(true), 
    close: () => setIsModalOpen(false) 
  });
  const model = modalRef.current;

  const workerService = useWorkerService();
  const workerCategoryService = useWorkerCategoryService();
  const contactService = useContactService();

  const getQueryParam = (param: string) => queryString.get(param)?.trim() || "";

  const [name, setName] = useState(getQueryParam("name"));
  const [dateOfBirth, setDateOfBirth] = useState(getQueryParam("dateOfBirth"));
  const [contactId, setContactId] = useState(getQueryParam("contactId"));
  const [workerCategoryId, setWorkerCategoryId] = useState(getQueryParam("workerCategoryId"));
  const [notes, setNotes] = useState(getQueryParam("notes"));
  const [gender, setGender] = useState(getQueryParam("gender") as GenderTypes);

  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>({ id: 0, name: "", contactDetails: [] });
  const [workerCategoryList, setWorkerCategoryList] = useState<WorkerCategoryProps[]>([]);
  const [workerCategory, setWorkerCategory] = useState<WorkerCategoryProps>({
    id: 0,
    workerCategoryName: "",
    note: "",
    isActive: true,
  });

  const [workerDetails, setWorkerDetails] = useState<Worker | WorkerRequest>({
    name: "",
    dateOfBirth,
    contactId: parseInt(contactId),
    workerCategoryId: parseInt(workerCategoryId),
    note: "",
    gender,
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
  } as WorkerRequest);

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
      const validCategories = workerCategories.filter(
        (item: WorkerCategoryProps) => item.id !== parseInt(workerCategoryId)
      );
      setWorkerCategoryList([workerCategory, ...validCategories.slice(0, 3)]);
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
    name,
    dateOfBirth,
    workerCategoryId,
    contactId,
    gender,
  });
  const { primaryContactDetails, hasMoreDetails } = useContactValidate(contact);

  const contactDetails = contactList.map((item) => ({
    label: item.name,
    value: item.id.toString(),
  }));
  const workerCategoryDetails = workerCategoryList.map((item) => ({
    label: item.workerCategoryName,
    value: item.id.toString(),
  }));

  const validKycDetails = workerDetails.kycDetails.filter((item) => item.value);
  const validBankAccounts = workerDetails.bankAccounts.filter(
    (item) => item.accountName && item.accountNumber && item.ifscCode
  );
  const validUpiDetails = workerDetails.upiDetails.filter((item) => item.value);

  const isKycAddDisabled = [KYCTypes.AADHAAR, KYCTypes.PAN, KYCTypes.GST].every((type) =>
    workerDetails.kycDetails.some((item) => item.kycType === type && item.value)
  );
  const isBankAccountsAddDisabled = validBankAccounts.length >= 2;
  const isUpiAddDisabled = [UpiTypes.GPAY, UpiTypes.PHONEPE, UpiTypes.UPI_ID].every((type) =>
    workerDetails.upiDetails.some((item) => item.upiType === type && item.value)
  );

  const handleContactChange = (value: string) => setContactId(value);
  const handleWorkerCategoryChange = (value: string) => setWorkerCategoryId(value);

  // ✅ Shared redirect params builder — avoids repetition
  const buildRedirectParams = () => {
    const params = new URLSearchParams({ dateOfBirth, gender, notes });
    validKycDetails.forEach((item) => params.append(item.kycType, item.value));
    validUpiDetails.forEach((item) => params.append(item.upiType, item.value));
    validBankAccounts.forEach((item, index) => {
      params.append(`accountName${index + 1}`, item.accountName);
      params.append(`accountNumber${index + 1}`, item.accountNumber);
      params.append(`ifscCode${index + 1}`, item.ifscCode);
    });
    return params;
  };

  const handleContactCreate = (searchString: string) => {
    const redirectParams = buildRedirectParams();
    const contactCreateParams = new URLSearchParams({
      name: searchString,
      redirect: `${WorkersUrls.create}?${redirectParams.toString()}`,
      workerCategoryId,
    });
    navigate(`${ContactsUrls.create}?${contactCreateParams}`);
  };

  const handleContactEdit = () => {
    const redirectParams = buildRedirectParams();
    redirectParams.append("name", name);
    redirectParams.append("contactId", contactId);
    redirectParams.append("workerCategoryId", workerCategoryId);
    const contactEditParams = new URLSearchParams({
      redirect: `${WorkersUrls.create}?${redirectParams.toString()}`,
    });
    navigate(`${ContactsUrls.edit(parseInt(contactId))}?${contactEditParams.toString()}`);
    model.close();
  };

  const handleWorkerCategoryCreate = (searchString: string) => {
    const redirectParams = buildRedirectParams();
    const redirect = `${WorkersUrls.create}?${redirectParams.toString()}&name=${name}&contactId=${contactId}`;
    navigate(
      `${WorkerCategoriesUrls.create}?workerCategoryName=${searchString}&redirect=${encodeURIComponent(redirect)}`
    );
  };

  const handleWorkerCategoryEdit = () => {
    const redirectParams = buildRedirectParams();
    const redirect = `${WorkersUrls.create}?${redirectParams.toString()}&name=${name}&workerCategoryId=${workerCategoryId}&contactId=${contactId}`;
    navigate(`${WorkerCategoriesUrls.edit(parseInt(workerCategoryId))}?redirect=${encodeURIComponent(redirect)}`);
    model.close();
  };

  const handleSubmission = async () => {
    if (!validate()) return;
    const worker = {
      name,
      gender,
      dateOfBirth,
      note: notes,
      workerCategoryId: parseInt(workerCategoryId),
      contactId: parseInt(contactId),
      kycDetails: validKycDetails,
      bankAccounts: validBankAccounts,
      upiDetails: validUpiDetails,
    };
    await workerService.createWorker(worker);
    navigate(WorkersUrls.list);
  };

  return {
    name, setName,
    dateOfBirth, setDateOfBirth,
    genderItems,
    gender, setGender,
    notes, setNotes,
    workerDetails, setWorkerDetails,
    error,
    navigate,
    handleSubmission,
    isKycAddDisabled,
    isBankAccountsAddDisabled,
    isUpiAddDisabled,
    contactDetails,
    workerCategoryDetails,
    contactId,
    workerCategoryId,
    handleWorkerCategoryCreate,
    handleWorkerCategoryEdit,
    handleContactCreate,
    handleWorkerCategoryChange,
    handleContactChange,
    fetchContacts,
    fetchWorkerCategories,
    contact,
    workerCategory,
    model,
    isModalOpen,        
    primaryContactDetails,
    hasMoreDetails,
    handleContactEdit,
  };
};

export { useWorkerCreation };