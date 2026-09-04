import { Header } from "@/shared/components/Header/Header";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useWorkRateAbstractCreate } from "./useWorkRateAbstractCreate";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const WorkRateAbstractCreationPage = () => {
  const { t } = useLanguage();
  const {
    siteDetails,
    workTypeDetails,
    error,
    siteId,
    unitId,
    unitDetails,
    workTypeId,
    totalRate,
    totalQuantity,
    notes,
    handleBackPress,
    setSiteId,
    fetchSites,
    fetchWorkTypes,
    handleWorkTypeChange,
    setTotalRate,
    setTotalQuantity,
    setNotes,
    handleSubmit,
  } = useWorkRateAbstractCreate();

  return (
  <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Create Work Rate Abstract')} />

      <Card className="mt-4">
        <CardContent className="flex flex-col gap-4">

          {/* Row 1: Site + Work Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComboboxField
              id="site"
              label={t('Site')}
              items={siteDetails}
              selectedValue={siteId}
              onValueChange={setSiteId}
              onSearch={fetchSites}
              error={error.site}
              required
            />

            <ComboboxField
              id="workType"
              label={t('Work Type')}
              items={workTypeDetails}
              selectedValue={workTypeId}
              onValueChange={handleWorkTypeChange}
              onSearch={fetchWorkTypes}
              error={error.workType}
              required
            />
          </div>

          {/* Row 2: Total Rate + Total Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-base font-medium">
                {t('Total Rate')} <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder={t('Enter Total Rate')}
                value={totalRate}
                onChange={(e) => setTotalRate(e.target.value)}
              />
              {error.totalRate && (
                <p className="text-sm text-red-500">{error.totalRate}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-base font-medium">
                {t('Total Quantity')} <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder={t('Enter Total Quantity')}
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(e.target.value)}
              />
              {error.totalQuantity && (
                <p className="text-sm text-red-500">{error.totalQuantity}</p>
              )}
            </div>
          </div>

          {/* Row 3: Unit (half-width, auto-derived) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComboboxField
              id="unit"
              label={t('Unit')}
              items={unitDetails}
              selectedValue={unitId}
              onValueChange={() => {}}
              onSearch={() => {}}
              error={error.unit}
              required
              disabled
            />
          </div>

          {/* Remark */}
          <TextareaField
            label={t('Remark')}
            inputValue={notes ?? ""}
            setInputValue={setNotes}
            placeholder={t('Enter your Remark')}
          />

          <FormSubmissionButtons
            onCancel={handleBackPress}
            onSave={handleSubmit}
          />

        </CardContent>
      </Card>
    </div>
  );
};

export { WorkRateAbstractCreationPage };