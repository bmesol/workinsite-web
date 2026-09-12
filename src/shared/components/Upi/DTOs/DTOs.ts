const UpiTypes = {
  GPAY: "GPAY",
  PHONEPE: "PHONEPE",
  UPI_ID: "UPI_ID",
} as const;

type UpiTypes = typeof UpiTypes[keyof typeof UpiTypes];

interface UpiDetail {
  upiType: UpiTypes;
  value: string;
}

interface UpiDetails {
  upiDetails: UpiDetail[];
}

interface UpiTypesProps {
  details: UpiDetails;
  setDetails: (updated: UpiDetails) => void;
  onClose?: () => void;
  isColsTwo?: boolean;
  disabled?: boolean;
}

interface UpiTypesProp extends UpiTypesProps {
  isColsTwo?: boolean;
}

interface UpiEditFormProps extends UpiTypesProps {
  selectedItem: {
    id: number;
    type: UpiTypes;
    value: string;
  };
}

interface UpiEditDeleteButtonsProp extends UpiTypesProps {
  selectedItem: { id: number; item: UpiDetail };
}

export { UpiTypes };
export type { UpiDetail, UpiDetails, UpiTypesProps, UpiTypesProp, UpiEditFormProps, UpiEditDeleteButtonsProp };