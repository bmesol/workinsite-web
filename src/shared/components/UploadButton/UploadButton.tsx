import React, { useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { UploadCloud } from "lucide-react";

type UploadButtonProps = {
  text: string;
  onFilesSelected: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  buttonClassName?: string;
  textClassName?: string;
};

const UploadButton: React.FC<UploadButtonProps> = ({
  text,
  onFilesSelected,
  accept = "image/*",
  multiple = true,
  disabled = false,
  buttonClassName,
  textClassName,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilesSelected(e.target.files);
    e.target.value = ""; // allows re-selecting the same file again
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={handleClick}
        disabled={disabled}
        className={`flex items-center gap-2 rounded-full px-6 py-5 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          buttonClassName ?? ""
        }`}
      >
        <UploadCloud className="h-6 w-6" />
        <span className={`text-base font-semibold ${textClassName ?? ""}`}>
          {text}
        </span>
      </Button>

      {/* Hidden native file input — directly opens OS file/gallery picker, no extra popup */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
};

export { UploadButton };