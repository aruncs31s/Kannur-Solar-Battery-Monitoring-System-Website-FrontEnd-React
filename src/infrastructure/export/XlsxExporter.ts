import * as XLSX from '@e965/xlsx';
import type { IExporter } from '../../domain/export/IExporter';
import type { ExportData } from '../../domain/export/ExportTypes';
import { ExportFormat } from '../../domain/export/ExportTypes';

// Single Responsibility: handles only XLSX serialization and download
export class XlsxExporter implements IExporter {
  readonly format = ExportFormat.XLSX;

  export(data: ExportData, filename: string): void {
    const headers = data.columns.map((col) => col.header);
    const rows = data.rows.map((row) =>
      data.columns.map((col) => {
        const value = row[col.key];
        return col.formatter ? col.formatter(value) : (value ?? '');
      }),
    );

    const sheetName = data.title.slice(0, 31); // Excel sheet name limit
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }
}
