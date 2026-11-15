import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { Label } from "@/shared/components/ui/label";
import { NameField } from "@/shared/components/FormFields/NameField";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
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
import { useSiteCreation } from "./useSiteCreation";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

// ─── SiteCreationPage ─────────────────────────────────────────────────────────

const SiteCreationPage = () => {
  const { t } = useLanguage();
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
     wageTypeId,      
  setWageTypeId,   
  wageTypeDetails, 
  fetchWageTypes,   
  } = useSiteCreation(queryString);
  const handleMoreDetails = () => {
    if (contact) setContactEditOpen(true);
  };

  const handleSupervisorsAdd = () => setSupervisorAddOpen(true);

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Create Site')} />

      <Card className="mt-4">
        <CardContent className="flex flex-col gap-4">
          {/* Row 1: Name + Client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NameField
              inputValue={name}
              setInputValue={setName}
              errorMessage={error.name}
              placeholder={t('Enter site name')}
              required
            />

            <ComboboxField
              id="client-combobox"
              label={t('Client')}
              items={clientDetails}
              selectedValue={clientId}
              onValueChange={handleClientChange}
              onSearch={fetchClients}
              onCreate={handleClientCreate}
              error={error.client}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <ComboboxField
    id="wage-type-combobox"
    label={t('Wage Type')}
    items={wageTypeDetails}
    selectedValue={wageTypeId}
    onValueChange={setWageTypeId}
    onSearch={fetchWageTypes}
    error={error.wageType}
    required
  />
  <div className="flex flex-col gap-3">
              <ComboboxField
                id="contact-combobox"
                label={t('Contact')}
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

            <TextareaField
              label={t('Notes')}
              inputValue={notes}
              setInputValue={setNotes}
              placeholder={t('Enter your notes')}
            />
          </div>

          {/* Row 3: Supervisors + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <FormActionButton
                heading={t('Supervisors')}
                label={t('Add')}
                onClick={handleSupervisorsAdd}
                isColsTwo={true}
              />
              {supervisorIds.length > 0 && (
                <SupervisorListForm
                  supervisorIds={supervisorIds}
                  setSupervisorIds={setSupervisorIds}
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-base font-medium">{t('Status')}</Label>
              <RadioGroup
                value={status}
                onValueChange={setStatus}
                className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-4"
              >
                {siteStatus.map((item) => (
                  <div key={item.value} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={item.value}
                      id={`status-${item.value}`}
                    />
                    <Label
                      htmlFor={`status-${item.value}`}
                      className="text-sm font-medium cursor-pointer"
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

      {/* Contact Edit Dialog */}
      {contact && (
        <Dialog open={contactEditOpen} onOpenChange={setContactEditOpen}>
          <DialogContent>
            <ContactEditForm
              contactList={contact}
              setContactList={handleContactEdit}
              selectedItem={{
                id: 0,
                type: contact.contactDetails[0]?.contactType,
                value: contact.contactDetails[0]?.value ?? "",
              }}
              onClose={() => setContactEditOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Supervisor Add Dialog */}
      <Dialog open={supervisorAddOpen} onOpenChange={setSupervisorAddOpen}>
        <DialogContent>
          <SupervisorAddForm
            supervisorIds={supervisorIds}
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

export { SiteCreationPage };
