import { Label } from "@/shared/components/ui/label";
import type { ReactNode } from "react";

interface FieldLabelProps {
  required?: boolean;
  children: ReactNode;
}

const FieldLabel = ({ required, children }: FieldLabelProps) => (
  <Label className="mb-1 text-base font-medium text-black flex items-center gap-0.5">
    {children}
    {required && <span className="text-red-500 text-base leading-none">*</span>}
  </Label>
);

export { FieldLabel };
