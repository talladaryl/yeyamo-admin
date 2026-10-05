"use client";

import type { ReactNode } from "react";
import { AdminEmptyState, AdminErrorState, AdminPagination, AdminSkeleton } from "@/components/admin/ui/admin-foundation";
import { RowActionsMenu } from "@/components/admin/ui/row-actions-menu";

export type AdminColumn<T> = { id: string; header: string; cell: (row: T) => ReactNode; sortable?: boolean; width?: string; align?: "start" | "center" | "end" };
type Props<T> = { rows: T[]; columns: AdminColumn<T>[]; rowKey: (row: T) => string; loading?: boolean; error?: Error | string; page?: number; size?: number; total?: number; selected?: string[]; onSelectionChange?: (ids: string[]) => void; onPageChange?: (page: number) => void; onSizeChange?: (size: number) => void; onSort?: (column: string) => void; actions?: (row: T) => ReactNode; onRetry?: () => void; caption?: string };

export function AdminDataTable<T>({ rows, columns, rowKey, loading, error, page = 0, size = 20, total, selected = [], onSelectionChange, onPageChange, onSizeChange, onSort, actions, onRetry, caption = "Données administratives" }: Props<T>) {
  if (loading) return <AdminSkeleton rows={6}/>;
  if (error) return <AdminErrorState error={error} onRetry={onRetry}/>;
  if (!rows.length) return <AdminEmptyState/>;
  const rowIds = rows.map(rowKey); const allSelected = rowIds.every((id) => selected.includes(id)); const someSelected = !allSelected && rowIds.some((id) => selected.includes(id));
  const toggleAll = () => onSelectionChange?.(allSelected ? selected.filter((id) => !rowIds.includes(id)) : Array.from(new Set([...selected, ...rowIds])));
  return <div className="admin-data-table-wrap"><div className="admin-data-table-scroll" role="region" aria-label={caption} tabIndex={0}><table className="admin-data-table"><caption className="admin-visually-hidden">{caption}</caption><thead><tr>{onSelectionChange ? <th className="admin-data-table__select"><input ref={(node) => { if (node) node.indeterminate = someSelected; }} type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Tout sélectionner"/></th> : null}{columns.map((column) => <th key={column.id} scope="col" data-align={column.align} style={{ width: column.width }}>{column.sortable ? <button type="button" onClick={() => onSort?.(column.id)} aria-label={`Trier par ${column.header}`}>{column.header}<span aria-hidden="true">↕</span></button> : column.header}</th>)}{actions ? <th scope="col" className="admin-data-table__actions">Actions</th> : null}</tr></thead><tbody>{rows.map((row) => { const key = rowKey(row); return <tr key={key}>{onSelectionChange ? <td className="admin-data-table__select"><input type="checkbox" checked={selected.includes(key)} onChange={() => onSelectionChange(selected.includes(key) ? selected.filter((id) => id !== key) : [...selected, key])} aria-label={`Sélectionner ${key}`}/></td> : null}{columns.map((column) => <td key={column.id} data-align={column.align}><div className="admin-data-table__cell">{column.cell(row)}</div></td>)}{actions ? <td className="admin-data-table__actions"><RowActionsMenu triggerLabel={`Actions pour la ligne ${key}`}><div className="admin-row-actions">{actions(row)}</div></RowActionsMenu></td> : null}</tr>; })}</tbody></table></div>{total !== undefined && onPageChange ? <AdminPagination page={page} size={size} total={total} onPageChange={onPageChange} onSizeChange={onSizeChange}/> : null}</div>;
}
