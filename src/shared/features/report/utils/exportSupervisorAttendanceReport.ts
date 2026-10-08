import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { SupervisorAttendance } from '../DTOs/SupervisorAttendanceProps';
import {
  THIN_BORDER,
  styleHeaderRow,
  styleDataRow,
  addReportHeader,
  loadFontBinaryStr,
} from './reportExportHelpers';

const formatTime12h = (time?: string): string => {
  if (!time) return '';
  // Strip date prefix from ISO datetime strings e.g. "0001-01-01T16:14:00"
  const timePart = time.includes('T') ? time.split('T')[1] : time;
  // If AM/PM is already present (e.g. "04:14 PM", "04:14:00 PM"), honour it directly
  const existingAmPm = timePart.match(/\b(AM|PM)\b/i);
  if (existingAmPm) {
    const parts = timePart.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return '';
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${existingAmPm[1].toUpperCase()}`;
  }
  // 24-hour format e.g. "16:14:00"
  const parts = timePart.split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return '';
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// EXCEL EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export async function exportSupervisorAttendanceToExcel(
  attendances: SupervisorAttendance[],
  dateRange?: { from: string; to: string },
  fileName = 'Supervisor_Attendance_Report',
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const generatedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const LOCATION_COL_WIDTH = 57;

  const sheet = workbook.addWorksheet('Supervisor Attendance');
  sheet.pageSetup = {
    orientation: 'landscape',
    paperSize: 9,        // A4
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,      // unlimited rows — never forces a fixed page count vertically
    margins: { left: 0.25, right: 0.25, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 },
  };
  sheet.columns = [
    { width: 8 },
    { width: 16 },
    { width: 18 },
    { width: 30 },
    { width: 26 },
    { width: LOCATION_COL_WIDTH },
  ];

  const hdrRowNum = addReportHeader(
    sheet,
    'Supervisor Attendance Report',
    6,
    generatedAt,
    dateRange,
  );
  styleHeaderRow(
    sheet.addRow(['S.No', 'Date', 'Check-in Time', 'Supervisor Name', 'Site', 'Location']),
  );
  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: hdrRowNum }];

  attendances.forEach((item, i) => {
    const supervisorName = item.supervisor[0]?.name ?? '';
    const site = item.site?.name ?? '';
    const address = item.currentLocation?.address ?? '';

    const row = sheet.addRow([i + 1, item.date, formatTime12h(item.time), supervisorName, site, address]);
    styleDataRow(row);
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
    [4, 5].forEach((c) => {
      row.getCell(c).alignment = { horizontal: 'left', vertical: 'middle' };
    });
    row.getCell(6).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    if (address) {
      const estimatedLines = Math.ceil(address.length / LOCATION_COL_WIDTH);
      row.height = Math.max(18, estimatedLines * 14);
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

export async function exportSupervisorAttendanceToPDF(
  attendances: SupervisorAttendance[],
  dateRange?: { from: string; to: string },
  fileName = 'Supervisor_Attendance_Report',
): Promise<void> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
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
  doc.text('Supervisor Attendance Report', pageW / 2, 18, { align: 'center' });

  let tableY = 26;
  if (dateRange?.from && dateRange?.to) {
    doc.setFont(fontName, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Period: ${dateRange.from} – ${dateRange.to}`, pageW / 2, 26, { align: 'center' });
    tableY = 34;
  }

  const body: (string | number)[][] = attendances.map((item, i) => [
    i + 1,
    item.date,
    formatTime12h(item.time),
    item.supervisor[0]?.name ?? '',
    item.site?.name ?? '',
    item.currentLocation?.address ?? '',
  ]);

  const tableWidth = pageW - 2 * margin;
  const fixedColsWidth = 12 + 22 + 20 + 40 + 34;
  const locationColWidth = tableWidth - fixedColsWidth;

  autoTable(doc, {
    startY: tableY,
    tableWidth,
    head: [['S.No', 'Date', 'Check-in Time', 'Supervisor Name', 'Site', 'Location']],
    body,
    margin: { left: margin, right: margin },
    styles: {
      font: fontName, fontSize: 8,
      cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
      lineColor: [203, 213, 225], lineWidth: 0.25, valign: 'middle', textColor: [30, 41, 59],
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [37, 99, 235], textColor: [255, 255, 255],
      fontStyle: 'bold', fontSize: 8.5, halign: 'center',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'center', cellWidth: 22 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'left', cellWidth: 40 },
      4: { halign: 'left', cellWidth: 34 },
      5: { halign: 'left', cellWidth: locationColWidth },
    },
    didDrawPage: drawPageNumber,
  });

  doc.save(`${fileName}.pdf`);
}
