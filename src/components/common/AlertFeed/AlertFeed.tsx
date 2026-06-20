import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import {
  Badge,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '@/design-system';
import { cn } from '@/utils/cn';
import { formatRelativeTime } from '@/utils/relativeTime';
import type { AlertSeverity } from '@/types/site';
import styles from './AlertFeed.module.css';

export interface AlertFeedItem {
  id: string;
  desc: string;
  severity: AlertSeverity;
  at: number;
}

interface AlertFeedProps {
  items: AlertFeedItem[];
  emptyTitle?: string;
  emptyDescription?: string;
}

const SEV: Record<
  AlertSeverity,
  { icon: React.ReactNode; iconClass: string; badgeColor: 'error' | 'warning' | 'gray' }
> = {
  critical: {
    icon: <AlertTriangle size={16} />,
    iconClass: styles.iconCritical,
    badgeColor: 'error',
  },
  warning: {
    icon: <AlertCircle size={16} />,
    iconClass: styles.iconWarning,
    badgeColor: 'warning',
  },
  info: {
    icon: <Info size={16} />,
    iconClass: styles.iconInfo,
    badgeColor: 'gray',
  },
};

export function AlertFeed({ items, emptyTitle, emptyDescription }: AlertFeedProps) {
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyTitle}>{emptyTitle ?? t('alertFeed.emptyTitle')}</div>
        <div className={styles.emptyDesc}>{emptyDescription ?? t('alertFeed.emptyDescription')}</div>
      </div>
    );
  }

  return (
    <div className={styles.bleed}>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>{t('alertFeed.colDescription')}</TableHeaderCell>
            <TableHeaderCell>{t('alertFeed.colSeverity')}</TableHeaderCell>
            <TableHeaderCell>
              <span className={styles.thRight}>{t('alertFeed.colTimestamp')}</span>
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const sv = SEV[item.severity];
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className={styles.descCell}>
                    <span className={cn(styles.icon, sv.iconClass)}>{sv.icon}</span>
                    <span className={styles.descText}>{item.desc}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge color={sv.badgeColor} size="sm">
                    {t(`severity.${item.severity}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={styles.timestamp}>{formatRelativeTime(item.at, t)}</span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
