const KYCTypes = {
  AADHAAR: "AADHAAR",
  PAN: "PAN",
  GST: "GST",
} as const;

type KYCTypes = typeof KYCTypes[keyof typeof KYCTypes];

interface KYCDetail {
  kycType: KYCTypes;
  value: string;
}

interface KycDetails {
  kycDetails: KYCDetail[];
}

interface KycTypesProps {
  details: KycDetails;
  setDetails: (prev: KycDetails) => void;
  onClose?: () => void;
  isColsTwo?: boolean;
  disabled?: boolean;
}

interface KycEditFormProps extends KycTypesProps {
  selectedItem: {
    id: number;
    type: KYCTypes;
    value: string;
  };
}

export { KYCTypes };
export type { KycTypesProps, KycEditFormProps, KycDetails, KYCDetail };