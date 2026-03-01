import { ExportOrchestrator } from './ExportOrchestrator';
import { CsvExporter } from '../../infrastructure/export/CsvExporter';
import { XlsxExporter } from '../../infrastructure/export/XlsxExporter';
import { XmlExporter } from '../../infrastructure/export/XmlExporter';
import { PdfExporter } from '../../infrastructure/export/PdfExporter';
import { TemplateRegistry } from '../../templates/export/TemplateRegistry';
import { ReadingsExportTemplate } from '../../templates/export/ReadingsExportTemplate';
import { CompactReadingsExportTemplate } from '../../templates/export/CompactReadingsExportTemplate';

// Dependency Inversion: higher-level modules depend on abstractions wired here
export function createDefaultExportOrchestrator(): ExportOrchestrator {
  return new ExportOrchestrator([
    new CsvExporter(),
    new XlsxExporter(),
    new XmlExporter(),
    new PdfExporter(),
  ]);
}

export function createDefaultTemplateRegistry(): TemplateRegistry {
  const registry = new TemplateRegistry();
  registry.register(new ReadingsExportTemplate());
  registry.register(new CompactReadingsExportTemplate());
  return registry;
}
