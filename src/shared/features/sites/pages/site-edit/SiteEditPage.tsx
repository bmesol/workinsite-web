import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { GoogleLocation } from "@/shared/components/FormFields/GoogleLocation/GoogleLocation";
import { ContactDetailForm } from "@/shared/components/ContactDetailForm/ContactDetailForm";
import { ContactEditForm } from "@/shared/features/contacts/components/ContactEditForm/ContactEditForm";
import { SupervisorListForm } from "../../components/SupervisorListForm/SuperVisorListForm";
import { SupervisorAddForm } from "../../components/SupervisorAddForm/SupervisorAddForm";
import { Header } from "@/shared/components/Header/Header";
import { SitesUrls } from "../../utils/urls";
import { useSiteEdit } from "./useSiteEdit";
import { ContactTypes } from "@/shared/features/contacts/DTOs/ContactProps";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";

const SiteEditPage = () => {
  const { id } = useParams<string>();
  const [queryString] = useSearchParams();
  const [contactEditOpen, setContactEditOpen] = useState(false);
  const [supervisorAddOpen, setSupervisorAddOpen] = useState(false);

  const {
    name,
    setName,
    clientDetails,
    clientId,
    handleClientCreate,
    handleClientChange,
    fetchClients,
    googleLocation,
    setGoogleLocation,
    notes,
    setNotes,
    contact,
    contactId,
    contactDetails,
    fetchContacts,
    handleContactChange,
    handleContactCreate,
    handleContactEdit,
    primaryContactDetails,
    hasMoreDetails,
    error,
    navigate,
    handleSubmission,
    supervisorIds,
    setSupervisorIds,
    status,
    setStatus,
    siteStatus,
    redirectUrl,
    redirectParams,
    siteDetails,
  } = useSiteEdit(id as string, queryString);

  const handleMoreDetails = () => {
    if (contact) setContactEditOpen(true);
  };

  const handleSupervisorsAdd = () => setSupervisorAddOpen(true);

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title="Edit Site" />

      {siteDetails && (
        <Card className="mt-4">
          <CardContent className="pt-6 flex flex-col gap-6">
            {/* Row 1: Name + Client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="site-name" className="text-base font-medium">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="site-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter site name"
                />
                {error.name && (
                  <p className="text-sm text-destructive">{error.name}</p>
                )}
              </div>

              <ComboboxField
                id="client-combobox"
                label="Client"
                items={clientDetails}
                selectedValue={clientId}
                onValueChange={handleClientChange}
                onSearch={fetchClients}
                onCreate={handleClientCreate}
                error={error.client}
                required
              />
            </div>

            {/* Row 2: Location + Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <GoogleLocation
                  errorMessage={error.googleLocation}
                  inputValue={googleLocation}
                  setInputValue={setGoogleLocation}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notes" className="text-base font-medium">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter your notes"
                  rows={4}
                />
              </div>
            </div>

            {/* Row 3: Contact + Supervisors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <ComboboxField
                  id="contact-combobox"
                  label="Contact"
                  items={contactDetails}
                  selectedValue={contactId}
                  onValueChange={handleContactChange}
                  onSearch={fetchContacts}
                  onCreate={handleContactCreate}
                  error={error.contact}
                  required
                />
                {contactId && (
                  <ContactDetailForm
                    handleContactEdit={handleContactEdit}
                    primaryContactDetails={primaryContactDetails}
                    hasMoreDetails={hasMoreDetails}
                    handleMoreDetails={handleMoreDetails}
                  />
                )}
              </div>

              <div className="flex flex-col gap-3">
                <FormActionButton
                  heading="Supervisors"
                  label="Add"
                  onClick={handleSupervisorsAdd}
                  isColsTwo={true}
                  required
                />
                {supervisorIds.length > 0 && (
                  <SupervisorListForm
                    supervisorIds={supervisorIds}
                    setSupervisorIds={setSupervisorIds}
                  />
                )}
              </div>
            </div>

            {/* Row 4: Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-base font-medium">Status</Label>
                <RadioGroup
                  value={status}
                  onValueChange={setStatus}
                  className="flex flex-col gap-2"
                >
                  {siteStatus.map((item) => (
                    <div key={item.value} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={item.value}
                        id={`status-${item.value}`}
                      />
                      <Label
                        htmlFor={`status-${item.value}`}
                        className="font-sm cursor-pointer"
                      >
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Footer: Cancel + Save */}
            <FormSubmissionButtons
              onCancel={() => navigate(SitesUrls.list)}
              onSave={handleSubmission}
            />
          </CardContent>
        </Card>
      )}

      {contact && (
        <Dialog open={contactEditOpen} onOpenChange={setContactEditOpen}>
          <DialogContent>
            <ContactEditForm
              contactList={contact}
              setContactList={handleContactEdit}
              selectedItem={
                contact.contactDetails[0]
                  ? {
                      id: 0,
                      type: contact.contactDetails[0].contactType,
                      value: contact.contactDetails[0].value,
                    }
                  : { id: 0, type: ContactTypes.PHONE, value: "" }
              }
              onClose={() => setContactEditOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      {/* Supervisor Add Dialog */}
      <Dialog open={supervisorAddOpen} onOpenChange={setSupervisorAddOpen}>
        <DialogContent>
          <SupervisorAddForm
            supervisorIds={siteDetails?.supervisors?.map((s) => s.id) ?? []}
            setSupervisorIds={setSupervisorIds}
            redirectUrl={redirectUrl}
            redirectParams={redirectParams}
            onClose={() => setSupervisorAddOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { SiteEditPage };
