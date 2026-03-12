import type { IExportTemplate } from '../../domain/export/IExportTemplate';
import type { ExportData, ExportColumn } from '../../domain/export/ExportTypes';

export interface ReadingRecord {
  deviceName?: string;
  timestamp: number;
  voltage?: number;
  current?: number;
  power?: number;
  temperature?: number;
}

export interface ReadingsTemplateConfig {
  includeDevice?: boolean;
  includeTemperature?: boolean;
  title?: string;
}

// Liskov Substitution: implements IExportTemplate fully
// Single Responsibility: transforms reading data only
export class ReadingsExportTemplate implements IExportTemplate<ReadingRecord> {
  readonly id = 'readings-default';
  readonly name = 'Default Readings Template';
  readonly description = 'Standard layout with timestamp, voltage, current and power columns';

  constructor(private readonly config: ReadingsTemplateConfig = {}) {}

  transform(data: ReadingRecord[]): ExportData {
    const columns: ExportColumn[] = [];

    if (this.config.includeDevice !== false && data.some((r) => r.deviceName)) {
      columns.push({ key: 'deviceName', header: 'Device' });
    }

    columns.push({
      key: 'timestamp',
      header: 'Timestamp',
      formatter: (v) => new Date(v as number).toLocaleString(),
    });

    columns.push(
      { key: 'voltage', header: 'Voltage (V)', formatter: (v) => ((v as number) ?? 0).toFixed(2) },
      { key: 'current', header: 'Current (A)', formatter: (v) => ((v as number) ?? 0).toFixed(2) },
      { key: 'power', header: 'Power (W)', formatter: (v) => ((v as number) ?? 0).toFixed(2) },
    );

    if (this.config.includeTemperature !== false && data.some((r) => r.temperature != null)) {
      columns.push({
        key: 'temperature',
        header: 'Temperature (°C)',
        formatter: (v) => (v != null ? (v as number).toFixed(1) : 'N/A'),
      });
    }

    return {
      title: this.config.title ?? 'Readings',
      columns,
      rows: data as unknown as Record<string, unknown>[],
      metadata: {
        exportedAt: new Date().toISOString(),
        totalRecords: String(data.length),
      },
    };
  }
}
