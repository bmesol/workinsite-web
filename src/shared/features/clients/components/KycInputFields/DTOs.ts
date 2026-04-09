import { KYCTypes } from "../../DTOs/ClientProps";

interface KycInputFieldProps {
  kycType: KYCTypes;
  input: string;
  setInput: React.Dispatch<string>;
  error: { [key: string]: string };
}

export type { KycInputFieldProps };
