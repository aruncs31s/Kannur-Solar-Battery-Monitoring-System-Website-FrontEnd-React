import type { IExporter } from '../../domain/export/IExporter';
import type { IExportTemplate } from '../../domain/export/IExportTemplate';
import type { ExportFormat } from '../../domain/export/ExportTypes';

// Orchestrator pattern: coordinates template transformation and exporter invocation
// Dependency Inversion: depends on abstractions (IExporter, IExportTemplate)
// Open/Closed: new formats/templates can be added by registering them, not by modifying this class
export class ExportOrchestrator {
  private readonly exporters: Map<string, IExporter>;

  constructor(exporters: IExporter[]) {
    this.exporters = new Map(exporters.map((e) => [e.format, e]));
  }

  export<T>(
    template: IExportTemplate<T>,
    data: T[],
    format: ExportFormat,
    filename: string,
  ): void {
    const exporter = this.exporters.get(format);
    if (!exporter) {
      throw new Error(`No exporter registered for format: ${format}`);
    }
    const exportData = template.transform(data);
    exporter.export(exportData, filename);
  }

  getSupportedFormats(): string[] {
    return Array.from(this.exporters.keys());
  }

  supportsFormat(format: ExportFormat): boolean {
    return this.exporters.has(format);
  }
}
