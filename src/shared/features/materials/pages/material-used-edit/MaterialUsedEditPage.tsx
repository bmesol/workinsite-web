import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { NameField } from "@/shared/components/FormFields/NameField";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { DatePicker } from "@/shared/components/FormFields/DatePicker";
import { Header } from "@/shared/components/Header/Header";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { useMaterialUsedEdit } from "./useMaterialUsedEdit";
import { usePermission } from "@/shared/hooks/usePermission";
import { cn } from "@/shared/components/lib/utils";
import { Loader2 } from "lucide-react";
import { MaterialUsedUrls } from "../../utils/urls";

export const MaterialUsedEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  if (!id) return null;

  const { canEdit } = usePermission();
  const editable = canEdit("Material Used");

  const {
    siteId,
    setSiteId,
    materialId,
    setMaterialId,
    quantity,
    setQuantity,
    notes,
    setNotes,
    date,
    setDate,
    materialUsedDetails,
    error,
    materialDetails,
    siteDetails,
    workModeDetails,
    loading,
    workModeId,
    setWorkModeId,
    fetchSites,
    fetchMaterials,
    fetchWorkModes,
    handleSubmission,
    maximumAllowedQuantity,
    isFetchingMaterials,
  } = useMaterialUsedEdit(id);

  const QuantityBadge = () => {
    if (!materialId || maximumAllowedQuantity === null) return null;

    const entered = parseFloat(quantity);
    const max = parseFloat(maximumAllowedQuantity);
    const isExceeded = !isNaN(entered) && !isNaN(max) && entered > max;

    return (
      <div
        className={cn(
          "self-start px-2.5 py-1 rounded-md border text-xs font-medium -mt-1",
          isExceeded
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-blue-50 border-blue-200 text-blue-700",
        )}
      >
        {isExceeded
          ? `⚠  Exceeds maximum allowed (${maximumAllowedQuantity})`
          : `✓  Max allowed: ${maximumAllowedQuantity}`}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!materialUsedDetails) return null;

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      {/* ── Header ── */}
      <Header title="Edit Material Used" />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">
          {/* ── Date ── */}
          <DatePicker
            label="Date"
            date={date}
            onDateChange={setDate}
            required
            errorMessage={error.date}
            disable={!editable}
          />

          {/* ── Site ── */}
          <ComboboxField
            id="site"
            label="Site"
            items={siteDetails}
            selectedValue={siteId ?? ""}
            onValueChange={setSiteId}
            onSearch={fetchSites}
            required
            error={error.siteId}
            disabled={!editable}
          />

          {/* ── Material ── */}
          {isFetchingMaterials ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <Loader2 className="animate-spin h-4 w-4 text-blue-600" />
              Loading available materials…
            </div>
          ) : (
            <ComboboxField
              id="material"
              label="Material"
              items={materialDetails}
              selectedValue={materialId ?? ""}
              onValueChange={setMaterialId}
              onSearch={fetchMaterials}
              required
              error={error.materialId}
              disabled={!editable}
            />
          )}

          {/* ── Quantity ── */}
          <NameField
            label="Quantity"
            inputValue={quantity}
            setInputValue={setQuantity}
            placeholder={
              maximumAllowedQuantity !== null
                ? `Max: ${maximumAllowedQuantity}`
                : "Enter Quantity"
            }
            required
            regex="^[0-9]*(\.[0-9]*)?$"
            errorMessage={error.quantity}
            isDisabled={!editable}
          />

          {/* ── Quantity Badge ── */}
          <QuantityBadge />

          {/* ── Work Mode ── */}
          <ComboboxField
            id="workMode"
            label="Work Mode"
            items={workModeDetails}
            selectedValue={workModeId ?? ""}
            onValueChange={setWorkModeId}
            onSearch={fetchWorkModes}
            required
            error={error.workModeId}
            disabled={!editable}
          />

          {/* ── Notes ── */}
          <TextareaField
            label="Notes"
            inputValue={notes}
            setInputValue={setNotes}
            placeholder="Enter your notes"
            isDisabled={!editable}
          />

          {/* ── Save / Cancel ── */}
          <FormSubmissionButtons
            onSave={editable ? handleSubmission : () => {}}
            onCancel={() => navigate(MaterialUsedUrls.list)}
          />
        </div>
      </Card>
    </div>
  );
};
