import { KycForm } from "../KycForm/KycForm";
import type { KycTypesProps } from "../DTOs/DTOs";

const KycCreateForm = (props: KycTypesProps) => <KycForm {...props} mode="create" />;

export { KycCreateForm };
