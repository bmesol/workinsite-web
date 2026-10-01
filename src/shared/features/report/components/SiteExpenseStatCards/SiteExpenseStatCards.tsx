import {
  Building2,
  ShoppingCart,
  Wallet,
  HardHat,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react';
import { formatINR } from '@/shared/utils/formatters';

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
    <div
      className={`
        flex items-center gap-3 rounded-xl border px-4 py-3
        ${c.card}
        w-full
      `}
    >
      {/* Icon */}
      <div
        className={`
          w-11 h-11 rounded-xl
          flex items-center justify-center
          shrink-0
          ${c.iconWrap}
        `}
      >
        <Icon size={20} className={c.iconColor} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={`font-semibold ${c.labelColor} leading-tight`}
          style={{ fontSize: 'var(--font-xs)' }}
        >
          {c.label}
        </p>

        <p
          className="font-bold text-slate-800 leading-tight tabular-nums whitespace-nowrap"
          style={{ fontSize: 'var(--font-xl)' }}
        >
          {c.value}
        </p>

        <p
          className="text-slate-400 leading-tight"
          style={{ fontSize: 'var(--font-xs)' }}
        >
          {c.sub}
        </p>
      </div>
    </div>
  );
}

interface SiteExpenseStatCardsProps {
  totalSites: number;
  totalPurchaseAmount: number;
  totalClientTransactionAmount: number;
  totalWorkerSalaryAmount: number;
  totalExpense: number;
}

export function SiteExpenseStatCards({
  totalSites,
  totalPurchaseAmount,
  totalClientTransactionAmount,
  totalWorkerSalaryAmount,
  totalExpense,
}: SiteExpenseStatCardsProps) {
  const cards: StatCardConfig[] = [
    {
      label: 'Total Sites',
      value: String(totalSites),
      sub: 'Sites in report',
      icon: Building2,
      card: 'bg-indigo-50/50 border-indigo-100',
      iconWrap: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      labelColor: 'text-indigo-600',
    },
    {
      label: 'Total Purchase Amount',
      value: formatINR(totalPurchaseAmount),
      sub: 'Across all sites',
      icon: ShoppingCart,
      card: 'bg-emerald-50/50 border-emerald-100',
      iconWrap: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      labelColor: 'text-emerald-600',
    },
    {
      label: 'Total Client Transactions',
      value: formatINR(totalClientTransactionAmount),
      sub: 'Received from clients',
      icon: Wallet,
      card: 'bg-blue-50/50 border-blue-100',
      iconWrap: 'bg-blue-100',
      iconColor: 'text-blue-600',
      labelColor: 'text-blue-600',
    },
    {
      label: 'Total Worker Salary',
      value: formatINR(totalWorkerSalaryAmount),
      sub: 'Across all sites',
      icon: HardHat,
      card: 'bg-amber-50/50 border-amber-100',
      iconWrap: 'bg-amber-100',
      iconColor: 'text-amber-600',
      labelColor: 'text-amber-600',
    },
    {
      label: 'Total Expense',
      value: formatINR(totalExpense),
      sub: 'Purchase + Worker salary',
      icon: TrendingDown,
      card: 'bg-red-50/50 border-red-100',
      iconWrap: 'bg-red-100',
      iconColor: 'text-red-600',
      labelColor: 'text-red-600',
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-3
        xl:grid-cols-5
        gap-3
        px-4
        py-3
        mt-2
      "
    >
      {cards.map((c) => (
        <StatCard key={c.label} c={c} />
      ))}
    </div>
  );
}