import type { ExportData } from './ExportTypes';

// Single Responsibility: defines only the template contract
// Open/Closed: templates can be added without modifying this interface
export interface IExportTemplate<T> {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  transform(data: T[]): ExportData;
}
