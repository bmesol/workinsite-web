import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { MaterialSummary } from './TransformInventorySummary';
import { toNum, fmtQty } from './TransformInventorySummary';
import {
  THIN_BORDER,
  styleHeaderRow,
  styleDataRow,
  addReportHeader,
  loadFontBinaryStr,
} from './reportExportHelpers';

function roundQty(n: number): number {
  return Math.round(n * 100) / 100;
}

// Use '#,##0' for whole numbers so no trailing decimal point is ever rendered.
// Some Excel versions and other apps show "70." with '#,##0.##' for integers.
function qtyNumFmt(n: number): string {
  return Number.isInteger(n) ? '#,##0' : '#,##0.##';
}

// ─────────────────────────────────────────────────────────────────────────────
// EXCEL EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export async function exportToExcel(
  materials: MaterialSummary[],
  dateRange?: { from: string; to: string },
  fileName = 'Inventory_Stock_Report',
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const generatedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  function makeSheet(
    name: string,
    colWidths: number[],
    colHeaders: string[],
    sheetTitle: string,
  ): ExcelJS.Worksheet {
    const sheet = workbook.addWorksheet(name);
    sheet.columns = colWidths.map((w) => ({ width: w }));
    const hdrRowNum = addReportHeader(sheet, sheetTitle, colWidths.length, generatedAt, dateRange);
    styleHeaderRow(sheet.addRow(colHeaders));
    sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: hdrRowNum }];
    return sheet;
  }

  // ── Sheet 1: Summary ────────────────────────────────────────────────────────
  const summarySheet = makeSheet(
    'Summary',
    [8, 32, 12, 16, 14, 16, 16, 18, 16],
    ['S.No', 'Material', 'Unit', 'Purchased', 'Used', 'Transfer In', 'Transfer Out', 'Available Stock', 'Active Sites'],
    'Inventory Stock Report – Summary',
  );

  materials.forEach((m, i) => {
    const row = summarySheet.addRow([
      i + 1, m.materialName, m.unit,
      roundQty(m.totalPurchased), roundQty(m.totalUsed),
      roundQty(m.totalTransferIn), roundQty(m.totalTransferOut),
      roundQty(m.totalAvailable), m.activeSites,
    ]);
    styleDataRow(row);
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    [2, 3].forEach((c) => { row.getCell(c).alignment = { horizontal: 'left', vertical: 'middle' }; });
    [4, 5, 6, 7, 8].forEach((c) => {
      row.getCell(c).numFmt = qtyNumFmt(row.getCell(c).value as number);
      row.getCell(c).alignment = { horizontal: 'right', vertical: 'middle' };
    });
    row.getCell(9).alignment = { horizontal: 'right', vertical: 'middle' };
  });

  // Grand Total row
  const gtRow = summarySheet.addRow([
    '', 'Grand Total', '',
    roundQty(materials.reduce((s, m) => s + m.totalPurchased, 0)),
    roundQty(materials.reduce((s, m) => s + m.totalUsed, 0)),
    roundQty(materials.reduce((s, m) => s + m.totalTransferIn, 0)),
    roundQty(materials.reduce((s, m) => s + m.totalTransferOut, 0)),
    roundQty(materials.reduce((s, m) => s + m.totalAvailable, 0)),
    '',
  ]);
  gtRow.height = 20;
  gtRow.eachCell({ includeEmpty: true }, (cell, col) => {
    cell.font = { bold: true };
    cell.border = THIN_BORDER;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F9FF' } };
    if (col >= 4 && col <= 8) {
      cell.numFmt = qtyNumFmt(cell.value as number);
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    } else {
      cell.alignment = {
        horizontal: col === 2 ? 'left' : 'center',
        vertical: 'middle',
      };
    }
  });

  // ── Sheet 2: Site Breakdown ─────────────────────────────────────────────────
  if (materials.some((m) => m.sites.length > 0)) {
    const siteSheet = makeSheet(
      'Site Breakdown',
      [32, 28, 16, 14, 16, 16, 18],
      ['Material', 'Site', 'Purchased', 'Used', 'Transfer In', 'Transfer Out', 'Available Stock'],
      'Inventory Stock Report – Site Breakdown',
    );

    materials.forEach((m) => {
      m.sites.forEach((site) => {
        const row = siteSheet.addRow([
          m.materialName, site.siteName,
          roundQty(toNum(site.purchaseQuantity)),
          roundQty(toNum(site.usedQuantity)),
          roundQty(toNum(site.transferInQuantity)),
          roundQty(toNum(site.transferOutQuantity)),
          roundQty(toNum(site.availableStock)),
        ]);
        styleDataRow(row);
        [1, 2].forEach((c) => { row.getCell(c).alignment = { horizontal: 'left', vertical: 'middle' }; });
        [3, 4, 5, 6, 7].forEach((c) => {
          row.getCell(c).numFmt = qtyNumFmt(row.getCell(c).value as number);
          row.getCell(c).alignment = { horizontal: 'right', vertical: 'middle' };
        });
      });
    });
  }

  // ── Sheet 3: Purchases ──────────────────────────────────────────────────────
  if (materials.some((m) => m.sites.some((s) => (s.purchaseDetails ?? []).length > 0))) {
    const purchasesSheet = makeSheet(
      'Purchases',
      [32, 28, 14, 14],
      ['Material', 'Site', 'Date', 'Quantity'],
      'Inventory Stock Report – Purchases',
    );

    materials.forEach((m) => {
      m.sites.forEach((site) => {
        (site.purchaseDetails ?? []).forEach((d) => {
          const row = purchasesSheet.addRow([
            m.materialName, site.siteName, d.date, roundQty(toNum(d.quantity)),
          ]);
          styleDataRow(row);
          [1, 2].forEach((c) => { row.getCell(c).alignment = { horizontal: 'left', vertical: 'middle' }; });
          row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
          row.getCell(4).numFmt = qtyNumFmt(row.getCell(4).value as number);
          row.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
        });
      });
    });
  }

  // ── Sheet 4: Used ──────────────────────────────────────────────────────────
  if (materials.some((m) => m.sites.some((s) => (s.usedDetails ?? []).length > 0))) {
    const usedSheet = makeSheet(
      'Used',
      [32, 28, 14, 14],
      ['Material', 'Site', 'Date', 'Quantity'],
      'Inventory Stock Report – Used',
    );

    materials.forEach((m) => {
      m.sites.forEach((site) => {
        (site.usedDetails ?? []).forEach((d) => {
          const row = usedSheet.addRow([
            m.materialName, site.siteName, d.date, roundQty(toNum(d.quantity)),
          ]);
          styleDataRow(row);
          [1, 2].forEach((c) => { row.getCell(c).alignment = { horizontal: 'left', vertical: 'middle' }; });
          row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
          row.getCell(4).numFmt = qtyNumFmt(row.getCell(4).value as number);
          row.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
        });
      });
    });
  }

  // ── Sheet 5: Transfer In ───────────────────────────────────────────────────
  if (materials.some((m) => m.sites.some((s) => (s.transferInDetails ?? []).length > 0))) {
    const tranInSheet = makeSheet(
      'Transfer In',
      [32, 28, 14, 14, 28],
      ['Material', 'Site', 'Date', 'Quantity', 'From Site'],
      'Inventory Stock Report – Transfer In',
    );

    materials.forEach((m) => {
      m.sites.forEach((site) => {
        (site.transferInDetails ?? []).forEach((d) => {
          const row = tranInSheet.addRow([
            m.materialName, site.siteName, d.date, roundQty(toNum(d.quantity)), d.siteName,
          ]);
          styleDataRow(row);
          [1, 2, 5].forEach((c) => { row.getCell(c).alignment = { horizontal: 'left', vertical: 'middle' }; });
          row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
          row.getCell(4).numFmt = qtyNumFmt(row.getCell(4).value as number);
          row.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
        });
      });
    });
  }

  // ── Sheet 6: Transfer Out ──────────────────────────────────────────────────
  if (materials.some((m) => m.sites.some((s) => (s.transferOutDetails ?? []).length > 0))) {
    const tranOutSheet = makeSheet(
      'Transfer Out',
      [32, 28, 14, 14, 28],
      ['Material', 'Site', 'Date', 'Quantity', 'To Site'],
      'Inventory Stock Report – Transfer Out',
    );

    materials.forEach((m) => {
      m.sites.forEach((site) => {
        (site.transferOutDetails ?? []).forEach((d) => {
          const row = tranOutSheet.addRow([
            m.materialName, site.siteName, d.date, roundQty(toNum(d.quantity)), d.siteName,
          ]);
          styleDataRow(row);
          [1, 2, 5].forEach((c) => { row.getCell(c).alignment = { horizontal: 'left', vertical: 'middle' }; });
          row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
          row.getCell(4).numFmt = qtyNumFmt(row.getCell(4).value as number);
          row.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
        });
      });
    });
  }

  // ── Download ───────────────────────────────────────────────────────────────
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

