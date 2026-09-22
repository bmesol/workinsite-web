import { GenericInputField } from "./GenericInputField";
import type { InputPropTypes } from "./InputPropTypes";

const EmailField = (props: InputPropTypes) => (
  <GenericInputField
    {...props}
    filterRegex={/^[a-z0-9@.\-_]*$/}
    hardMaxLength={50}
    inputType="email"
    defaultPlaceholder="Enter email"
  />
);

export { EmailField };
