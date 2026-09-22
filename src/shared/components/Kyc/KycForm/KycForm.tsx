import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { FormInput } from "@/shared/components/FormInput/FormInput";
import { KycInputFields } from "../KycInputFields/KycInputFields";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useLanguage } from "@/shared/hooks/useLanguageContext";
import { useKycForm } from "./useKycForm";
import { KYCTypes } from "../DTOs/DTOs";
import type { KycFormProps } from "./useKycForm";

const KycForm = (props: KycFormProps) => {
  const { t } = useLanguage();
  const { kycType, kycItems, input, setInput, error, handleSelectChange, handleSave } =
    useKycForm(props);

  const kycItemNodes = kycItems.map((item) => (
    <SelectItem key={item.value} value={item.value}>
      {item.label}
    </SelectItem>
  ));

  return (
    <div className="flex flex-col gap-4">
      {props.mode === "create" ? (
        <FormInput errorMessage={error.select}>
          <Select onValueChange={handleSelectChange} value={kycType}>
            <SelectTrigger className={`w-full ${!kycType ? "text-muted-foreground" : ""}`}>
              <SelectValue placeholder={t("Select")} />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4} className="z-[9999] bg-white">
              {kycItemNodes}
            </SelectContent>
          </Select>
        </FormInput>
      ) : (
        <Select value={kycType} disabled>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{kycItemNodes}</SelectContent>
        </Select>
      )}

      <KycInputFields
        kycType={kycType as KYCTypes}
        input={input}
        setInput={setInput}
        error={error}
      />

      <FormSubmissionButtons
        label={props.mode === "create" ? t("Add") : t("Update")}
        onCancel={() => props.onClose?.()}
        onSave={handleSave}
      />
    </div>
  );
};

export { KycForm };
