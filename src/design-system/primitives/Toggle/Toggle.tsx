import React from 'react';
import { cn } from '@/utils/cn';
import styles from './Toggle.module.css';

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'checked'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ checked, onChange, className, disabled, ...rest }: ToggleProps) {
  return (
    <span className={cn(styles.toggle, className)}>
      <input
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        {...rest}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.knob} />
      </span>
    </span>
  );
}
