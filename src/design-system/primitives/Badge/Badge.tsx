import { cn } from '@/utils/cn';
import styles from './Badge.module.css';

export type BadgeColor = 'gray' | 'brand' | 'error' | 'warning' | 'success' | 'blue';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children?: React.ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

export function Badge({ children, color = 'gray', size = 'sm', dot, className }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[color], styles[size], className)}>
      {!!dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
