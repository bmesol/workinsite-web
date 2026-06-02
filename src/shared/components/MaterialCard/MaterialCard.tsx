import React from "react";
import { Trash2 } from "lucide-react";
import { usePermission } from "@/shared/hooks/usePermission";

interface MaterialCardProps {
  material: any;
  onDelete: () => void;
  onPress?: () => void;
  sourceSite?: string;
  targetSite?: string;
  site?: string;
  quantity?: string;
  unit?: string;
  date?: string;
  hsnCode?: string;
  workmode?: string;
  permissionKey?: string;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onDelete,
  onPress,
  sourceSite,
  targetSite,
  site,
  quantity,
  unit,
  date,
  hsnCode,
  workmode,
  permissionKey,
}) => {
  const { canEdit } = usePermission();
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;

  const materialName =
    typeof material === "object" ? material.name : material || "Material";

  const isShifting = Boolean(sourceSite && targetSite);

  // Build Info Items
  const infoItems: { text: string; isImage?: boolean }[] = [];

  if (isShifting) infoItems.push({ text: materialName });

  if (!isShifting && site) infoItems.push({ text: site });

  if (quantity && unit) infoItems.push({ text: `${quantity} ${unit}` });
  else if (quantity) infoItems.push({ text: quantity });
  else if (unit) infoItems.push({ text: unit });

  if (date) infoItems.push({ text: date });

  if (hsnCode) infoItems.push({ text: hsnCode, isImage: true });

  if (workmode) infoItems.push({ text: workmode });

  return (
    <div
      onClick={onPress}
      className="p-4 rounded-xl border transition cursor-pointer"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex-1">
          <h3
            className="font-semibold truncate"
            style={{ color: "var(--foreground)" }}
          >
            {isShifting
              ? `${sourceSite} → ${targetSite}`
              : materialName}
          </h3>
        </div>

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          disabled={!hasPermission}
          className="p-2 rounded-md"
          style={{
            backgroundColor: "transparent",
            opacity: hasPermission ? 1 : 0.5,
            cursor: hasPermission ? "pointer" : "not-allowed",
          }}
        >
          <Trash2
            className="w-4 h-4"
            style={{ color: "var(--danger-color)" }}
          />
        </button>
      </div>

      {/* Info Chips */}
      {infoItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="px-2 py-1 rounded-md text-sm flex items-center gap-1"
              style={{
                backgroundColor: "var(--select-hover-bg)",
                color: "var(--foreground)",
              }}
            >
              {item.isImage && (
                <img
                  src="/images/hsn.png" // update if needed
                  alt="hsn"
                  className="w-3 h-3"
                />
              )}
              <span className="truncate">{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialCard;