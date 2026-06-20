import React from 'react';
import { cn } from '@/utils/cn';
import styles from './Card.module.css';

interface CardProps {
  children?: React.ReactNode;
  padding?: number;
  className?: string;
  style?: React.CSSProperties;
  elevated?: boolean;
}

export function Card({ children, padding = 24, className, style, elevated }: CardProps) {
  return (
    <div
      className={cn(styles.card, elevated && styles.elevated, className)}
      style={{ padding, ...style }}
    >
      {children}
    </div>
  );
}
