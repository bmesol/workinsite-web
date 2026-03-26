import type { ReactNode } from "react";

interface FormInputProps {
  children: ReactNode;
  className?: string;
  errorMessage?: string;
}

const FormInput = ({
  children,
  className,
  errorMessage,
}: FormInputProps) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {children}
      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export { FormInput };