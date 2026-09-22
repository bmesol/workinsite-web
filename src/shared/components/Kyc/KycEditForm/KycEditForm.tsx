import { KycForm } from "../KycForm/KycForm";
import type { KycEditFormProps } from "./DTOs";

const KycEditForm = (props: KycEditFormProps) => <KycForm {...props} mode="edit" />;

export { KycEditForm };
