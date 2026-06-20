import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/design-system';
import type { SiteStatus } from '@/types/site';

const STATUS_COLOR: Record<SiteStatus, 'success' | 'warning' | 'error' | 'blue' | 'gray'> = {
  online: 'success',
  warning: 'warning',
  critical: 'error',
  maintenance: 'blue',
  offline: 'gray',
};

interface StatusBadgeProps {
  status: SiteStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { t } = useTranslation();
  const color = STATUS_COLOR[status] ?? STATUS_COLOR.offline;
  return (
    <Badge color={color} size={size} dot>
      {t(`status.${status}`)}
    </Badge>
  );
}
