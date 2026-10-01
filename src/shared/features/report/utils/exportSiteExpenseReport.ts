import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { SiteExpenseReportItem } from '../DTOs/SiteExpenseReportProps';
import { formatINR } from '@/shared/utils/formatters';

const HEADER_BG = 'FF2563EB';

const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top:    { style: 'thin', color: { argb: 'FFD1D5DB' } },
  left:   { style: 'thin', color: { argb: 'FFD1D5DB' } },
  bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
  right:  { style: 'thin', color: { argb: 'FFD1D5DB' } },
};

function styleHeaderRow(row: ExcelJS.Row) {
  row.height = 22;
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_BG } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = THIN_BORDER;
  });
}

function styleDataRow(row: ExcelJS.Row) {
  row.height = 18;
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = THIN_BORDER;
    cell.alignment = { vertical: 'middle' };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// EXCEL EXPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prepends title / period / generated-at rows to a worksheet and returns the
 * row number where the blue column-header row should be placed.
 * colCount drives the merge range (e.g. 7 → A:G).
 */
function addReportHeader(
  sheet: ExcelJS.Worksheet,
  title: string,
  colCount: number,
  generatedAt: string,
  dateRange?: { from: string; to: string },
): number {
  const lastCol = String.fromCharCode(64 + colCount);

  const titleRow = sheet.addRow([title]);
  titleRow.height = 26;
  titleRow.getCell(1).font = { bold: true, size: 16, color: { argb: 'FF0F172A' } };
  titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.mergeCells(`A${titleRow.number}:${lastCol}${titleRow.number}`);

  const infoText = dateRange?.from && dateRange?.to
    ? `Period: ${dateRange.from} – ${dateRange.to}   |   Generated: ${generatedAt}`
    : `Generated: ${generatedAt}`;
  const infoRow = sheet.addRow([infoText]);
  infoRow.height = 18;
  infoRow.getCell(1).font = { size: 8, color: { argb: 'FF94A3B8' } };
  infoRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.mergeCells(`A${infoRow.number}:${lastCol}${infoRow.number}`);

  return infoRow.number + 1;
}

export async function exportToExcel(
  sites: SiteExpenseReportItem[],
  fileName = 'Site_Expense_Report',
  dateRange?: { from: string; to: string },
) {
  const workbook = new ExcelJS.Workbook();
  const generatedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  // ── Sheet 1: Summary ──────────────────────────────────────────────────────
  const summarySheet = workbook.addWorksheet('Summary');
  summarySheet.columns = [
    { width: 8  }, { width: 30 }, { width: 20 }, { width: 20 },
    { width: 22 }, { width: 20 }, { width: 18 },
  ];
  const summaryColHdrRow = addReportHeader(summarySheet, 'Site-Wise Expense Summary Report', 7, generatedAt, dateRange);
  const summaryHeaders = ['S.No', 'Site Name', 'Purchase Amt', 'Material Amt', 'Client Txns', 'Worker Salary', 'Total Expense'];
  styleHeaderRow(summarySheet.addRow(summaryHeaders));
  summarySheet.views = [{ state: 'frozen', xSplit: 0, ySplit: summaryColHdrRow }];

  sites.forEach((site, i) => {
    const row = summarySheet.addRow([
      i + 1, site.siteName,
      Number(site.totalPurchaseAmount), Number(site.totalMaterialAmount),
      Number(site.totalClientTransactionAmount), Number(site.totalWorkerSalaryAmount), Number(site.totalExpense),
    ]);
    styleDataRow(row);
    for (let c = 3; c <= 7; c++) row.getCell(c).numFmt = '₹#,##0.00';
  });

  // Grand total row
  const grandTotalRow = summarySheet.addRow([
    '', 'Grand Total',
    sites.reduce((s, x) => s + Number(x.totalPurchaseAmount), 0),
    sites.reduce((s, x) => s + Number(x.totalMaterialAmount), 0),
    sites.reduce((s, x) => s + Number(x.totalClientTransactionAmount), 0),
    sites.reduce((s, x) => s + Number(x.totalWorkerSalaryAmount), 0),
    sites.reduce((s, x) => s + Number(x.totalExpense), 0),
  ]);
  grandTotalRow.height = 20;
  grandTotalRow.eachCell({ includeEmpty: true }, (cell, col) => {
    cell.font = { bold: true };
    cell.border = THIN_BORDER;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    if (col >= 3) cell.numFmt = '₹#,##0.00';
  });

  // ── Sheet 2: Purchases ────────────────────────────────────────────────────
  const purchasesSheet = workbook.addWorksheet('Purchases');
  purchasesSheet.columns = [
    { width: 8 }, { width: 30 }, { width: 18 }, { width: 16 }, { width: 30 }, { width: 18 },
  ];
  const purchasesColHdrRow = addReportHeader(purchasesSheet, 'Purchases – Site-Wise Expense Summary Report', 6, generatedAt, dateRange);
  styleHeaderRow(purchasesSheet.addRow(['S.No', 'Site Name', 'Date', 'Bill No', 'Supplier', 'Amount']));
  purchasesSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: purchasesColHdrRow }];
  let pIdx = 1;
  sites.forEach((site) => {
    site.purchases.forEach((p) => {
      const billVal = String(p.billNumber);
      const row = purchasesSheet.addRow([pIdx++, site.siteName, p.date, billVal, p.supplier.name, Number(p.totalAmount)]);
      styleDataRow(row);
      // Force t="str" (formula string) so Excel never raises "number stored as text".
      // ExcelJS 4.x has no quotePrefix support; formula cells are the only way to
      // suppress the green triangle for numeric-looking text in this version.
      row.getCell(4).value = { formula: `"${billVal.replace(/"/g, '""')}"`, result: billVal };
      row.getCell(6).numFmt = '₹#,##0.00';
    });
  });

  // ── Sheet 3: Materials ────────────────────────────────────────────────────
  const materialsSheet = workbook.addWorksheet('Materials');
  materialsSheet.columns = [
    { width: 8 }, { width: 30 }, { width: 30 }, { width: 12 }, { width: 16 }, { width: 18 },
  ];
  const materialsColHdrRow = addReportHeader(materialsSheet, 'Materials – Site-Wise Expense Summary Report', 6, generatedAt, dateRange);
  styleHeaderRow(materialsSheet.addRow(['S.No', 'Site Name', 'Material', 'Unit', 'Total Qty', 'Total Amount']));
  materialsSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: materialsColHdrRow }];
  let mIdx = 1;
  sites.forEach((site) => {
    site.materials.forEach((m) => {
      const row = materialsSheet.addRow([mIdx++, site.siteName, m.material.name, m.material.unit.name, Number(m.totalQuantity), Number(m.totalAmount)]);
      styleDataRow(row);
      row.getCell(6).numFmt = '₹#,##0.00';
    });
  });

  // ── Sheet 4: Client Transactions ──────────────────────────────────────────
  const clientSheet = workbook.addWorksheet('Client Txns');
  clientSheet.columns = [
    { width: 8 }, { width: 30 }, { width: 18 }, { width: 30 }, { width: 18 }, { width: 16 }, { width: 30 },
  ];
  const clientColHdrRow = addReportHeader(clientSheet, 'Client Transactions – Site-Wise Expense Summary Report', 7, generatedAt, dateRange);
  styleHeaderRow(clientSheet.addRow(['S.No', 'Site Name', 'Date', 'Client', 'Amount', 'Payment Method', 'Remark']));
  clientSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: clientColHdrRow }];
  let ctIdx = 1;
  sites.forEach((site) => {
    site.clientTransactions.forEach((ct) => {
      const row = clientSheet.addRow([ctIdx++, site.siteName, ct.date, ct.client.name, Number(ct.amount), ct.paymentMethod, ct.remark ?? '']);
      styleDataRow(row);
      row.getCell(5).numFmt = '₹#,##0.00';
    });
  });

  // ── Sheet 5: Workers ──────────────────────────────────────────────────────
  const workersSheet = workbook.addWorksheet('Workers');
  workersSheet.columns = [
    { width: 8 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 18 },
  ];
  const workersColHdrRow = addReportHeader(workersSheet, 'Workers – Site-Wise Expense Summary Report', 5, generatedAt, dateRange);
  styleHeaderRow(workersSheet.addRow(['S.No', 'Site Name', 'Worker Name', 'Category', 'Total Amount']));
  workersSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: workersColHdrRow }];
  let wIdx = 1;
  sites.forEach((site) => {
    site.workers.forEach((w) => {
      const row = workersSheet.addRow([wIdx++, site.siteName, w.name, w.workerCategoryName, Number(w.totalAmount)]);
      styleDataRow(row);
      row.getCell(5).numFmt = '₹#,##0.00';
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF EXPORT (₹ fix)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a font and return it as a binary string.
 * Throws if the response is not OK or the file is not a real TrueType font
 * (Vite/React dev servers return index.html with HTTP 200 for missing files,
 * which is what caused jsPDF to silently fall back to Helvetica and print "¹").
 */
async function loadFontBinaryStr(path: string): Promise<string> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Font fetch failed: ${res.status} ${path}`);
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);

  // TTF magic bytes: 00 01 00 00
  const isTTF = bytes[0] === 0x00 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00;
  if (!isTTF) throw new Error(`Not a valid .ttf file (got HTML or another format): ${path}`);

  const arr = new Array<string>(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = String.fromCharCode(bytes[i]);
  return arr.join('');
}

export async function exportToPDF(
  sites: SiteExpenseReportItem[],
  fileName = 'Site_Expense_Report',
  dateRange?: { from: string; to: string },
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // ── Font setup ────────────────────────────────────────────────────────────
  let fontName = 'helvetica';
  let fontOk = false;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const base: string = (import.meta as any).env?.BASE_URL ?? '/';
    const [regularStr, boldStr] = await Promise.all([
      loadFontBinaryStr(`${base}fonts/NotoSans-Regular.ttf`),
      loadFontBinaryStr(`${base}fonts/NotoSans-Bold.ttf`),
    ]);
    doc.addFileToVFS('NotoSans-Regular.ttf', regularStr);
    doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal', undefined, 'Identity-H');
    doc.addFileToVFS('NotoSans-Bold.ttf', boldStr);
    doc.addFont('NotoSans-Bold.ttf', 'NotoSans', 'bold', undefined, 'Identity-H');
    fontName = 'NotoSans';
    fontOk = true;
  } catch (fontErr) {
    console.error('[PDF Export] Unicode font load failed — using Helvetica with "Rs." instead of ₹:', fontErr);
  }
  doc.setFont(fontName, 'normal');

  // Currency formatter: real ₹ when Noto Sans loaded, otherwise "Rs." (never "¹")
  const money = (v: number | string) =>
    fontOk ? formatINR(v) : formatINR(v).replace(/₹\s*/g, 'Rs. ');

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;

  const drawPageNumber = () => {
    doc.setFont(fontName, 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pageW / 2, pageH - 6, { align: 'center' });
  };

  const generatedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  // ── Page 1: title + summary table ─────────────────────────────────────────
  doc.setFont(fontName, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${generatedAt}`, pageW - margin, 8, { align: 'right' });

  doc.setFont(fontName, 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('Site-Wise Expense Summary Report', pageW / 2, 18, { align: 'center' });

  let curY = 26;
  if (dateRange?.from && dateRange?.to) {
    doc.setFont(fontName, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Period: ${dateRange.from} – ${dateRange.to}`, pageW / 2, 26, { align: 'center' });
    curY = 34;
  }

  const sum = (key: keyof SiteExpenseReportItem) =>
    sites.reduce((s, x) => s + Number(x[key] as number | string), 0);

  autoTable(doc, {
    startY: curY,
    head: [['S.No', 'Site Name', 'Purchase Amt', 'Material Amt', 'Client Txns', 'Worker Salary', 'Total Expense']],
    body: [
      ...sites.map((site, i) => [
        i + 1,
        site.siteName,
        money(site.totalPurchaseAmount),
        money(site.totalMaterialAmount),
        money(site.totalClientTransactionAmount),
        money(site.totalWorkerSalaryAmount),
        money(site.totalExpense),
      ]),
      [
        '', 'Grand Total',
        money(sum('totalPurchaseAmount')),
        money(sum('totalMaterialAmount')),
        money(sum('totalClientTransactionAmount')),
        money(sum('totalWorkerSalaryAmount')),
        money(sum('totalExpense')),
      ],
    ],
    margin: { left: margin, right: margin },
    styles: {
      font: fontName, fontSize: 8,
      cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
      lineColor: [203, 213, 225], lineWidth: 0.25, valign: 'middle', textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [37, 99, 235], textColor: [255, 255, 255],
      fontStyle: 'bold', fontSize: 8.5, halign: 'center',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'left', cellWidth: 'auto' },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 35 },
      4: { halign: 'right', cellWidth: 35 },
      5: { halign: 'right', cellWidth: 35 },
      6: { halign: 'right', cellWidth: 35 },
    },
    // Make the Grand Total row bold
    didParseCell: (data) => {
      if (data.section === 'body' && data.row.index === sites.length) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [226, 232, 240];
      }
    },
    didDrawPage: drawPageNumber,
  });

  // ── Per-site detail pages ─────────────────────────────────────────────────
  // Shared helper: draws a blue section title + a table, returns the next Y.
  const addSection = (
    y: number,
    title: string,
    head: string[],
    body: (string | number)[][],
    foot: string[],
  ): number => {
    // Avoid a title stranded at the bottom of a page
    if (y > pageH - 35) {
      doc.addPage();
      y = 14;
    }

    doc.setFont(fontName, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(37, 99, 235);
    doc.text(title, margin, y);

    autoTable(doc, {
      startY: y + 2,
      head: [head],
      body,
      foot: [foot],
      margin: { left: margin, right: margin },
      styles: { font: fontName, fontSize: 7.5, textColor: [30, 41, 59] },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
      footStyles: { fillColor: [248, 250, 252], textColor: [30, 41, 59], fontStyle: 'bold' },
      didDrawPage: drawPageNumber,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (doc as any).lastAutoTable.finalY + 8;
  };

  const sitesWithData = sites.filter(
    (s) => s.purchases.length > 0 || s.materials.length > 0 || s.clientTransactions.length > 0 || s.workers.length > 0,
  );

  sitesWithData.forEach((site) => {
    doc.addPage();
    let y = 14;

    doc.setFont(fontName, 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(site.siteName, margin, y);
    y += 10;

    if (site.purchases.length > 0) {
      y = addSection(
        y,
        'Purchases',
        ['S.No', 'Date', 'Bill No', 'Supplier', 'Amount'],
        site.purchases.map((p, i) => [i + 1, p.date, p.billNumber, p.supplier.name, money(p.totalAmount)]),
        ['', 'Total', '', '', money(site.totalPurchaseAmount)],
      );
    }

    if (site.materials.length > 0) {
      y = addSection(
        y,
        'Materials',
        ['S.No', 'Material', 'Unit', 'Total Qty', 'Total Amount'],
        site.materials.map((m, i) => [
          i + 1,
          m.material.name,
          m.material.unit.name,
          Number(m.totalQuantity).toLocaleString('en-IN'),
          money(m.totalAmount),
        ]),
        ['', 'Total', '', '', money(site.totalMaterialAmount)],
      );
    }

    if (site.clientTransactions.length > 0) {
      y = addSection(
        y,
        'Client Transactions',
        ['S.No', 'Date', 'Client', 'Amount', 'Payment Method', 'Remark'],
        site.clientTransactions.map((ct, i) => [
          i + 1, ct.date, ct.client.name, money(ct.amount), ct.paymentMethod, ct.remark ?? '—',
        ]),
        ['', 'Total', '', money(site.totalClientTransactionAmount), '', ''],
      );
    }

    if (site.workers.length > 0) {
      y = addSection(
        y,
        'Workers',
        ['S.No', 'Worker Name', 'Category', 'Total Amount'],
        site.workers.map((w, i) => [i + 1, w.name, w.workerCategoryName, money(w.totalAmount)]),
        ['', 'Total', '', money(site.totalWorkerSalaryAmount)],
      );
    }
  });

  doc.save(`${fileName}.pdf`);
}