import React, { useState } from 'react';
import { Download, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { ExportFormat, EXPORT_FORMAT_LABELS } from '../domain/export/ExportTypes';
import { createDefaultExportOrchestrator, createDefaultTemplateRegistry } from '../application/export/ExportFactory';
import { ReadingsExportTemplate } from '../templates/export/ReadingsExportTemplate';
import { CompactReadingsExportTemplate } from '../templates/export/CompactReadingsExportTemplate';
import type { ReadingRecord } from '../templates/export/ReadingsExportTemplate';

const orchestrator = createDefaultExportOrchestrator();
const registry = createDefaultTemplateRegistry();

interface ExportPanelProps {
  data: ReadingRecord[];
  defaultFilename?: string;
  disabled?: boolean;
}

// Single Responsibility: handles only the export UI interaction
const ExportPanel: React.FC<ExportPanelProps> = ({
  data,
  defaultFilename = 'export',
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>(ExportFormat.CSV);
  const [templateId, setTemplateId] = useState('readings-default');
  const [customTitle, setCustomTitle] = useState('');
  const [includeDevice, setIncludeDevice] = useState(true);
  const [includeTemperature, setIncludeTemperature] = useState(true);
  const [showCustomize, setShowCustomize] = useState(false);

  const templates = registry.getAll();

  const buildTemplate = () => {
    if (templateId === 'readings-compact') {
      return new CompactReadingsExportTemplate({
        title: customTitle || undefined,
      });
    }
    return new ReadingsExportTemplate({
      includeDevice,
      includeTemperature,
      title: customTitle || undefined,
    });
  };

  const handleExport = () => {
    if (data.length === 0) return;
    const template = buildTemplate();
    const filename = `${defaultFilename}-${new Date().toISOString().split('T')[0]}`;
    orchestrator.export(template, data, format, filename);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={disabled || data.length === 0}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm font-medium"
      >
        <Download size={16} />
        Export
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 p-4 space-y-3">
          {/* Format selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Format
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(Object.values(ExportFormat) as ExportFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    format === f
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {EXPORT_FORMAT_LABELS[f]}
                </button>
              ))}
            </div>
          </div>

          {/* Template selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Template
            </label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {templates.find((t) => t.id === templateId)?.description}
            </p>
          </div>

          {/* Customize toggle */}
          <button
            onClick={() => setShowCustomize((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Settings size={12} />
            {showCustomize ? 'Hide customization' : 'Customize template'}
          </button>

          {showCustomize && (
            <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                  Custom title (optional)
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Leave blank for default"
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {templateId === 'readings-default' && (
                <>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDevice}
                      onChange={(e) => setIncludeDevice(e.target.checked)}
                      className="rounded"
                    />
                    Include device column
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeTemperature}
                      onChange={(e) => setIncludeTemperature(e.target.checked)}
                      className="rounded"
                    />
                    Include temperature column
                  </label>
                </>
              )}
            </div>
          )}

          {/* Export button */}
          <button
            onClick={handleExport}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Download size={14} />
            Download {EXPORT_FORMAT_LABELS[format]}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;
