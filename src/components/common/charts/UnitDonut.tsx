import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Highcharts from 'highcharts';
import 'highcharts/modules/accessibility';
import HighchartsReact from 'highcharts-react-official';
import { cn } from '@/utils/cn';
import styles from './UnitDonut.module.css';
import { useChartTheme } from './useChartTheme';

interface UnitDonutProps {
  indoor: number;
  outdoor: number;
  controllers: number;
}

export function UnitDonut({ indoor, outdoor, controllers }: UnitDonutProps) {
  const { t } = useTranslation();
  const theme = useChartTheme();
  const total = indoor + outdoor + controllers || 1;

  const segments = [
    { key: 'indoor', label: t('charts.indoor'), value: indoor, dot: styles.dotIndoor },
    { key: 'outdoor', label: t('charts.outdoor'), value: outdoor, dot: styles.dotOutdoor },
    {
      key: 'controllers',
      label: t('charts.controllers'),
      value: controllers,
      dot: styles.dotControllers,
    },
  ];

  const options = useMemo<Highcharts.Options>(
    () => ({
      chart: {
        type: 'pie',
        height: 140,
        width: 140,
        margin: [0, 0, 0, 0],
        backgroundColor: 'transparent',
      },
      title: { text: undefined },
      credits: { position: { align: 'right', x: -50 } },
      accessibility: {
        enabled: true,
        description: t('charts.unitMixAria', { indoor, outdoor, controllers, total }),
      },
      tooltip: { enabled: false },
      plotOptions: {
        pie: {
          size: '86%',
          innerSize: '72%',
          borderWidth: 0,
          dataLabels: { enabled: false },
          states: { hover: { enabled: false }, inactive: { enabled: false } },
        },
      },
      series: [
        {
          type: 'pie',
          data: [
            { y: indoor, color: theme.brand },
            { y: outdoor, color: theme.blue },
            { y: controllers, color: theme.gray },
          ],
        },
      ],
    }),
    [indoor, outdoor, controllers, total, t, theme],
  );

  return (
    <div className={styles.container}>
      <div className={styles.chartWrap}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ className: styles.chart }}
        />
        <div className={styles.center} aria-hidden="true">
          <span className={styles.centerTotal}>{total}</span>
          <span className={styles.centerLabel}>{t('charts.units')}</span>
        </div>
      </div>
      <div className={styles.legend}>
        {segments.map((s) => (
          <div key={s.key} className={styles.legendItem}>
            <span className={cn(styles.legendDot, s.dot)} />
            <span className={styles.legendLabel}>{s.label}</span>
            <span className={styles.legendValue}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
