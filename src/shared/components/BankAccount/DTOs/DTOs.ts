interface BankAccountProps {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
}

interface BankAccountDetails {
  bankAccounts: BankAccountProps[];
}

interface BankAccountTypesProps {
  details: BankAccountDetails;
  setDetails: (updated: BankAccountDetails) => void;
  onClose?: () => void;
  isColsTwo?: boolean;
  disabled?: boolean;
}

interface BankAccountsProp extends BankAccountTypesProps {
  isColsTwo?: boolean;
}

interface BankAccountEditFormProps extends BankAccountTypesProps {
  selectedItem: {
    id: number;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
  };
}

interface BankAccountEditDeleteButtonsProp extends BankAccountTypesProps {
  selectedItem: { id: number; item: BankAccountProps };
}

export type {
  BankAccountProps,
  BankAccountDetails,
  BankAccountTypesProps,
  BankAccountsProp,
  BankAccountEditFormProps,
  BankAccountEditDeleteButtonsProp,
};