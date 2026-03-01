import type { ExportData } from './ExportTypes';

// Single Responsibility: defines only the exporter contract
// Interface Segregation: small, focused interface
export interface IExporter {
  readonly format: string;
  export(data: ExportData, filename: string): void;
}
