import type { HTMLAttributes } from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect, vi } from 'vitest';
import type { Options } from 'highcharts';
import { i18n } from '@/i18n';
import { TempTrend } from '../TempTrend';

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

function renderTrend(data: number[], setpoint: number) {
  return render(
    <I18nextProvider i18n={i18n}>
      <TempTrend data={data} setpoint={setpoint} />
    </I18nextProvider>,
  );
}

describe('TempTrend', () => {
  it('shows the empty state when there are fewer than two readings', () => {
    renderTrend([], 21);
    expect(screen.getByText(i18n.t('charts.noTelemetry'))).toBeInTheDocument();
  });

  it('describes the current temp and setpoint for assistive tech', () => {
    renderTrend([20, 21, 22], 21);
    expect(captured.options?.accessibility?.enabled).toBe(true);
    expect(captured.options?.accessibility?.description).toMatch(/Current 22°, setpoint 21°/);
  });

  it('configures a spline series with a dashed setpoint reference line', () => {
    renderTrend([20, 21, 22], 21);
    const series = captured.options?.series?.[0];
    expect(series && 'type' in series ? series.type : undefined).toBe('areaspline');
    const yAxis = captured.options?.yAxis;
    const axis = Array.isArray(yAxis) ? yAxis[0] : yAxis;
    expect(axis?.plotLines?.[0]?.value).toBe(21);
  });
});
