type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

export function DataTable<T extends { id?: string }>({
  columns,
  rows
}: {
  columns: Column<T>[];
  rows: T[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50/90">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((row, index) => (
              <tr key={row.id ?? index} className="admin-table-row align-top transition">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3.5 text-sm text-slate-700">
                    {column.render ? column.render(row) : String((row as Record<string, unknown>)[String(column.key)] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
