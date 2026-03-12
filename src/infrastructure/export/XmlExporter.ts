import type { IExporter } from '../../domain/export/IExporter';
import type { ExportData } from '../../domain/export/ExportTypes';
import { ExportFormat } from '../../domain/export/ExportTypes';

// Single Responsibility: handles only XML serialization and download
export class XmlExporter implements IExporter {
  readonly format = ExportFormat.XML;

  export(data: ExportData, filename: string): void {
    const rootTag = data.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const rowsXml = data.rows
      .map((row) => {
        const fields = data.columns
          .map((col) => {
            const value = row[col.key];
            const formatted = col.formatter ? col.formatter(value) : String(value ?? '');
            return `    <${col.key}>${this.escapeXml(formatted)}</${col.key}>`;
          })
          .join('\n');
        return `  <record>\n${fields}\n  </record>`;
      })
      .join('\n');

    const metaXml = data.metadata
      ? Object.entries(data.metadata)
          .map(([k, v]) => `  <${k}>${this.escapeXml(v)}</${k}>`)
          .join('\n')
      : '';

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<${rootTag}>`,
      metaXml ? `<metadata>\n${metaXml}\n</metadata>` : '',
      rowsXml,
      `</${rootTag}>`,
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    this.triggerDownload(blob, `${filename}.xml`);
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
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
