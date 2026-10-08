import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { WorkerReportSummaryItem } from '../DTOs/WorkerreportProps';
import { formatINR } from '@/shared/utils/formatters';
import {
  THIN_BORDER,
  styleHeaderRow,
  styleDataRow,
  addReportHeader,
  loadFontBinaryStr,
} from './reportExportHelpers';

// ─────────────────────────────────────────────────────────────────────────────
// EXCEL EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export async function exportWorkerReportToExcel(
  reports: WorkerReportSummaryItem[],
  dateRange?: { from: string; to: string },
  fileName = 'Worker_Report',
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const generatedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const sheet = workbook.addWorksheet('Worker Report');
  sheet.columns = [
    { width: 8 },
    { width: 34 },
    { width: 28 },
    { width: 22 },
  ];

  const hdrRowNum = addReportHeader(sheet, 'Worker Report', 4, generatedAt, dateRange);
  styleHeaderRow(sheet.addRow(['S.No', 'Worker Name', 'Category', 'Amount']));
  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: hdrRowNum }];

  reports.forEach((item, i) => {
    const row = sheet.addRow([i + 1, item.workerName, item.workerCategoryName, Number(item.amount)]);
    styleDataRow(row);
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
    row.getCell(3).alignment = { horizontal: 'left', vertical: 'middle' };
    row.getCell(4).numFmt = '₹#,##0.00';
    row.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
  });

  const grandTotal = reports.reduce((sum, r) => sum + Number(r.amount), 0);
  const totalRow = sheet.addRow(['', 'Grand Total', '', grandTotal]);
  totalRow.height = 20;
  totalRow.eachCell({ includeEmpty: true }, (cell, col) => {
    cell.font = { bold: true };
    cell.border = THIN_BORDER;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    if (col === 4) {
      cell.numFmt = '₹#,##0.00';
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    }
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
// PDF EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export async function exportWorkerReportToPDF(
  reports: WorkerReportSummaryItem[],
  dateRange?: { from: string; to: string },
  fileName = 'Worker_Report',
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;

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

  const money = (v: number | string) =>
    fontOk ? formatINR(v) : formatINR(v).replace(/₹\s*/g, 'Rs. ');

  const generatedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const drawPageNumber = () => {
    doc.setFont(fontName, 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pageW / 2, pageH - 6, { align: 'center' });
  };

  doc.setFont(fontName, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${generatedAt}`, pageW - margin, 8, { align: 'right' });

  doc.setFont(fontName, 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('Worker Report', pageW / 2, 18, { align: 'center' });

  let tableY = 26;
  if (dateRange?.from && dateRange?.to) {
    doc.setFont(fontName, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Period: ${dateRange.from} – ${dateRange.to}`, pageW / 2, 26, { align: 'center' });
    tableY = 34;
  }

  const grandTotal = reports.reduce((sum, r) => sum + Number(r.amount), 0);

  autoTable(doc, {
    startY: tableY,
    head: [['S.No', 'Worker Name', 'Category', 'Amount']],
    body: [
      ...reports.map((item, i) => [
        i + 1,
        item.workerName,
        item.workerCategoryName,
        money(item.amount),
      ]),
      ['', 'Grand Total', '', money(grandTotal)],
    ],
    margin: { left: margin, right: margin },
    styles: {
      font: fontName, fontSize: 9,
      cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
      lineColor: [203, 213, 225], lineWidth: 0.25, valign: 'middle', textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [37, 99, 235], textColor: [255, 255, 255],
      fontStyle: 'bold', fontSize: 9.5, halign: 'center',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 16 },
      1: { halign: 'left', cellWidth: 'auto' },
      2: { halign: 'left', cellWidth: 46 },
      3: { halign: 'right', cellWidth: 36 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.row.index === reports.length) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [226, 232, 240];
      }
    },
    didDrawPage: drawPageNumber,
  });

  doc.save(`${fileName}.pdf`);
}
