import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { IExporter } from '../../domain/export/IExporter';
import type { ExportData } from '../../domain/export/ExportTypes';
import { ExportFormat } from '../../domain/export/ExportTypes';

// Single Responsibility: handles only PDF generation and download
export class PdfExporter implements IExporter {
  readonly format = ExportFormat.PDF;

  export(data: ExportData, filename: string): void {
    const doc = new jsPDF({ orientation: 'landscape' });

    // Title
    doc.setFontSize(16);
    doc.text(data.title, 14, 16);

    // Metadata line
    if (data.metadata?.exportedAt) {
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Exported: ${new Date(data.metadata.exportedAt).toLocaleString()}`, 14, 24);
      doc.setTextColor(0);
    }

    const head = [data.columns.map((col) => col.header)];
    const body = data.rows.map((row) =>
      data.columns.map((col) => {
        const value = row[col.key];
        return col.formatter ? col.formatter(value) : String(value ?? '');
      }),
    );

    autoTable(doc, {
      head,
      body,
      startY: data.metadata?.exportedAt ? 28 : 22,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`${filename}.pdf`);
  }
}
