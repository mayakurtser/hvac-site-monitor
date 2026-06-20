import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './Input.module.css';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  search: Search,
};

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeading?: string;
  trailing?: React.ReactNode;
  inputRef?: React.Ref<HTMLInputElement>;
  size?: 'sm' | 'md';
  id?: string;
}

export function Input({
  label,
  hint,
  error,
  iconLeading,
  trailing,
  inputRef,
  size = 'md',
  id,
  className,
  ...rest
}: InputProps) {
  const hintText = error || hint;
  const IconComp = iconLeading ? ICON_MAP[iconLeading] : null;

  return (
    <label className={cn(styles.field, className)} htmlFor={id}>
      {!!label && <span className={styles.label}>{label}</span>}
      <span
        className={cn(
          styles.inputWrap,
          styles[size],
          error && styles.inputWrapError,
        )}
      >
        {IconComp != null && (
          <span className={styles.icon}>
            <IconComp size={20} />
          </span>
        )}
        <input id={id} ref={inputRef} className={styles.input} {...rest} />
        {trailing != null && <span className={styles.trailing}>{trailing}</span>}
      </span>
      {!!hintText && (
        <span className={cn(styles.hint, error && styles.hintError)}>{hintText}</span>
      )}
    </label>
  );
}
