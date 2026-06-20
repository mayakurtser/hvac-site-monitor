import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Highcharts from 'highcharts';
import 'highcharts/modules/accessibility';
import HighchartsReact from 'highcharts-react-official';
import styles from './TempTrend.module.css';
import { useChartTheme } from './useChartTheme';

interface TempTrendProps {
  data: number[];
  setpoint: number;
}

export function TempTrend({ data, setpoint }: TempTrendProps) {
  const { t } = useTranslation();
  const theme = useChartTheme();

  const options = useMemo<Highcharts.Options>(() => {
    const lo = Math.min(...data, setpoint);
    const hi = Math.max(...data, setpoint);
    // Headroom so the spline's peaks and the last-point marker aren't clipped.
    const pad = (hi - lo || 1) * 0.15;
    const lastIndex = data.length - 1;
    const last = data[lastIndex];

    return {
      chart: {
        height: 180,
        margin: [18, 8, 8, 8],
        backgroundColor: 'transparent',
        style: { fontFamily: 'inherit' },
      },
      title: { text: undefined },
      legend: { enabled: false },
      accessibility: {
        enabled: true,
        description: t('charts.tempTrendAria', { current: last, setpoint }),
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '{point.y}°',
        backgroundColor: theme.surface,
        borderColor: theme.gridLine,
        style: { color: theme.text },
      },
      xAxis: { visible: false },
      yAxis: {
        visible: false,
        min: lo - pad,
        max: hi + pad,
        startOnTick: false,
        endOnTick: false,
        plotLines: [
          {
            value: setpoint,
            color: theme.gridLine,
            width: 1.5,
            dashStyle: 'Dash',
            zIndex: 3,
            label: {
              text: t('charts.setpointShort', { value: setpoint }),
              align: 'right',
              textAlign: 'right',
              x: -4,
              y: -6,
              style: { color: theme.mutedText, fontSize: 'var(--text-sm)' },
            },
          },
        ],
      },
      plotOptions: {
        areaspline: {
          color: theme.brand,
          lineWidth: 2.5,
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, theme.brandFillTop],
              [1, theme.brandFillBottom],
            ],
          },
          marker: { enabled: false, symbol: 'circle' },
        },
      },
      series: [
        {
          type: 'areaspline',
          data: data.map((y, i) =>
            i === lastIndex
              ? {
                  y,
                  marker: {
                    enabled: true,
                    radius: 4.5,
                    fillColor: theme.brand,
                    lineColor: theme.surface,
                    lineWidth: 2,
                  },
                }
              : y,
          ),
        },
      ],
    };
  }, [data, setpoint, t, theme]);

  if (!data || data.length < 2) {
    return <div className={styles.empty}>{t('charts.noTelemetry')}</div>;
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ className: styles.chart }}
    />
  );
}
