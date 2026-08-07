import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { MaterialSummary } from './TransformInventorySummary';
import { fmtQty } from './TransformInventorySummary';

const HEADERS = ['S.No', 'Material', 'Unit', 'Purchased', 'Used', 'Transfer In', 'Transfer Out', 'Available Stock', 'Transaction Sites'];

// Used only for PDF export (formatted strings are fine there)
function toRows(materials: MaterialSummary[]) {
  return materials.map((m, i) => [
    i + 1,
    m.materialName,
    m.unit,
    fmtQty(m.totalPurchased),
    fmtQty(m.totalUsed),
    fmtQty(m.totalTransferIn),
    fmtQty(m.totalTransferOut),
    fmtQty(m.totalAvailable),
    m.activeSites,
  ]);
}

// ── Excel column definitions ──────────────────────────────────────────────────
const HEADER_BG = 'FF2563EB'; // blue-600 in ARGB

interface ColDef {
  width: number;
  numFmt?: string;
  dataAlign: 'left' | 'center' | 'right';
}

const COL_DEFS: ColDef[] = [
  { width: 8,  numFmt: '0',        dataAlign: 'center' }, // S.No
  { width: 32, dataAlign: 'left'   },                      // Material
  { width: 12, dataAlign: 'left'   },                      // Unit
  { width: 16, numFmt: '#,##0', dataAlign: 'right'  }, // Purchased
  { width: 14, numFmt: '#,##0', dataAlign: 'right'  }, // Used
  { width: 16, numFmt: '#,##0', dataAlign: 'right'  }, // Transfer In
  { width: 16, numFmt: '#,##0', dataAlign: 'right'  }, // Transfer Out
  { width: 18, numFmt: '#,##0', dataAlign: 'right'  }, // Available Stock
  { width: 22, numFmt: '0',        dataAlign: 'right'  }, // Transaction Sites
];

const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top:    { style: 'thin', color: { argb: 'FFD1D5DB' } },
  left:   { style: 'thin', color: { argb: 'FFD1D5DB' } },
  bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
  right:  { style: 'thin', color: { argb: 'FFD1D5DB' } },
};

export async function exportToExcel(
  materials: MaterialSummary[],
  fileName = 'Inventory_Stock_Report',
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Inventory Report');

  // Column widths
  worksheet.columns = COL_DEFS.map((c) => ({ width: c.width }));

  // Header row
  const headerRow = worksheet.addRow(HEADERS);
  headerRow.height = 22;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_BG } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = THIN_BORDER;
  });

  // Freeze header row so it stays visible while scrolling
  worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  // Data rows — raw numbers so Excel stores them as numbers (no green-triangle warning)
  materials.forEach((m, i) => {
    const dataRow = worksheet.addRow([
      i + 1,
      m.materialName,
      m.unit,
      Number(m.totalPurchased),
      Number(m.totalUsed),
      Number(m.totalTransferIn),
      Number(m.totalTransferOut),
      Number(m.totalAvailable),
      Number(m.activeSites),
    ]);
    dataRow.height = 18;
    dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const def = COL_DEFS[colNumber - 1];
      if (!def) return;
      cell.alignment = { horizontal: def.dataAlign, vertical: 'middle' };
      cell.border = THIN_BORDER;
      if (def.numFmt) cell.numFmt = def.numFmt;
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

/** Comma-format a number for PDF cells — no trailing dot, up to 2 decimal places. */
function fmtNum(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return rounded.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function toPdfRows(materials: MaterialSummary[]) {
  return materials.map((m, i) => [
    i + 1,
    m.materialName,
    m.unit,
    fmtNum(m.totalPurchased),
    fmtNum(m.totalUsed),
    fmtNum(m.totalTransferIn),
    fmtNum(m.totalTransferOut),
    fmtNum(m.totalAvailable),
    m.activeSites,
  ]);
}

export function exportToPDF(
  materials: MaterialSummary[],
  fileName = 'Inventory_Stock_Report',
  siteName?: string,
  dateRange?: { from: string; to: string },
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();   // 297 mm
  const pageH = doc.internal.pageSize.getHeight();  // 210 mm
  const margin = 14;

  // ── Generated timestamp — top right ────────────────────────────────────────
  const generatedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${generatedAt}`, pageW - margin, 8, { align: 'right' });

  // ── Title ──────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('Inventory Stock Report', pageW / 2, 18, { align: 'center' });

  // ── Subtitle (site + period) ───────────────────────────────────────────────
  const subtitleParts: string[] = [];
  if (siteName) subtitleParts.push(`Site: ${siteName}`);
  if (dateRange?.from && dateRange?.to) subtitleParts.push(`Period: ${dateRange.from} – ${dateRange.to}`);
  let tableStartY = 26;
  if (subtitleParts.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitleParts.join('   |   '), pageW / 2, 26, { align: 'center' });
    tableStartY = 34;
  }

  // ── Table ──────────────────────────────────────────────────────────────────
  autoTable(doc, {
    startY: tableStartY,
    head: [HEADERS],
    body: toPdfRows(materials),
    margin: { left: margin, right: margin },
    tableWidth: pageW - margin * 2,   // stretch to fill page width
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
      lineColor: [203, 213, 225],
      lineWidth: 0.25,
      valign: 'middle',
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [37, 99, 235],       // blue-600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center',
      cellPadding: { top: 4, bottom: 4, left: 3, right: 3 }, // tighter sides → more text room
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],     // slate-50
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 16  },   // S.No          (4 chars  → ~14 mm needed)
      1: { halign: 'left',   cellWidth: 'auto' }, // Material      (fills remaining ~71 mm)
      2: { halign: 'center', cellWidth: 15  },   // Unit          (4 chars  → ~14 mm needed)
      3: { halign: 'right',  cellWidth: 25  },   // Purchased     (9 chars  → ~21 mm needed)
      4: { halign: 'right',  cellWidth: 18  },   // Used          (4 chars  → ~15 mm needed)
      5: { halign: 'right',  cellWidth: 28  },   // Transfer In   (11 chars → ~25 mm needed)
      6: { halign: 'right',  cellWidth: 30  },   // Transfer Out  (12 chars → ~26 mm needed)
      7: { halign: 'right',  cellWidth: 36  },   // Available Stock (15 chars → ~31 mm needed)
      8: { halign: 'right',  cellWidth: 38  },   // Transaction Sites (16 chars → ~33 mm needed)
    },
    // ── Page footer ───────────────────────────────────────────────────────────
    didDrawPage: (data) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageNum: number = (data as any).pageNumber ?? 1;
      doc.text(`Page ${pageNum}`, pageW / 2, pageH - 6, { align: 'center' });
    },
  });

  doc.save(`${fileName}.pdf`);
}
