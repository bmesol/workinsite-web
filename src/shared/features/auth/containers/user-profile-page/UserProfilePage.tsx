// 

import { NameField } from "@/shared/components/FormFields/NameField";
import { PhoneNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { ProfileEditPinForm } from "../../components/ProfileEditPinForm/ProfileEditPinForm";
import { useUserProfile } from "./useUserProfilePage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [openPinDialog, setOpenPinDialog] = useState(false);

  const {
    name, setName,
    phoneNumber, setPhoneNumber,
    error, isActive, setIsActive,
    notes, setNotes,
    user, handleSubmission, isDisabled,
  } = useUserProfile();

  return (
    <div className="container mx-auto min-h-screen px-4 pb-10">

      {/* Header */}
      <div className="flex items-center justify-between py-6">
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
        <Button variant="outline" onClick={() => setOpenPinDialog(true)}>
          Change PIN
        </Button>
      </div>

      {/* Card */}
      <Card className="mt-4">
        <CardContent className="flex flex-col gap-6 pt-6">

          {/* Row 1 - Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NameField
              inputValue={name}
              setInputValue={setName}
              errorMessage={error.name}
              isDisabled={isDisabled} 
              required={true}
            />
            <PhoneNumberField
              label="Phone Number"
              inputValue={phoneNumber}
              setInputValue={setPhoneNumber}
              errorMessage={error.phoneNumber}
              isDisabled={isDisabled} 
              required={true}
            />
          </div>

          {/* Row 2 - Role & Is Active */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-black">Role</Label>
              <Label className="opacity-50">{user.role.name}</Label>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Is Active</Label>
              <Switch
                checked={isActive}
                onCheckedChange={() => setIsActive(true)}
                disabled={true}
              />
            </div>
          </div>

          {/* Row 3 - Notes & Buttons */}
          {!isDisabled && (
            <>
              <div className="grid grid-cols-1">
                <TextareaField
                  label="Notes"
                  inputValue={notes ?? ""}
                  setInputValue={setNotes}
                  placeholder="Enter your notes"
                />
              </div>
              <div className="grid grid-cols-1">
                <FormSubmissionButtons
                  onCancel={() => navigate("/sitelist")}
                  onSave={handleSubmission}
                />
              </div>
            </>
          )}

        </CardContent>
      </Card>

      {/* Change PIN Dialog */}
      <Dialog open={openPinDialog} onOpenChange={setOpenPinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change PIN</DialogTitle>
            <DialogDescription>Please set 4 digit number</DialogDescription>
          </DialogHeader>
          <ProfileEditPinForm onClose={() => setOpenPinDialog(false)} />
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default UserProfilePage;
