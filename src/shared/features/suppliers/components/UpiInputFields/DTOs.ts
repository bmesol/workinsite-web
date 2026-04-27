import { UpiTypes } from "../../DTOs/SupplierProps";

interface UpiInputFieldProps {
  upiType: UpiTypes;
  input: string;
  setInput: React.Dispatch<string>;
  error: { [key: string]: string };
}

export type { UpiInputFieldProps };