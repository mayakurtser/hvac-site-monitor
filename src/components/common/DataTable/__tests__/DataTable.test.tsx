import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect, vi } from 'vitest';
import type { ColumnDef } from '@tanstack/react-table';
import { i18n } from '@/i18n';
import { DataTable } from '../DataTable';

interface Row {
  n: number;
}

const columns: ColumnDef<Row>[] = [
  {
    accessorKey: 'n',
    header: 'N',
    cell: ({ row }) => <span>{row.original.n}</span>,
  },
];

// Deliberately unsorted: in server-side mode the table must NOT reorder rows.
const data: Row[] = [{ n: 3 }, { n: 1 }, { n: 2 }];

describe('DataTable', () => {
  it('renders rows in the exact order given — ordering is the service’s job, not the table’s', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <DataTable columns={columns} data={data} sorting={[{ id: 'n', desc: false }]} />
      </I18nextProvider>,
    );
    const cells = screen.getAllByRole('cell').map((c) => c.textContent);
    expect(cells).toEqual(['3', '1', '2']);
  });

  it('reports header clicks so the caller can refetch a freshly sorted page', async () => {
    const onSortingChange = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <DataTable columns={columns} data={data} sorting={[]} onSortingChange={onSortingChange} />
      </I18nextProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: /N/ }));
    expect(onSortingChange).toHaveBeenCalledTimes(1);
  });
});
