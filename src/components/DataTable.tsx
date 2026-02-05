import { ReactNode } from 'react';

interface Column {
  header: string;
  accessor: string | ((row: any) => ReactNode);
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
  rowClassName?: string | ((row: any) => string);
  onRowClick?: (row: any) => void;
}

export const DataTable = ({ 
  columns, 
  data, 
  emptyMessage = 'No data found',
  rowClassName = 'hover:bg-surface-secondary',
  onRowClick
}: DataTableProps) => {
  const getRowClassName = (row: any) => {
    if (typeof rowClassName === 'function') {
      return rowClassName(row);
    }
    return rowClassName;
  };

  const getCellValue = (row: any, accessor: string | ((row: any) => ReactNode)) => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    return row[accessor];
  };

  return (
    <div className="bg-surface-primary rounded-lg shadow overflow-hidden border border-border-primary">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-primary">
          <thead className="bg-surface-secondary">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface-primary divide-y divide-border-primary">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-8 text-center text-text-tertiary"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${getRowClassName(row)} ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-text-primary ${column.className || ''}`}
                    >
                      {getCellValue(row, column.accessor)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
