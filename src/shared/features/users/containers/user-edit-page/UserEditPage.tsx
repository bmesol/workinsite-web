import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { PhoneNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { UserEditPinForm } from "../../components/UserEditPinForm/UserEditPinForm";
import { RadioField } from "@/shared/components/FormFields/RadioField";
import { NameField } from "@/shared/components/FormFields/NameField";
import { Header, Actions } from "@/shared/components/Header/Header";
import { UsersUrls } from "../../utils/urls";
import { useUserEdit } from "./useUserEdit";

const UserEditPage = () => {
  const { id } = useParams<string>();
  const [pinModalOpen, setPinModalOpen] = useState(false);

  const {
    user,
    isActive,
    error,
    roles,
    role,
    name,
    phoneNumber,
    notes,
    setName,
    setPhoneNumber,
    setRole,
    setIsActive,
    setNotes,
    handleSubmission,
    navigate,
  } = useUserEdit(id as string);

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      {/* ── Header ── */}
      <Header title="Edit User">
        <Actions>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPinModalOpen(true)}
          >
            Change PIN
          </Button>
        </Actions>
      </Header>

      {/* ── Form Card ── */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-6 flex flex-col gap-6">
        {user && (
          <>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RadioField
                label="Role"
                items={roles}
                inputValue={role}
                setInputValue={setRole}
              />
              <div className="flex flex-col gap-2">
                <Label className="text-base font-medium text-black flex items-center gap-0.5">
                  Is Active
                </Label>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-base font-medium text-black flex items-center gap-0.5">
                Notes
              </Label>
              <Textarea
                placeholder="Enter your notes"
                value={notes ?? ""}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
          </>
        )}

        <div>
          <FormSubmissionButtons
            onCancel={() => navigate(UsersUrls.list)}
            onSave={handleSubmission}
          />
        </div>
      </div>

      {/* ── Change PIN Modal ── */}
      <Dialog open={pinModalOpen} onOpenChange={setPinModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change PIN</DialogTitle>
            <DialogDescription>Please set a 4 digit number</DialogDescription>
          </DialogHeader>
          <UserEditPinForm
            userId={id as string}
            onClose={() => setPinModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { UserEditPage };
