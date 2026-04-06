import { Edit, Trash2 } from 'lucide-react';

interface EntityTableProps<T> {
  data: T[];
  columns: { key: keyof T; label: string; render?: (item: T) => React.ReactNode }[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  getItemId: (item: T) => string;
}

export const EntityTable = <T,>({ data, columns, onEdit, onDelete, getItemId }: EntityTableProps<T>) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-surface-secondary border-b border-border-primary">
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
              {col.label}
            </th>
          ))}
          <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={getItemId(item)} className="border-b border-border-primary hover:bg-surface-secondary/50">
            {columns.map((col) => (
              <td key={String(col.key)} className="px-6 py-4 text-text-primary">
                {col.render ? col.render(item) : String(item[col.key])}
              </td>
            ))}
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-800 p-1">
                  <Edit size={16} />
                </button>
                <button onClick={() => onDelete(getItemId(item))} className="text-red-600 hover:text-red-800 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