export async function exportToPDF(
  materials: MaterialSummary[],
  dateRange?: { from: string; to: string },
  fileName = 'Inventory_Stock_Report',
): Promise<void> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;

  // ── Font setup ────────────────────────────────────────────────────────────
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

  // Draws the report header (generated, title, period) and returns the table start Y.
  const drawPageHeader = (): number => {
    doc.setFont(fontName, 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${generatedAt}`, pageW - margin, 8, { align: 'right' });

    doc.setFont(fontName, 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text('Inventory Stock Report', pageW / 2, 18, { align: 'center' });

    if (dateRange?.from && dateRange?.to) {
      doc.setFont(fontName, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Period: ${dateRange.from} – ${dateRange.to}`, pageW / 2, 26, { align: 'center' });
      return 34;
    }
    return 26;
  };

  // Draws a blue section label + table; returns the Y position after the table.
  // Skips silently if body is empty.
  const addSection = (
    y: number,
    title: string,
    head: string[],
    body: (string | number)[][],
  ): number => {
    if (body.length === 0) return y;

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
      margin: { left: margin, right: margin },
      styles: {
        font: fontName,
        fontSize: 7.5,
        textColor: [30, 41, 59],
        lineColor: [203, 213, 225],
        lineWidth: 0.25,
        valign: 'middle',
        cellPadding: { top: 2, bottom: 2, left: 3, right: 3 },
      },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didDrawPage: drawPageNumber,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (doc as any).lastAutoTable.finalY + 8;
  };

  // ── Page 1: Material-wise summary ─────────────────────────────────────────
  const tableY = drawPageHeader();

  const summaryBody: (string | number)[][] = [
    ...materials.map((m, i) => [
      i + 1, m.materialName, m.unit,
      fmtQty(m.totalPurchased), fmtQty(m.totalUsed),
      fmtQty(m.totalTransferIn), fmtQty(m.totalTransferOut),
      fmtQty(m.totalAvailable), m.activeSites,
    ]),
    [
      '', 'Grand Total', '',
      fmtQty(materials.reduce((s, m) => s + m.totalPurchased, 0)),
      fmtQty(materials.reduce((s, m) => s + m.totalUsed, 0)),
      fmtQty(materials.reduce((s, m) => s + m.totalTransferIn, 0)),
      fmtQty(materials.reduce((s, m) => s + m.totalTransferOut, 0)),
      fmtQty(materials.reduce((s, m) => s + m.totalAvailable, 0)),
      '',
    ],
  ];

  autoTable(doc, {
    startY: tableY,
    head: [['S.No', 'Material', 'Unit', 'Purchased', 'Used', 'Transfer In', 'Transfer Out', 'Available Stock', 'Active Sites']],
    body: summaryBody,
    margin: { left: margin, right: margin },
    tableWidth: pageW - margin * 2,
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
      0: { halign: 'center', cellWidth: 14 },
      1: { halign: 'left',   cellWidth: 'auto' },
      2: { halign: 'center', cellWidth: 15 },
      3: { halign: 'right',  cellWidth: 25 },
      4: { halign: 'right',  cellWidth: 20 },
      5: { halign: 'right',  cellWidth: 28 },
      6: { halign: 'right',  cellWidth: 28 },
      7: { halign: 'right',  cellWidth: 36 },
      8: { halign: 'right',  cellWidth: 22 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.row.index === materials.length) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [226, 232, 240];
      }
    },
    didDrawPage: drawPageNumber,
  });

  // ── Per-material detail pages ─────────────────────────────────────────────
  materials.forEach((m) => {
    const siteBreakdownRows: (string | number)[][] = m.sites.map((site) => [
      site.siteName,
      fmtQty(toNum(site.purchaseQuantity)),
      fmtQty(toNum(site.usedQuantity)),
      fmtQty(toNum(site.transferInQuantity)),
      fmtQty(toNum(site.transferOutQuantity)),
      fmtQty(toNum(site.availableStock)),
    ]);

    const purchasesRows: (string | number)[][] = [];
    const usedRows: (string | number)[][] = [];
    const tranInRows: (string | number)[][] = [];
    const tranOutRows: (string | number)[][] = [];

    m.sites.forEach((site) => {
      (site.purchaseDetails ?? []).forEach((d) =>
        purchasesRows.push([site.siteName, d.date, fmtQty(toNum(d.quantity))]),
      );
      (site.usedDetails ?? []).forEach((d) =>
        usedRows.push([site.siteName, d.date, fmtQty(toNum(d.quantity))]),
      );
      (site.transferInDetails ?? []).forEach((d) =>
        tranInRows.push([site.siteName, d.date, fmtQty(toNum(d.quantity)), d.siteName]),
      );
      (site.transferOutDetails ?? []).forEach((d) =>
        tranOutRows.push([site.siteName, d.date, fmtQty(toNum(d.quantity)), d.siteName]),
      );
    });

    // Skip materials where every section is empty
    if (
      siteBreakdownRows.length === 0 &&
      purchasesRows.length === 0 &&
      usedRows.length === 0 &&
      tranInRows.length === 0 &&
      tranOutRows.length === 0
    ) return;

    doc.addPage();
    let y = 14;

    doc.setFont(fontName, 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(m.unit ? `${m.materialName}  (${m.unit})` : m.materialName, margin, y);
    y += 10;

    y = addSection(y, 'Site Breakdown',
      ['Site', 'Purchased', 'Used', 'Transfer In', 'Transfer Out', 'Available Stock'],
      siteBreakdownRows,
    );
    y = addSection(y, 'Purchases',   ['Site', 'Date', 'Quantity'],             purchasesRows);
    y = addSection(y, 'Used',        ['Site', 'Date', 'Quantity'],             usedRows);
    y = addSection(y, 'Transfer In', ['Site', 'Date', 'Quantity', 'From Site'], tranInRows);
    y = addSection(y, 'Transfer Out',['Site', 'Date', 'Quantity', 'To Site'],   tranOutRows);
  });

  doc.save(`${fileName}.pdf`);
}
