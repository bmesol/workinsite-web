import ExcelJS from 'exceljs';

export const HEADER_BG = 'FF2563EB';

export const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top:    { style: 'thin', color: { argb: 'FFD1D5DB' } },
  left:   { style: 'thin', color: { argb: 'FFD1D5DB' } },
  bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
  right:  { style: 'thin', color: { argb: 'FFD1D5DB' } },
};

export function styleHeaderRow(row: ExcelJS.Row): void {
  row.height = 22;
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_BG } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = THIN_BORDER;
  });
}

export function styleDataRow(row: ExcelJS.Row): void {
  row.height = 18;
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = THIN_BORDER;
    cell.alignment = { vertical: 'middle' };
  });
}

/**
 * Prepends title / period / generated-at rows to a worksheet.
 * Returns the row number where the blue column-header row should be placed
 * (i.e. call styleHeaderRow on the next row you add).
 */
export function addReportHeader(
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

  const infoText =
    dateRange?.from && dateRange?.to
      ? `Period: ${dateRange.from} – ${dateRange.to}   |   Generated: ${generatedAt}`
      : `Generated: ${generatedAt}`;
  const infoRow = sheet.addRow([infoText]);
  infoRow.height = 18;
  infoRow.getCell(1).font = { size: 8, color: { argb: 'FF94A3B8' } };
  infoRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.mergeCells(`A${infoRow.number}:${lastCol}${infoRow.number}`);

  return infoRow.number + 1;
}

/**
 * Fetch a TTF font and return it as a binary string.
 * Throws if the file is missing or is not a real TrueType font
 * (Vite dev servers return index.html with HTTP 200 for missing assets).
 */
export async function loadFontBinaryStr(path: string): Promise<string> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Font fetch failed: ${res.status} ${path}`);
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);

  // TTF magic bytes: 00 01 00 00
  const isTTF =
    bytes[0] === 0x00 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00;
  if (!isTTF)
    throw new Error(`Not a valid .ttf file (got HTML or another format): ${path}`);

  const arr = new Array<string>(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = String.fromCharCode(bytes[i]);
  return arr.join('');
}
