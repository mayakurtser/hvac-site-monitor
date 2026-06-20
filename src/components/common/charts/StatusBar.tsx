import React from 'react';
import { useTranslation } from 'react-i18next';
import { SITE_STATUSES, type SiteStatus } from '@/types/site';
import styles from './StatusBar.module.css';

interface StatusBarProps {
  counts: Record<SiteStatus, number>;
}

const STATUS_COLOR: Record<SiteStatus, string> = {
  online:      'var(--success-500)',
  warning:     'var(--warning-500)',
  critical:    'var(--error-500)',
  maintenance: 'var(--blue-500)',
  offline:     'var(--gray-400)',
};

export function StatusBar({ counts }: StatusBarProps) {
  const { t } = useTranslation();
  const total = SITE_STATUSES.reduce((n, k) => n + counts[k], 0) || 1;
  const segments = SITE_STATUSES.map((k) => ({
    k,
    color: STATUS_COLOR[k],
    label: t(`status.${k}`),
    n: counts[k],
  })).filter((c) => c.n > 0);

  return (
    <div
      role="img"
      aria-label={t('charts.fleetStatusAria', {
        summary: segments.map((c) => `${c.n} ${c.label}`).join(', '),
      })}
    >
      <div className={styles.track}>
        {segments.map((c) => (
          <div
            key={c.k}
            style={{ width: `${(c.n / total) * 100}%`, background: c.color }}
          />
        ))}
      </div>
      <div className={styles.legend}>
        {segments.map((c) => (
          <div key={c.k} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: c.color }} />
            <span className={styles.legendLabel}>{c.label}</span>
            <span className={styles.legendCount}>{c.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
