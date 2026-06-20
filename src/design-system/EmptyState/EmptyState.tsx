import React from 'react';
import { FeaturedIcon } from '@/design-system/primitives/FeaturedIcon';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <FeaturedIcon icon="search" color="gray" size="lg" theme="modern" />
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
      {action != null && <div>{action}</div>}
    </div>
  );
}
