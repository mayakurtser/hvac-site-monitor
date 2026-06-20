import React from 'react';
import { Card } from '@/design-system/primitives/Card';
import { FeaturedIcon } from '@/design-system/primitives/FeaturedIcon';
import { Skeleton } from '@/design-system/primitives/Skeleton';
import { cn } from '@/utils/cn';
import styles from './MetricCard.module.css';

type CaptionTone = 'muted' | 'success' | 'error' | 'brand';

interface MetricCardProps {
  icon: string;
  color?: 'brand' | 'gray' | 'error' | 'warning' | 'success';
  label: string;
  value: React.ReactNode;
  caption?: React.ReactNode;
  captionTone?: CaptionTone;
  loading?: boolean;
}

export function MetricCard({
  icon,
  color = 'brand',
  label,
  value,
  caption,
  captionTone = 'muted',
  loading,
}: MetricCardProps) {
  function renderValue() {
    if (loading) return <Skeleton className={styles.valueSkeleton} />;
    return <div className={styles.value}>{value}</div>;
  }

  function renderCaption() {
    if (caption == null) return null;
    if (loading) return <Skeleton className={styles.captionSkeleton} />;
    return (
      <div className={cn(styles.caption, captionTone !== 'muted' && styles[captionTone])}>
        {caption}
      </div>
    );
  }

  return (
    <Card padding={20}>
      <div className={styles.body}>
        <div className={styles.text}>
          <div className={styles.label}>{label}</div>
          {renderValue()}
          {renderCaption()}
        </div>
        <FeaturedIcon icon={icon} color={color} size="md" theme="light" />
      </div>
    </Card>
  );
}
