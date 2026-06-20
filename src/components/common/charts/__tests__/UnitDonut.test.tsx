import type { HTMLAttributes } from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect, vi } from 'vitest';
import type { Options } from 'highcharts';
import { i18n } from '@/i18n';
import { UnitDonut } from '../UnitDonut';

const captured = vi.hoisted(() => ({ options: undefined as Options | undefined }));

vi.mock('highcharts/modules/accessibility', () => ({}));

vi.mock('highcharts-react-official', () => ({
  default: ({
    options,
    containerProps,
  }: {
    options?: Options;
    containerProps?: HTMLAttributes<HTMLDivElement>;
  }) => {
    captured.options = options;
    return <div {...containerProps} />;
  },
}));

function renderDonut(indoor: number, outdoor: number, controllers: number) {
  return render(
    <I18nextProvider i18n={i18n}>
      <UnitDonut indoor={indoor} outdoor={outdoor} controllers={controllers} />
    </I18nextProvider>,
  );
}

describe('UnitDonut', () => {
  it('summarizes the unit mix for assistive tech', () => {
    renderDonut(12, 5, 3);
    expect(captured.options?.accessibility?.enabled).toBe(true);
    expect(captured.options?.accessibility?.description).toMatch(
      /12 indoor, 5 outdoor, 3 controllers, 20 total/,
    );
  });

  it('shows the total in the center and each count in the legend', () => {
    renderDonut(12, 5, 3);
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('builds a pie series from the three counts, in color-index order', () => {
    renderDonut(12, 5, 3);
    const series = captured.options?.series?.[0];
    expect(series && 'type' in series ? series.type : undefined).toBe('pie');
    const data = (series && 'data' in series ? series.data : []) as unknown as Array<{ y?: number }>;
    expect(data.map((p) => p.y)).toEqual([12, 5, 3]);
  });
});
