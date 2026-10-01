import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { SiteExpenseReportItem } from '../../DTOs/SiteExpenseReportProps';
import { formatINR } from '@/shared/utils/formatters';
import { EmptyState } from '@/shared/components/EmptyState/EmptyState';

type TabKey = 'purchases' | 'materials' | 'clientTransactions' | 'workers';

const PAYMENT_METHOD_STYLES: Record<string, string> = {
  Cheque: 'bg-slate-100 text-slate-700',
  UPI:    'bg-blue-100 text-blue-700',
  Cash:   'bg-green-100 text-green-700',
  NEFT:   'bg-violet-100 text-violet-700',
};

function PaymentBadge({ method }: { method: string }) {
  const style = PAYMENT_METHOD_STYLES[method] ?? 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 font-medium ${style}`} style={{ fontSize: 'var(--font-xs)' }}>
      {method}
    </span>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 ${color}`}>
      <span className="font-medium" style={{ fontSize: 'var(--font-xs)' }}>{label}</span>
      <span className="font-semibold tabular-nums" style={{ fontSize: 'var(--font-sm)' }}>{value}</span>
    </div>
  );
}

interface SiteExpenseDetailProps {
  site: SiteExpenseReportItem;
  onBack: () => void;
}

export function SiteExpenseDetail({ site, onBack }: SiteExpenseDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('purchases');

  const th = 'px-3 py-2.5 font-semibold text-slate-600 whitespace-nowrap';
  const thStyle = { fontSize: 'var(--font-xs)' };
  const tdClass = 'px-3 py-2.5 border-b border-slate-100';
  const tfClass = 'px-3 py-2.5 bg-slate-50 font-semibold text-slate-700';

  const purchaseTotal = site.purchases.reduce((s, p) => s + Number(p.totalAmount), 0);
  const materialTotal = site.materials.reduce((s, m) => s + Number(m.totalAmount), 0);
  const clientTotal   = site.clientTransactions.reduce((s, c) => s + Number(c.amount), 0);
  const workerTotal   = site.workers.reduce((s, w) => s + Number(w.totalAmount), 0);

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'purchases',          label: 'Purchases',           count: site.purchases.length },
    { key: 'materials',          label: 'Materials',           count: site.materials.length },
    { key: 'clientTransactions', label: 'Client Transactions', count: site.clientTransactions.length },
    { key: 'workers',            label: 'Workers',             count: site.workers.length },
  ];

  return (
    <div className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
      {/* Drill-down header */}
      <div className="border-b border-slate-100 px-4 py-4">
        <button
          onClick={onBack}
          className="mb-2 inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700"
          style={{ fontSize: 'var(--font-sm)' }}
        >
          <ArrowLeft size={15} /> Back to overview
        </button>
        <h3 className="font-semibold text-slate-800 mb-3" style={{ fontSize: 'var(--font-md)' }}>
          {site.siteName}
        </h3>
        <div className="flex flex-wrap gap-2">
          <MiniStat label="Purchase"  value={formatINR(site.totalPurchaseAmount)}           color="text-emerald-700 bg-emerald-50 border-emerald-200" />
          <MiniStat label="Materials" value={formatINR(site.totalMaterialAmount)}           color="text-slate-700 bg-slate-50 border-slate-200" />
          <MiniStat label="Client"    value={formatINR(site.totalClientTransactionAmount)}  color="text-blue-700 bg-blue-50 border-blue-200" />
          <MiniStat label="Workers"   value={formatINR(site.totalWorkerSalaryAmount)}       color="text-amber-700 bg-amber-50 border-amber-200" />
          <MiniStat label="Expense"   value={formatINR(site.totalExpense)}                  color="text-red-700 bg-red-50 border-red-200" />
        </div>
      </div>

      {/* Tab strip */}
      <div className="flex overflow-x-auto border-b border-slate-100 px-4 gap-1 pt-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap px-3 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            style={{ fontSize: 'var(--font-sm)' }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="overflow-x-auto p-4">
        {activeTab === 'purchases' && (
          site.purchases.length === 0
            ? <EmptyState message="No purchase records found for this site in the selected period." />
            : <table className="w-full border-collapse rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden" style={{ fontSize: 'var(--font-sm)' }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className={`${th} text-left`} style={thStyle}>S.No</th>
                    <th className={`${th} text-left`} style={thStyle}>Date</th>
                    <th className={`${th} text-left`} style={thStyle}>Bill No</th>
                    <th className={`${th} text-left`} style={thStyle}>Supplier</th>
                    <th className={`${th} text-right`} style={thStyle}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {site.purchases.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className={`${tdClass} text-slate-500`} style={{ fontSize: 'var(--font-xs)' }}>{i + 1}</td>
                      <td className={`${tdClass} text-slate-700 whitespace-nowrap`}>{p.date}</td>
                      <td className={`${tdClass} text-slate-700`}>{p.billNumber}</td>
                      <td className={`${tdClass} font-medium text-slate-800`}>{p.supplier.name}</td>
                      <td className={`${tdClass} text-right tabular-nums text-slate-700`}>{formatINR(p.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className={tfClass} colSpan={4}>Total</td>
                    <td className={`${tfClass} text-right tabular-nums`}>{formatINR(purchaseTotal)}</td>
                  </tr>
                </tfoot>
              </table>
        )}

        {activeTab === 'materials' && (
          site.materials.length === 0
            ? <EmptyState message="No material records found for this site in the selected period." />
            : <table className="w-full border-collapse rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden" style={{ fontSize: 'var(--font-sm)' }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className={`${th} text-left`} style={thStyle}>S.No</th>
                    <th className={`${th} text-left`} style={thStyle}>Material</th>
                    <th className={`${th} text-left`} style={thStyle}>Unit</th>
                    <th className={`${th} text-right`} style={thStyle}>Total Qty</th>
                    <th className={`${th} text-right`} style={thStyle}>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {site.materials.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className={`${tdClass} text-slate-500`} style={{ fontSize: 'var(--font-xs)' }}>{i + 1}</td>
                      <td className={`${tdClass} font-medium text-slate-800`}>{m.material.name}</td>
                      <td className={`${tdClass} text-slate-500`}>{m.material.unit.name}</td>
                      <td className={`${tdClass} text-right tabular-nums text-slate-700`}>{Number(m.totalQuantity).toLocaleString('en-IN')}</td>
                      <td className={`${tdClass} text-right tabular-nums text-slate-700`}>{formatINR(m.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className={tfClass} colSpan={4}>Total</td>
                    <td className={`${tfClass} text-right tabular-nums`}>{formatINR(materialTotal)}</td>
                  </tr>
                </tfoot>
              </table>
        )}

        {activeTab === 'clientTransactions' && (
          site.clientTransactions.length === 0
            ? <EmptyState message="No client transaction records found for this site in the selected period." />
            : <table className="w-full border-collapse rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden" style={{ fontSize: 'var(--font-sm)' }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className={`${th} text-left`} style={thStyle}>S.No</th>
                    <th className={`${th} text-left`} style={thStyle}>Date</th>
                    <th className={`${th} text-left`} style={thStyle}>Client</th>
                    <th className={`${th} text-right`} style={thStyle}>Amount</th>
                    <th className={`${th} text-left`} style={thStyle}>Payment Method</th>
                    <th className={`${th} text-left`} style={thStyle}>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {site.clientTransactions.map((ct, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className={`${tdClass} text-slate-500`} style={{ fontSize: 'var(--font-xs)' }}>{i + 1}</td>
                      <td className={`${tdClass} text-slate-700 whitespace-nowrap`}>{ct.date}</td>
                      <td className={`${tdClass} font-medium text-slate-800`}>{ct.client.name}</td>
                      <td className={`${tdClass} text-right tabular-nums text-blue-700 font-medium`}>{formatINR(ct.amount)}</td>
                      <td className={tdClass}><PaymentBadge method={ct.paymentMethod} /></td>
                      <td className={`${tdClass} text-slate-500`}>{ct.remark || '—'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className={tfClass} colSpan={3}>Total</td>
                    <td className={`${tfClass} text-right tabular-nums`}>{formatINR(clientTotal)}</td>
                    <td className={tfClass} colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
        )}

        {activeTab === 'workers' && (
          site.workers.length === 0
            ? <EmptyState message="No worker records found for this site in the selected period." />
            : <table className="w-full border-collapse rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden" style={{ fontSize: 'var(--font-sm)' }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className={`${th} text-left`} style={thStyle}>S.No</th>
                    <th className={`${th} text-left`} style={thStyle}>Worker Name</th>
                    <th className={`${th} text-left`} style={thStyle}>Category</th>
                    <th className={`${th} text-right`} style={thStyle}>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {site.workers.map((w, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className={`${tdClass} text-slate-500`} style={{ fontSize: 'var(--font-xs)' }}>{i + 1}</td>
                      <td className={`${tdClass} font-medium text-slate-800`}>{w.name}</td>
                      <td className={`${tdClass} text-slate-600`}>{w.workerCategoryName}</td>
                      <td className={`${tdClass} text-right tabular-nums text-amber-700 font-medium`}>{formatINR(w.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className={tfClass} colSpan={3}>Total</td>
                    <td className={`${tfClass} text-right tabular-nums`}>{formatINR(workerTotal)}</td>
                  </tr>
                </tfoot>
              </table>
        )}
      </div>
    </div>
  );
}
