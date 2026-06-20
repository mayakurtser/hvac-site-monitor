import React from 'react';
import { cn } from '@/utils/cn';
import styles from './Button.module.css';

export type ButtonHierarchy =
  | 'primary'
  | 'secondaryGray'
  | 'secondaryColor'
  | 'tertiaryGray'
  | 'linkGray'
  | 'primaryDestructive';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hierarchy?: ButtonHierarchy;
  size?: ButtonSize;
  href?: string;
  children?: React.ReactNode;
}

export function Button({
  hierarchy = 'primary',
  size = 'md',
  href,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const cls = cn(styles.btn, styles[hierarchy], styles[size], className);

  if (href && !disabled) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
