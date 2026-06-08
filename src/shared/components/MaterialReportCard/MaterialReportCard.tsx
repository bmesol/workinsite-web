import type { AvailableMaterialReport } from '@/shared/features/materials/service/MaterialUsedService';

type Props = {
  item: AvailableMaterialReport;
};

const MaterialReportCard = ({ item }: Props) => {
  const qty = parseFloat(item.availableQuantity);
  const isNegative = qty < 0;

  return (
    <div
      className="bg-white rounded-xl  my-1.5 p-4 shadow-sm border-l-4"
      style={{ borderLeftColor: 'var(--primary)' }}
    >
      <div className="flex items-center justify-between">
        {/* Info */}
        <div className="flex-1 mr-3">
          <span className="text-sm font-semibold text-gray-900 block">
            {item.material.name}
          </span>
          {item.material.hsnCode && (
            <span className="text-sm text-gray-500 mt-0.5 block">
              HSN: {item.material.hsnCode}
            </span>
          )}
          <span className="text-xs text-gray-500 mt-0.5 block">
            Unit: {item.material.unit.name}
          </span>
        </div>

        {/* Quantity Badge */}
        <div
          className="rounded-lg px-3 py-1.5 flex flex-col items-center min-w-[72px]"
          style={{ backgroundColor: isNegative ? '#FEE2E2' : '#DCFCE7' }}
        >
          <span
            className="text-base font-bold"
            style={{ color: isNegative ? '#DC2626' : '#16A34A' }}
          >
            {item.availableQuantity}
          </span>
          <span
            className="text-xs font-medium mt-0.5"
            style={{ color: isNegative ? '#DC2626' : '#16A34A' }}
          >
            {item.material.unit.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export { MaterialReportCard };