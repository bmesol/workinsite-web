import React from 'react';
import { Trash2, MapPin, Scale, Calendar, Ruler, HardHat, Box } from 'lucide-react';
import { usePermission } from '@/shared/hooks/usePermission';
import type { Material } from '@/shared/features/materials/DTOs/MaterialProps';
import hsnIcon from '@/assets/icons/hsn.webp';

interface MaterialCardProps {
  material: Material;
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

interface InfoChipProps {
  icon?: React.ReactNode;
  text: string;
  isImage?: boolean;
}

const InfoChip = ({ icon, text, isImage }: InfoChipProps) => (
  <div
    className="flex items-center gap-1 px-2 py-1  text-sm"
    style={{
      backgroundColor: 'var(--select-hover-bg)',
      color: 'var(--foreground)',
    }}
  >
    {isImage ? (
      <img src={hsnIcon} alt="hsn" className="w-3.5 h-3" />  
    ) : (
      icon && <span className="shrink-0">{icon}</span>
    )}
    <span className="truncate">{text}</span>
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
    typeof material === 'object' ? material.name : material || 'Material';

  const isShifting = Boolean(sourceSite && targetSite);

  const iconClass = 'w-3.5 h-3.5 shrink-0';
  const iconColor = 'var(--muted-foreground)';

  const infoItems: InfoChipProps[] = [];

  if (isShifting)
    infoItems.push({
      icon: <Box className={iconClass} style={{ color: iconColor }} />,
      text: materialName,
    });

  if (!isShifting && site)
    infoItems.push({
      icon: <MapPin className={iconClass} style={{ color: iconColor }} />,
      text: site,
    });

  if (quantity !== undefined && unit)
    infoItems.push({
      icon: <Scale className={iconClass} style={{ color: iconColor }} />,
      text: `${quantity} ${unit}`,
    });
  else if (quantity !== undefined)
    infoItems.push({
      icon: <Scale className={iconClass} style={{ color: iconColor }} />,
      text: quantity.toString(),
    });
  else if (unit)
    infoItems.push({
      icon: <Ruler className={iconClass} style={{ color: iconColor }} />,
      text: unit,
    });

  if (date)
    infoItems.push({
      icon: <Calendar className={iconClass} style={{ color: iconColor }} />,
      text: date,
    });

  if (hsnCode)
    infoItems.push({
      text: hsnCode,
      isImage: true,
    });

  if (workmode)
    infoItems.push({
      icon: <HardHat className={iconClass} style={{ color: iconColor }} />,
      text: workmode,
    });

  return (
    <div
      onClick={onPress}
      className="p-4 rounded-xl border transition cursor-pointer hover:shadow-sm"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3
          className="font-semibold truncate flex-1"
          style={{ color: 'var(--foreground)' }}
        >
          {isShifting ? `${sourceSite} → ${targetSite}` : materialName}
        </h3>

        {/* Delete Button */}
       <button
  onClick={(e) => {
    e.stopPropagation();
    onDelete();
  }}
  disabled={!hasPermission}
  className="p-2 rounded-md transition"
  style={{
    opacity: hasPermission ? 1 : 0.5,
    cursor: hasPermission ? 'pointer' : 'not-allowed',
  }}
>
          <Trash2
            className="w-4 h-4"
            style={{ color: 'var(--danger-color)' }}
          />
        </button>
      </div>

      {/* Info Chips */}
      {infoItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {infoItems.map((item, index) => (
            <InfoChip
              key={index}
              icon={item.icon}
              text={item.text}
              isImage={item.isImage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialCard;