import { Eye, Building } from 'lucide-react';
import type { SiteExpenseReportItem } from '../../DTOs/SiteExpenseReportProps';
import { formatINR } from '@/shared/utils/formatters';

interface SiteExpenseSummaryTableProps {
  sites: SiteExpenseReportItem[];
  onView: (siteId: number) => void;
}

export function SiteExpenseSummaryTable({ sites, onView }: SiteExpenseSummaryTableProps) {
  const th = 'px-3 py-3 font-semibold text-slate-600 whitespace-nowrap';
  const thStyle = { fontSize: 'var(--font-xs)' };

  if (sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Building size={48} className="mb-4 opacity-30" />
        <p className="font-semibold text-slate-500">No sites found</p>
        <p className="mt-1" style={{ fontSize: 'var(--font-sm)' }}>
          No expense data for the selected filters
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full border-collapse min-w-[900px]" style={{ fontSize: 'var(--font-sm)' }}>
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className={`${th} text-left`} style={thStyle}>S.No</th>
            <th className={`${th} text-left`} style={thStyle}>Site Name</th>
            <th className={`${th} text-right`} style={thStyle}>Purchase Amt</th>
            <th className={`${th} text-right`} style={thStyle}>Material Amt</th>
            <th className={`${th} text-right`} style={thStyle}>Client Txns</th>
            <th className={`${th} text-right`} style={thStyle}>Worker Salary</th>
            <th className={`${th} text-right`} style={thStyle}>Total Expense</th>
            <th className={`${th} text-center`} style={thStyle}>Details</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site, i) => (
            <tr
              key={site.siteId}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="px-3 py-2.5 text-slate-500" style={{ fontSize: 'var(--font-xs)' }}>{i + 1}</td>
              <td className="px-3 py-2.5 font-medium text-slate-800 whitespace-nowrap">{site.siteName}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">
                <span className="text-emerald-700 font-medium">{formatINR(site.totalPurchaseAmount)}</span>
                <div className="text-slate-400" style={{ fontSize: 'var(--font-xs)' }}>{site.purchases.length} bills</div>
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums">
                <span className="text-slate-700">{formatINR(site.totalMaterialAmount)}</span>
                <div className="text-slate-400" style={{ fontSize: 'var(--font-xs)' }}>{site.materials.length} materials</div>
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums">
                <span className="text-blue-700 font-medium">{formatINR(site.totalClientTransactionAmount)}</span>
                <div className="text-slate-400" style={{ fontSize: 'var(--font-xs)' }}>{site.clientTransactions.length} transactions</div>
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums">
                <span className="text-amber-700 font-medium">{formatINR(site.totalWorkerSalaryAmount)}</span>
                <div className="text-slate-400" style={{ fontSize: 'var(--font-xs)' }}>{site.workers.length} workers</div>
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-red-600">
                {formatINR(site.totalExpense)}
              </td>
              <td className="px-3 py-2.5 text-center">
                <button
                  onClick={() => onView(site.siteId)}
                  title={`View expense details for ${site.siteName}`}
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
