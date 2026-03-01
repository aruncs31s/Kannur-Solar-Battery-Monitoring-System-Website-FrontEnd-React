import type { IExportTemplate } from '../../domain/export/IExportTemplate';
import type { ExportData, ExportColumn } from '../../domain/export/ExportTypes';
import type { ReadingRecord } from './ReadingsExportTemplate';

export interface CompactReadingsTemplateConfig {
  title?: string;
}

// Open/Closed: extends the template concept without modifying existing templates
export class CompactReadingsExportTemplate implements IExportTemplate<ReadingRecord> {
  readonly id = 'readings-compact';
  readonly name = 'Compact Readings Template';
  readonly description = 'Compact layout showing only power and timestamp';

  constructor(private readonly config: CompactReadingsTemplateConfig = {}) {}

  transform(data: ReadingRecord[]): ExportData {
    const columns: ExportColumn[] = [
      {
        key: 'timestamp',
        header: 'Timestamp',
        formatter: (v) => new Date(v as number).toLocaleString(),
      },
      { key: 'power', header: 'Power (W)', formatter: (v) => ((v as number) ?? 0).toFixed(2) },
    ];

    return {
      title: this.config.title ?? 'Readings (Compact)',
      columns,
      rows: data as unknown as Record<string, unknown>[],
      metadata: {
        exportedAt: new Date().toISOString(),
        totalRecords: String(data.length),
      },
    };
  }
}
