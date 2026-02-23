import type { IExporter } from '../../domain/export/IExporter';
import type { ExportData } from '../../domain/export/ExportTypes';
import { ExportFormat } from '../../domain/export/ExportTypes';

// Single Responsibility: handles only CSV serialization and download
export class CsvExporter implements IExporter {
  readonly format = ExportFormat.CSV;

  export(data: ExportData, filename: string): void {
    const headers = data.columns.map((col) => this.escape(col.header));
    const rows = data.rows.map((row) =>
      data.columns.map((col) => {
        const value = row[col.key];
        const formatted = col.formatter ? col.formatter(value) : String(value ?? '');
        return this.escape(formatted);
      }),
    );

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.triggerDownload(blob, `${filename}.csv`);
  }

  private escape(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
