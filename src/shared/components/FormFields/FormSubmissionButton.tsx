import { Button } from "@/shared/components/ui/button";
import { FormInput } from "../FormInput/FormInput";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const FormSubmissionButtons = (props: {
  label?: string;
  onSave: () => void;
  onCancel: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  const { t } = useLanguage();
  return (
    <FormInput className={props.className}>
      <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => props.onCancel()}
        >
          {t("Cancel")}
        </Button>
        <Button
          variant="default"
          className="cursor-pointer"
          onClick={() => props.onSave()}
          disabled={props.disabled}
        >
          {props.label || t("Save")}
        </Button>
      </div>
    </FormInput>
  );
};

export { FormSubmissionButtons };