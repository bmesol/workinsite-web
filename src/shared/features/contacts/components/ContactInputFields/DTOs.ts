import { ContactTypes } from "../../DTOs/ContactProps";

interface ContactInputFieldProps {
  contactType: ContactTypes;
  input: string;
  setInput: React.Dispatch<string>;
  error: { [key: string]: string };
}

export type { ContactInputFieldProps };
