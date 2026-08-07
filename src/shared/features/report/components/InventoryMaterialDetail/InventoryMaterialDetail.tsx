import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { AvailableBadge } from '../InventoryAvailableBadge/InventoryAvailableBadge';
import type { MaterialSummary, MaterialSiteBreakdown } from '../../utils/TransformInventorySummary';
import { fmtQty } from '../../utils/TransformInventorySummary';
import type {
  PurchaseDetail,
  UsedDetail,
  TransferDetail,
} from '../../DTOs/InventoryStockReportProps';

// ── Detail popover (generic) ────────────────────────────────────────────────────

function DetailPopover({
  rows,
  title,
  cols,
}: {
  rows: Array<Record<string, string>>;
  title: string;
  cols: Array<{ key: string; label: string; align?: 'left' | 'right' }>;
}) {
  if (!rows || rows.length === 0) return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="ml-1 inline-flex items-center text-blue-500 hover:text-blue-700 align-middle">
          <Info size={13} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 bg-white z-[300]" align="start">
        <div className="px-3 py-2 border-b border-slate-100">
          <p className="font-semibold text-slate-700" style={{ fontSize: 'var(--font-xs)' }}>{title}</p>
        </div>
        <div className="overflow-x-auto max-h-52 overflow-y-auto">
          <table className="w-full" style={{ fontSize: 'var(--font-xs)' }}>
            <thead>
              <tr className="bg-slate-50">
                {cols.map((c) => (
                  <th key={c.key} className={`px-3 py-1.5 text-${c.align ?? 'left'} text-slate-500 font-medium`}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((d, i) => (
                <tr key={i} className="border-t border-slate-100">
                  {cols.map((c) => (
                    <td key={c.key} className={`px-3 py-1.5 text-slate-700 text-${c.align ?? 'left'}`}>
                      {d[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function PurchaseDetailsPopover({ details }: { details: PurchaseDetail[] }) {
  return (
    <DetailPopover
      rows={details as unknown as Array<Record<string, string>>}
      title="Purchase Details"
      cols={[
        { key: 'date', label: 'Date' },
        { key: 'quantity', label: 'Qty', align: 'right' },
      ]}
    />
  );
}

function UsedDetailsPopover({ details }: { details: UsedDetail[] }) {
  return (
    <DetailPopover
      rows={details as unknown as Array<Record<string, string>>}
      title="Used Details"
      cols={[
        { key: 'date', label: 'Date' },
        { key: 'quantity', label: 'Qty', align: 'right' },
      ]}
    />
  );
}

function TransferDetailsPopover({ details, label }: { details: TransferDetail[]; label: string }) {
  return (
    <DetailPopover
      rows={details as unknown as Array<Record<string, string>>}
      title={`${label} Details`}
      cols={[
        { key: 'date', label: 'Date' },
        { key: 'quantity', label: 'Qty', align: 'right' },
        { key: 'siteName', label: 'Site' },
      ]}
    />
  );
}

// ── Transfer flow cell ──────────────────────────────────────────────────────────

function TransferFlowCell({
  currentSite,
  details,
  direction,
}: {
  currentSite: string;
  details: TransferDetail[];
  direction: 'in' | 'out';
}) {
  if (!details || details.length === 0)
    return <span className="text-slate-300">—</span>;

  const dateTone =
    direction === 'in' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700';

  return (
    <div className="space-y-1.5">
      {details.map((d, i) => {
        const from = direction === 'in' ? d.siteName : currentSite;
        const to = direction === 'in' ? currentSite : d.siteName;
        return (
          <div key={i} className="space-y-1" style={{ fontSize: 'var(--font-xs)' }}>
            <div className="flex items-center gap-1 font-medium text-slate-700 whitespace-nowrap">
              <span>{from}</span>
              <ArrowRight size={12} className={direction === 'in' ? 'text-emerald-500' : 'text-rose-500'} />
              <span>{to}</span>
              <span className="ml-1 tabular-nums text-slate-500">· {d.quantity}</span>
            </div>
            <span
              className={`inline-block rounded-md px-1.5 py-0.5 font-semibold ${dateTone}`}
              style={{ fontSize: 'var(--font-xs)' }}
            >
              {d.date}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Material detail (drill-down) ────────────────────────────────────────────────

interface MaterialDetailProps {
  material: MaterialSummary;
  onBack: () => void;
}

export function MaterialDetail({ material, onBack }: MaterialDetailProps) {
  const th = 'px-3 py-2.5 font-semibold text-slate-600 whitespace-nowrap';
  const thStyle = { fontSize: 'var(--font-xs)' };

  return (
    <div className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <button
            onClick={onBack}
            className="mb-1 inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700"
            style={{ fontSize: 'var(--font-sm)' }}
          >
            <ArrowLeft size={15} /> Back to overview
          </button>
          <h3 className="font-semibold text-slate-800" style={{ fontSize: 'var(--font-md)' }}>
            Site-wise details — {material.materialName}{' '}
            <span className="font-normal text-slate-400" style={{ fontSize: 'var(--font-sm)' }}>
              ({material.unit})
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 border border-slate-200">
          <span className="font-medium text-slate-500" style={{ fontSize: 'var(--font-xs)' }}>
            Total available across all sites
          </span>
          <AvailableBadge qty={fmtQty(material.totalAvailable)} unit={material.unit} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[760px]" style={{ fontSize: 'var(--font-sm)' }}>
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className={`${th} text-left`} style={thStyle}>Site</th>
              <th className={`${th} text-right`} style={thStyle}>Purchased</th>
              <th className={`${th} text-right`} style={thStyle}>Used</th>
              <th className={`${th} text-left`} style={thStyle}>Transfer In (from → site)</th>
              <th className={`${th} text-left`} style={thStyle}>Transfer Out (site → to)</th>
              <th className={`${th} text-center`} style={thStyle}>Closing Stock</th>
            </tr>
          </thead>
          <tbody>
            {material.sites.map((s: MaterialSiteBreakdown) => (
              <tr
                key={s.siteId}
                className="border-b border-slate-100 align-top hover:bg-slate-50 transition-colors"
              >
                <td className="px-3 py-3 font-medium text-slate-800 whitespace-nowrap">{s.siteName}</td>
                <td className="px-3 py-3 text-right text-slate-700 whitespace-nowrap tabular-nums">
                  {s.purchaseQuantity}
                  <PurchaseDetailsPopover details={s.purchaseDetails} />
                </td>
                <td className="px-3 py-3 text-right text-slate-700 whitespace-nowrap tabular-nums">
                  {s.usedQuantity}
                  <UsedDetailsPopover details={s.usedDetails} />
                </td>
                <td className="px-3 py-3">
                  <TransferFlowCell currentSite={s.siteName} details={s.transferInDetails} direction="in" />
                </td>
                <td className="px-3 py-3">
                  <TransferFlowCell currentSite={s.siteName} details={s.transferOutDetails} direction="out" />
                </td>
                <td className="px-3 py-3 text-center whitespace-nowrap">
                  <AvailableBadge qty={s.availableStock} unit={material.unit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
