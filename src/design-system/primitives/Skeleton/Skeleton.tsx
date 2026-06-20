import { cn } from '@/utils/cn';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <span className={cn(styles.skeleton, className)} aria-hidden="true" />;
}
