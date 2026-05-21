import { KYCTypes, type KycTypesProps } from "../DTOs/DTOs";

interface KycEditFormProps extends KycTypesProps {
  selectedItem: { id: number; type: KYCTypes; value: string };
}

export type { KycEditFormProps };
