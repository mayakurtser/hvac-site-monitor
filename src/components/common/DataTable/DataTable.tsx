import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type SortingState,
} from '@tanstack/react-table';
import {
  TableWrap,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  EmptyState,
} from '@/design-system';
import styles from './DataTable.module.css';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
}

export function DataTable<TData>({
  columns,
  data,
  onRowClick,
  isLoading,
  toolbar,
  footer,
  emptyTitle,
  emptyDescription,
  sorting: sortingProp,
  onSortingChange,
}: DataTableProps<TData>) {
  const { t } = useTranslation();
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const sorting = sortingProp ?? internalSorting;

  // Rows arrive already filtered, sorted, and paginated by the service, so the
  // table renders them as given (manualSorting) and only reports sort intent
  // back to the caller, which refetches the matching page.
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: onSortingChange ?? setInternalSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  function renderBody() {
    if (isLoading) {
      return Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i}>
          {columns.map((col, j) => (
            <TableCell key={j} hideOnMobile={col.meta?.hideOnMobile}>
              <div className={`hvac-skel ${styles.skeletonCell}`} />
            </TableCell>
          ))}
        </TableRow>
      ));
    }
    if (rows.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length}>
            <EmptyState
              title={emptyTitle ?? t('common.noResultsTitle')}
              description={emptyDescription ?? t('common.noResultsDescription')}
            />
          </td>
        </tr>
      );
    }
    return rows.map((row) => (
      <TableRow
        key={row.id}
        onClick={onRowClick ? () => onRowClick(row.original) : undefined}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            align={cell.column.columnDef.meta?.align}
            hideOnMobile={cell.column.columnDef.meta?.hideOnMobile}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  }

  return (
    <TableWrap>
      {toolbar}
      <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHeaderCell
                      key={header.id}
                      sorted={canSort ? sorted : undefined}
                      onSort={canSort ? () => header.column.toggleSorting() : undefined}
                      align={header.column.columnDef.meta?.align}
                      hideOnMobile={header.column.columnDef.meta?.hideOnMobile}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHeaderCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>{renderBody()}</TableBody>
        </Table>
        {footer}
      </TableWrap>
  );
}
