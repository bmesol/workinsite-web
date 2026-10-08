import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AvailableMaterialReport } from '@/shared/features/materials/service/MaterialUsedService';
import {
  THIN_BORDER,
  styleHeaderRow,
  styleDataRow,
  addReportHeader,
  loadFontBinaryStr,
} from './reportExportHelpers';

const QTY_FMT = '#,##0.##';

export async function exportAvailableMaterialToExcel(
  data: AvailableMaterialReport[],
  filters?: { site?: string; date?: string },
  fileName = 'Available_Material_Report',
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const generatedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const dateRange = filters?.date
    ? { from: filters.date, to: filters.date }
    : undefined;

  const sheet = workbook.addWorksheet('Available Materials');
  sheet.columns = [{ width: 8 }, { width: 36 }, { width: 16 }, { width: 22 }];

  const hdrRowNum = addReportHeader(
    sheet,
    filters?.site
      ? `Available Material Report – ${filters.site}`
      : 'Available Material Report',
    4,
    generatedAt,
    dateRange,
  );
  styleHeaderRow(sheet.addRow(['S.No', 'Material', 'Unit', 'Available Quantity']));
  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: hdrRowNum }];

  data.forEach((item, i) => {
    const row = sheet.addRow([
      i + 1,
      item.material.name,
      item.material.unit.name,
      parseFloat(item.availableQuantity),
    ]);
    styleDataRow(row);
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
    row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(4).numFmt = QTY_FMT;
    row.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
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

export async function exportAvailableMaterialToPDF(
  data: AvailableMaterialReport[],
  filters?: { site?: string; date?: string },
  fileName = 'Available_Material_Report',
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;

  let fontName = 'helvetica';
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
  } catch (fontErr) {
    console.error('[PDF Export] Unicode font load failed — using Helvetica:', fontErr);
  }
  doc.setFont(fontName, 'normal');

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
  doc.text('Available Material Report', pageW / 2, 18, { align: 'center' });

  let tableY = 26;

  if (filters?.site || filters?.date) {
    doc.setFont(fontName, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    const parts: string[] = [];
    if (filters.site) parts.push(`Site: ${filters.site}`);
    if (filters.date) parts.push(`Date: ${filters.date}`);
    doc.text(parts.join('   |   '), pageW / 2, 26, { align: 'center' });
    tableY = 34;
  }

  const body: (string | number)[][] = data.map((item, i) => [
    i + 1,
    item.material.name,
    item.material.unit.name,
    item.availableQuantity,
  ]);

  autoTable(doc, {
    startY: tableY,
    head: [['S.No', 'Material', 'Unit', 'Available Quantity']],
    body,
    margin: { left: margin, right: margin },
    styles: {
      font: fontName,
      fontSize: 9,
      cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
      lineColor: [203, 213, 225],
      lineWidth: 0.25,
      valign: 'middle',
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9.5,
      halign: 'center',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 16 },
      1: { halign: 'left', cellWidth: 'auto' },
      2: { halign: 'center', cellWidth: 26 },
      3: { halign: 'right', cellWidth: 36 },
    },
    didDrawPage: drawPageNumber,
  });

  doc.save(`${fileName}.pdf`);
}
