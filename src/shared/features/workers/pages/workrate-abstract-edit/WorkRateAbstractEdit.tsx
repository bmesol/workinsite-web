import { Header } from "@/shared/components/Header/Header";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useWorkRateAbstractEdit } from "./useWorkRateAbstractEdit";
import { usePermission } from "@/shared/hooks/usePermission";
import { useParams } from "react-router-dom";

const WorkRateAbstractEditPage = () => {
  const { id } = useParams<string>();
  const { canEdit } = usePermission();
  const editable = canEdit("Work Rate Abstract");

  const {
    siteDetails,
    workTypeId,
    totalRate,
    totalQuantity,
    notes,
    siteId,
    unitId,
    error,
    workTypeDetails,
    unitDetails,
    loading,
    handleBackPress,
    setSiteId,
    handleSubmission,
    setWorkTypeId,
    setUnitId,
    setTotalRate,
    setTotalQuantity,
    setNotes,
    fetchWorkTypes,
    fetchUnits,
    fetchSites,
  } = useWorkRateAbstractEdit(id as string);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-10">
      <Header title="Edit Work Rate Abstract" />

      <Card className="mt-4">
        <CardContent className="flex flex-col gap-4 pt-4">
          {/* Site */}
          <ComboboxField
            id="site"
            label="Site"
            items={siteDetails}
            selectedValue={siteId}
            onValueChange={setSiteId}
            onSearch={fetchSites}
            error={error.site}
            required
            disabled={!editable}
          />

          {/* Work Type */}
          <ComboboxField
            id="workType"
            label="Work Type"
            items={workTypeDetails}
            selectedValue={workTypeId}
            onValueChange={setWorkTypeId}
            onSearch={fetchWorkTypes}
            error={error.workType}
            required
            disabled={!editable}
          />

          {/* Total Rate */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-base font-medium">
              Total Rate <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              placeholder="Enter Total Rate"
              value={totalRate}
              onChange={(e) => setTotalRate(e.target.value)}
              disabled={!editable}
            />
            {error.totalRate && (
              <p className="text-sm text-red-500">{error.totalRate}</p>
            )}
          </div>

          {/* Total Quantity */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-base font-medium">
              Total Quantity <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              placeholder="Enter Total Quantity"
              value={totalQuantity}
              onChange={(e) => setTotalQuantity(e.target.value)}
              disabled={!editable}
            />
            {error.totalQuantity && (
              <p className="text-sm text-red-500">{error.totalQuantity}</p>
            )}
          </div>

          {/* Unit */}
          <ComboboxField
            id="unit"
            label="Unit"
            items={unitDetails}
            selectedValue={unitId}
            onValueChange={setUnitId}
            onSearch={fetchUnits}
            error={error.unit}
            required
            disabled={!editable}
          />

          {/* Remark */}
          <TextareaField
            label="Remark"
            inputValue={notes ?? ""}
            setInputValue={setNotes}
            placeholder="Enter your Remark"
            isDisabled={!editable} 
          />

          <FormSubmissionButtons
            onCancel={handleBackPress}
            onSave={handleSubmission}
          />

        </CardContent>
      </Card>
    </div>
  );
};

export { WorkRateAbstractEditPage };