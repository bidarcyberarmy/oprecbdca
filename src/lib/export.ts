import * as XLSX from "xlsx";
import { formatWibDateTime, getWibDateStamp, sanitizeFilenameSegment } from "@/lib/format";
import type { RegistrationRecord } from "@/lib/validation";

const EXPORT_HEADERS = [
  "No",
  "Waktu Daftar (WIB)",
  "Nama Lengkap",
  "NIM",
  "Jurusan / Prodi",
  "Semester",
  "No. WhatsApp",
  "Divisi Pilihan",
  "Alasan Bergabung",
  "Pengalaman",
  "Riwayat Organisasi",
] as const;

const TEXT_COLUMN_INDICES = new Set([3, 6]); // NIM & No. WhatsApp
const FORMULA_PREFIX_REGEX = /^[=+\-@\t\r]/;

/**
 * Neutralizes spreadsheet formula injection (CSV/Excel DDE injection)
 * by prefixing a leading apostrophe on untrusted user strings starting
 * with formula trigger characters.
 */
function sanitizeSpreadsheetText(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "-") return "-";
  if (FORMULA_PREFIX_REGEX.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
}

function buildExportRows(records: RegistrationRecord[]): (string | number)[][] {
  return records.map((record, index) => [
    index + 1,
    formatWibDateTime(record.created_at),
    sanitizeSpreadsheetText(record.full_name),
    String(record.nim),
    sanitizeSpreadsheetText(record.major),
    sanitizeSpreadsheetText(record.semester ?? ""),
    String(record.whatsapp),
    sanitizeSpreadsheetText(record.division),
    sanitizeSpreadsheetText(record.reason ?? ""),
    sanitizeSpreadsheetText(record.experience ?? ""),
    sanitizeSpreadsheetText(record.organization ?? ""),
  ]);
}

function buildExportFilename(divisionFilter: string, extension: "xlsx" | "csv"): string {
  const filterLabel =
    divisionFilter === "ALL"
      ? "Semua_Divisi"
      : sanitizeFilenameSegment(divisionFilter) || "Divisi";
  const dateStamp = getWibDateStamp();
  return `Oprec_BDCA_${filterLabel}_${dateStamp}.${extension}`;
}

export function exportRegistrationsToExcel(
  records: RegistrationRecord[],
  divisionFilter: string
) {
  const rows = buildExportRows(records);
  const sheetData = [[...EXPORT_HEADERS], ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Force NIM and No. WhatsApp cells to explicit Text/String so Excel preserves digits intact
  for (let rowIndex = 1; rowIndex < sheetData.length; rowIndex++) {
    for (const colIndex of TEXT_COLUMN_INDICES) {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
      const cell = worksheet[cellAddress];
      if (cell) {
        cell.t = "s";
        cell.v = String(cell.v ?? "");
        cell.z = "@";
      }
    }
  }

  // Auto-fit column widths based on longest value in each column
  worksheet["!cols"] = EXPORT_HEADERS.map((header, colIndex) => {
    const maxDataLength = rows.reduce((max, row) => {
      const value = String(row[colIndex] ?? "");
      return Math.max(max, value.length);
    }, header.length);

    const cappedWidth =
      colIndex >= 8
        ? Math.min(Math.max(maxDataLength + 2, 18), 48)
        : Math.min(Math.max(maxDataLength + 3, 6), 36);

    return { wch: cappedWidth };
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pendaftar Oprec");
  XLSX.writeFile(workbook, buildExportFilename(divisionFilter, "xlsx"));
}

function escapeCsvCell(value: string | number): string {
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function exportRegistrationsToCsv(
  records: RegistrationRecord[],
  divisionFilter: string
) {
  const rows = buildExportRows(records);
  const csvLines = [
    EXPORT_HEADERS.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ];

  // UTF-8 BOM ensures Excel opens Indonesian characters cleanly
  const blob = new Blob([`\uFEFF${csvLines.join("\r\n")}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = buildExportFilename(divisionFilter, "csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
