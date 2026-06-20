import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableHeaderCell, TableCell } from '../Table';

describe('TableHeaderCell', () => {
  it('right-aligns a plain header cell when align is right', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell align="right">Units</TableHeaderCell>
          </tr>
        </thead>
      </table>,
    );
    const th = container.querySelector('th') as HTMLElement;
    expect(th.className).toMatch(/alignRight/);
  });

  it('right-aligns a sortable header so it lines up with its column', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell align="right" sorted={false} onSort={() => {}}>
              Units
            </TableHeaderCell>
          </tr>
        </thead>
      </table>,
    );
    const th = container.querySelector('th') as HTMLElement;
    expect(th.className).toMatch(/alignRight/);
    expect(container.querySelector('button')).not.toBeNull();
  });

  it('does not set an align class by default', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell>Site</TableHeaderCell>
          </tr>
        </thead>
      </table>,
    );
    const th = container.querySelector('th') as HTMLElement;
    expect(th.className).not.toMatch(/align/);
  });

  it('marks the header cell hidden on mobile when hideOnMobile is set', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell hideOnMobile>Customer</TableHeaderCell>
          </tr>
        </thead>
      </table>,
    );
    const th = container.querySelector('th') as HTMLElement;
    expect(th.className).toMatch(/hideOnMobile/);
  });
});

describe('TableCell', () => {
  it('applies the align class to the cell', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell align="right">48</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td') as HTMLElement;
    expect(td.className).toMatch(/alignRight/);
  });

  it('marks the cell hidden on mobile when hideOnMobile is set', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell hideOnMobile>Acme Corp</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td') as HTMLElement;
    expect(td.className).toMatch(/hideOnMobile/);
  });

  it('does not mark the cell hidden by default', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell>Acme Corp</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td') as HTMLElement;
    expect(td.className).not.toMatch(/hideOnMobile/);
  });
});
