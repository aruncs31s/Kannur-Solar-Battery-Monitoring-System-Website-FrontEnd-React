export enum ExportFormat {
  CSV = 'csv',
  XLSX = 'xlsx',
  XML = 'xml',
  PDF = 'pdf',
}

export interface ExportColumn {
  key: string;
  header: string;
  formatter?: (value: unknown) => string;
}

export interface ExportData {
  title: string;
  columns: ExportColumn[];
  rows: Record<string, unknown>[];
  metadata?: Record<string, string>;
}

export const EXPORT_FORMAT_LABELS: Record<ExportFormat, string> = {
  [ExportFormat.CSV]: 'CSV',
  [ExportFormat.XLSX]: 'Excel (XLSX)',
  [ExportFormat.XML]: 'XML',
  [ExportFormat.PDF]: 'PDF',
};
