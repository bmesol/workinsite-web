import {
  Boxes,
  PackagePlus,
  PackageMinus,
  ArrowDownToLine,
  ArrowUpFromLine,
  PackageCheck,
  type LucideIcon,
} from 'lucide-react';
import { fmtQty } from '../../utils/TransformInventorySummary';

interface StatCardConfig {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  card: string;
  iconWrap: string;
  iconColor: string;
  labelColor: string;
}

function StatCard({ c }: { c: StatCardConfig }) {
  const Icon = c.icon;
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${c.card}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.iconWrap}`}>
        <Icon size={20} className={c.iconColor} />
      </div>
      <div className="min-w-0">
        <p className={`font-semibold ${c.labelColor}`} style={{ fontSize: 'var(--font-xs)' }}>{c.label}</p>
        <p className="font-bold text-slate-800 leading-tight tabular-nums" style={{ fontSize: 'var(--font-xl)' }}>{c.value}</p>
        <p className="text-slate-400" style={{ fontSize: 'var(--font-xs)' }}>{c.sub}</p>
      </div>
    </div>
  );
}

interface SummaryCardsProps {
  totalMaterials: number;
  totals: {
    purchased: number;
    used: number;
    transferIn: number;
    transferOut: number;
    available: number;
  };
}

export function SummaryCards({ totalMaterials, totals }: SummaryCardsProps) {
  const cards: StatCardConfig[] = [
    {
      label: 'Total Materials',
      value: String(totalMaterials),
      sub: 'Types of materials',
      icon: Boxes,
      card: 'bg-indigo-50/50 border-indigo-100',
      iconWrap: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      labelColor: 'text-indigo-600',
    },
    {
      label: 'Total Purchased',
      value: fmtQty(totals.purchased),
      sub: 'Across all sites',
      icon: PackagePlus,
      card: 'bg-emerald-50/50 border-emerald-100',
      iconWrap: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      labelColor: 'text-emerald-600',
    },
    {
      label: 'Total Used',
      value: fmtQty(totals.used),
      sub: 'Across all sites',
      icon: PackageMinus,
      card: 'bg-amber-50/50 border-amber-100',
      iconWrap: 'bg-amber-100',
      iconColor: 'text-amber-600',
      labelColor: 'text-amber-600',
    },
    {
      label: 'Total Transfer In',
      value: fmtQty(totals.transferIn),
      sub: 'Across all sites',
      icon: ArrowDownToLine,
      card: 'bg-blue-50/50 border-blue-100',
      iconWrap: 'bg-blue-100',
      iconColor: 'text-blue-600',
      labelColor: 'text-blue-600',
    },
    {
      label: 'Total Transfer Out',
      value: fmtQty(totals.transferOut),
      sub: 'Across all sites',
      icon: ArrowUpFromLine,
      card: 'bg-orange-50/50 border-orange-100',
      iconWrap: 'bg-orange-100',
      iconColor: 'text-orange-600',
      labelColor: 'text-orange-600',
    },
    {
      label: 'Total Available Stock',
      value: fmtQty(totals.available),
      sub: 'Across all sites',
      icon: PackageCheck,
      card: 'bg-violet-50/50 border-violet-100',
      iconWrap: 'bg-violet-100',
      iconColor: 'text-violet-600',
      labelColor: 'text-violet-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 px-4 py-3 mt-2">
      {cards.map((c) => (
        <StatCard key={c.label} c={c} />
      ))}
    </div>
  );
}
