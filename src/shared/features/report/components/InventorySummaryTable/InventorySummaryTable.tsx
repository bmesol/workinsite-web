import { Eye } from 'lucide-react';
import { AvailableBadge } from '../InventoryAvailableBadge/InventoryAvailableBadge';
import type { MaterialSummary } from '../../utils/TransformInventorySummary';
import { fmtQty } from '../../utils/TransformInventorySummary';

interface SummaryTableProps {
  materials: MaterialSummary[];
  onView: (materialId: number) => void;
  startIndex?: number;
}

export function SummaryTable({ materials, onView, startIndex = 1 }: SummaryTableProps) {
  const th = 'px-3 py-3 font-semibold text-slate-600 whitespace-nowrap';
  const thStyle = { fontSize: 'var(--font-xs)' };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full border-collapse min-w-[820px]" style={{ fontSize: 'var(--font-sm)' }}>
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className={`${th} text-left`} style={thStyle}>S.No</th>
            <th className={`${th} text-left`} style={thStyle}>Material</th>
            <th className={`${th} text-left`} style={thStyle}>Unit</th>
            <th className={`${th} text-right`} style={thStyle}>Purchased</th>
            <th className={`${th} text-right`} style={thStyle}>Used</th>
            <th className={`${th} text-right`} style={thStyle}>Transfer In</th>
            <th className={`${th} text-right`} style={thStyle}>Transfer Out</th>
            <th className={`${th} text-center`} style={thStyle}>Available Stock</th>
            <th className={`${th} text-right`} style={thStyle}>Transaction Sites</th>
            <th className={`${th} text-center`} style={thStyle}>View Details</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m, i) => (
            <tr
              key={m.materialId}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="px-3 py-2.5 text-slate-500" style={{ fontSize: 'var(--font-xs)' }}>{startIndex + i}</td>
              <td className="px-3 py-2.5 font-medium text-slate-800 whitespace-nowrap">{m.materialName}</td>
              <td className="px-3 py-2.5 text-slate-500" style={{ fontSize: 'var(--font-xs)' }}>{m.unit}</td>
              <td className="px-3 py-2.5 text-right text-slate-700 tabular-nums">{fmtQty(m.totalPurchased)}</td>
              <td className="px-3 py-2.5 text-right text-slate-700 tabular-nums">{fmtQty(m.totalUsed)}</td>
              <td className="px-3 py-2.5 text-right text-slate-700 tabular-nums">{fmtQty(m.totalTransferIn)}</td>
              <td className="px-3 py-2.5 text-right text-slate-700 tabular-nums">{fmtQty(m.totalTransferOut)}</td>
              <td className="px-3 py-2.5 text-center whitespace-nowrap">
                <AvailableBadge qty={fmtQty(m.totalAvailable)} unit={m.unit} />
              </td>
              <td className="px-3 py-2.5 text-right text-slate-700 tabular-nums">{m.activeSites}</td>
              <td className="px-3 py-2.5 text-center">
                <button
                  onClick={() => onView(m.materialId)}
                  title={`View site-wise details for ${m.materialName}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  <Eye size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
