import React from 'react';
import { Trash2, MapPin, Scale, Calendar, Ruler, HardHat, Box } from 'lucide-react';
import { usePermission } from '@/shared/hooks/usePermission';
import type { Material } from '@/shared/features/materials/DTOs/MaterialProps';
import hsnIcon from '@/assets/icons/hsn.webp';

interface MaterialCardProps {
  material: Material;
  onDelete: () => void;
  onPress?: () => void;
  // Material shift
  sourceSite?: string;
  targetSite?: string;
  // Material used / purchase
  site?: string;
  quantity?: string;
  unit?: string;
  date?: string;
  hsnCode?: string;
  workmode?: string;
  permissionKey?: string;
}

interface InfoRowProps {
  icon?: React.ReactNode;
  text: string;
  isImage?: boolean;
}

const InfoRow = ({ icon, text, isImage }: InfoRowProps) => (
  <div className="flex items-center gap-1.5">
    {isImage ? (
      <img src={hsnIcon} alt="hsn" className="w-3.5 h-3 shrink-0" />
    ) : (
      icon && <span className="shrink-0">{icon}</span>
    )}
    <span className="text-sm truncate" style={{ color: 'var(--gray-color)' }}>
      {text}
    </span>
  </div>
);

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
    typeof material === 'object' ? material?.name : material || 'Material';

  const isShifting = Boolean(sourceSite && targetSite);
  const iconSize = 'w-3.5 h-3.5 shrink-0';
  const iconColor = 'var(--secondary)';

  // ── Build info rows ──
  const row1Items: InfoRowProps[] = [];
  const row2Items: InfoRowProps[] = [];

  // Row 1 left: material (shifting) / site / unit+quantity / unit alone
  if (isShifting) {
    row1Items.push({
      icon: <Box className={iconSize} style={{ color: iconColor }} />,
      text: materialName,
    });
  } else if (site) {
    row1Items.push({
      icon: <MapPin className={iconSize} style={{ color: iconColor }} />,
      text: site,
    });
  }

  // Row 1 right: quantity+unit
  if (quantity !== undefined && unit) {
    row1Items.push({
      icon: <Scale className={iconSize} style={{ color: iconColor }} />,
      text: `${quantity} ${unit}`,
    });
  } else if (quantity !== undefined) {
    row1Items.push({
      icon: <Scale className={iconSize} style={{ color: iconColor }} />,
      text: quantity.toString(),
    });
  } else if (unit) {
    // unit alone — goes row1, hsnCode beside it
    row1Items.push({
      icon: <Ruler className={iconSize} style={{ color: iconColor }} />,
      text: unit,
    });
    if (hsnCode) {
      row1Items.push({ text: hsnCode, isImage: true }); // ✅ hsn beside unit
    }
  }

  // Row 2: date, hsnCode (if not already shown), workmode
  if (date) {
    row2Items.push({
      icon: <Calendar className={iconSize} style={{ color: iconColor }} />,
      text: date,
    });
  }

  // hsnCode in row2 only when unit is NOT alone (already added to row1)
  if (hsnCode && !(unit && quantity === undefined)) {
    row2Items.push({ text: hsnCode, isImage: true });
  }

  if (workmode) {
    row2Items.push({
      icon: <HardHat className={iconSize} style={{ color: iconColor }} />,
      text: workmode,
    });
  }

  return (
    <div
      onClick={onPress}
      className="p-4 rounded-xl border transition cursor-pointer hover:shadow-sm"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
      }}
    >
      {/* ── Header ── */}
      <div className="flex justify-between items-start mb-3">
        <h3
          className="font-bold text-base truncate flex-1 pr-2"
          style={{ color: 'var(--secondary)' }}
        >
          {isShifting ? `${sourceSite} → ${targetSite}` : materialName}
        </h3>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          disabled={!hasPermission}
          className="p-1 rounded-md transition shrink-0"
          style={{ opacity: hasPermission ? 1 : 0.5, cursor: hasPermission ? 'pointer' : 'not-allowed' }}
        >
          <Trash2 className="w-4 h-4" style={{ color: 'var(--danger-color)' }} />
        </button>
      </div>

      {/* ── All info in single 2-col grid ── */}
      {(row1Items.length > 0 || row2Items.length > 0) && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {row1Items.map((item, index) => (
            <InfoRow key={`r1-${index}`} {...item} />
          ))}
          {row2Items.map((item, index) => (
            <InfoRow key={`r2-${index}`} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialCard;