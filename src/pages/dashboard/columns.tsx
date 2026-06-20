import React, { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/design-system';
import { StatusBadge } from '@/components/common';
import { formatTemperature } from '@/utils/formatters';
import type { Site } from '@/types/site';
import styles from './columns.module.css';

function tempColor(site: Site): string {
  if (site.avgTemp == null) return 'var(--text-disabled)';
  if (site.status === 'critical') return 'var(--error-700)';
  if (site.status === 'warning') return 'var(--warning-700)';
  return 'var(--text-primary)';
}

export function useSiteColumns(): ColumnDef<Site>[] {
  const { t } = useTranslation();
  return useMemo(() => [
  {
    accessorKey: 'name',
    header: t('dashboard.col.site'),
    cell: ({ row }) => (
      <div>
        <div className={styles.siteName}>{row.original.name}</div>
        <div className={styles.siteCity}>{row.original.city}</div>
      </div>
    ),
  },
  {
    accessorKey: 'customer',
    header: t('dashboard.col.customer'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => (
      <span className={styles.customer}>{row.original.customer}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: t('dashboard.col.status'),
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'units',
    header: t('dashboard.col.units'),
    meta: { align: 'right', hideOnMobile: true },
    cell: ({ row }) => (
      <span className={styles.numericCell}>{row.original.units}</span>
    ),
  },
  {
    accessorKey: 'avgTemp',
    header: t('dashboard.col.avgTemp'),
    meta: { align: 'right' },
    cell: ({ row }) => (
      <span className={styles.tempCell} style={{ color: tempColor(row.original) }}>
        {formatTemperature(row.original.avgTemp)}
      </span>
    ),
  },
  {
    accessorKey: 'alerts',
    header: t('dashboard.col.alerts'),
    meta: { align: 'right', hideOnMobile: true },
    cell: ({ row }) => {
      const n = row.original.alerts;
      return n > 0 ? (
        <Badge color="error" size="sm">{n}</Badge>
      ) : (
        <span className={styles.noAlerts}>—</span>
      );
    },
  },
  {
    id: 'chevron',
    header: '',
    cell: () => (
      <span className={styles.chevron}>
        <ChevronRight size={16} />
      </span>
    ),
  },
  ], [t]);
}
