import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  size?: 'sm' | 'md';
  label?: string;
}

export function Select({ options, size = 'md', label, id, className, ...rest }: SelectProps) {
  return (
    <label className={styles.label}>
      {!!label && <span className={styles.labelText}>{label}</span>}
      <span className={cn(styles.wrap, className)}>
        <select id={id} className={cn(styles.select, size === 'sm' && styles.sm)} {...rest}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron}>
          <ChevronDown size={20} />
        </span>
      </span>
    </label>
  );
}
