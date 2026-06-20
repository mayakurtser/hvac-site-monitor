import React, { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/design-system/primitives/Badge';
import type { AlertRow, AlertSeverity } from '@/types/site';
import { formatRelativeTime } from '@/utils/relativeTime';
import styles from './alertColumns.module.css';

const SEV_COLOR: Record<AlertSeverity, string> = {
  critical: 'var(--error-500)',
  warning: 'var(--warning-500)',
  info: 'var(--gray-400)',
};

const SEV_BADGE: Record<AlertSeverity, 'error' | 'warning' | 'gray'> = {
  critical: 'error',
  warning: 'warning',
  info: 'gray',
};

export function useAlertColumns(): ColumnDef<AlertRow>[] {
  const { t } = useTranslation();
  return useMemo(
    () => [
      {
        accessorKey: 'desc',
        header: t('alerts.col.description'),
        enableSorting: false,
        cell: ({ row }) => (
          <div className={styles.descCell}>
            <span className={styles.dot} style={{ color: SEV_COLOR[row.original.severity] }} />
            <span className={styles.descText}>{row.original.desc}</span>
          </div>
        ),
      },
      {
        accessorKey: 'severity',
        header: t('alerts.col.severity'),
        cell: ({ row }) => (
          <Badge color={SEV_BADGE[row.original.severity]} size="sm">
            {t(`severity.${row.original.severity}`)}
          </Badge>
        ),
      },
      {
        accessorKey: 'siteName',
        header: t('alerts.col.site'),
        meta: { hideOnMobile: true },
        cell: ({ row }) => (
          <div>
            <div className={styles.siteName}>{row.original.siteName}</div>
            <div className={styles.customer}>{row.original.customer}</div>
          </div>
        ),
      },
      {
        accessorKey: 'at',
        header: t('alerts.col.timestamp'),
        meta: { align: 'right' },
        cell: ({ row }) => (
          <span className={styles.timestamp}>{formatRelativeTime(row.original.at, t)}</span>
        ),
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
    ],
    [t],
  );
}
