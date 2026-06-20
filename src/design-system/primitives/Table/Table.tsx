import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './Table.module.css';

export function TableWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(styles.tableWrap, className)}>{children}</div>;
}

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return <table className={cn(styles.table, className)}>{children}</table>;
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function TableRow({ children, onClick, className }: TableRowProps) {
  return (
    <tr
      className={className}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </tr>
  );
}

type Align = 'left' | 'right' | 'center';

function alignClass(align?: Align): string | undefined {
  if (align === 'right') return styles.alignRight;
  if (align === 'center') return styles.alignCenter;
  return undefined;
}

interface SortHeaderCellProps {
  children: React.ReactNode;
  sorted?: 'asc' | 'desc' | false;
  onSort?: () => void;
  align?: Align;
  hideOnMobile?: boolean;
  className?: string;
}

export function TableHeaderCell({ children, sorted, onSort, align, hideOnMobile, className }: SortHeaderCellProps) {
  const classes = cn(alignClass(align), hideOnMobile && styles.hideOnMobile, className);
  if (onSort) {
    return (
      <th
        className={classes}
        aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'}
      >
        <button
          type="button"
          className={cn(styles.sortBtn, sorted && styles.sortBtnActive)}
          onClick={onSort}
        >
          <span className={cn(styles.sortIcon, sorted && styles.sortIconActive)} aria-hidden="true">
            {sorted === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
          {children}
        </button>
      </th>
    );
  }
  return <th className={classes}>{children}</th>;
}

interface TableCellProps {
  children: React.ReactNode;
  strong?: boolean;
  align?: Align;
  hideOnMobile?: boolean;
  className?: string;
}

export function TableCell({ children, strong, align, hideOnMobile, className }: TableCellProps) {
  return (
    <td className={cn(strong && styles.strong, alignClass(align), hideOnMobile && styles.hideOnMobile, className)}>
      {children}
    </td>
  );
}
