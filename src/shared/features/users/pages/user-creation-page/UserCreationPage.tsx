import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { UserCreationPinForm } from "../../components/UserCreationPinForm/UserCreationPinForm";
import { PhoneNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { RadioField } from "@/shared/components/FormFields/RadioField";
import { NameField } from "@/shared/components/FormFields/NameField";
import { Header } from "@/shared/components/Header/Header";
import { useUserCreation } from "./useUserCreation.ts";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

const UserCreationPage = () => {
  const [queryString] = useSearchParams();
  const [pinModalOpen, setPinModalOpen] = useState(false); 

  const { name, setName, phoneNumber, setPhoneNumber, role, setRole, error, validate, userDetail, roles, handleOnCancel } = useUserCreation(queryString);

  const handleOnSave = () => {
    if (validate()) {
      setPinModalOpen(true); 
    }
  };

  return (
    <div className="w-full min-h-screen px-4 pb-10">
                              
      {/* ── Header ── */}
      <Header title="Create User" />

      {/* ── Form Card ── */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NameField
            inputValue={name}
            setInputValue={setName}
            errorMessage={error.name}
            required
          />
          <PhoneNumberField
            label="Phone Number"
            inputValue={phoneNumber}
            setInputValue={setPhoneNumber}
            errorMessage={error.phoneNumber}
            required
          />
        </div>

        <RadioField
          label="Role"
          items={roles}
          inputValue={role}
          setInputValue={setRole}
          errorMessage={error.role}
          required
        />

        <FormSubmissionButtons onCancel={handleOnCancel} onSave={handleOnSave} />
      </div>

      {/* ── PIN Modal ── */}
      <Dialog open={pinModalOpen} onOpenChange={setPinModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set up a PIN</DialogTitle>
            <DialogDescription>Please set 4 digit number</DialogDescription>
          </DialogHeader>
          <UserCreationPinForm
            queryString={queryString}
            userDetail={userDetail}
            onClose={() => setPinModalOpen(false)} 
          />
        </DialogContent>
      </Dialog>

    </div>
  );
};

export { UserCreationPage };
