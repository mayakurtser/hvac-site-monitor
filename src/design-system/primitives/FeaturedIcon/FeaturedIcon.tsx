import React from 'react';
import * as LucideIcons from 'lucide-react';

type IconName = string;
type FeaturedIconColor = 'brand' | 'gray' | 'error' | 'warning' | 'success';
type FeaturedIconSize = 'sm' | 'md' | 'lg' | 'xl';
type FeaturedIconTheme = 'light' | 'outline' | 'modern';

interface FeaturedIconProps {
  icon: IconName | React.ReactNode;
  color?: FeaturedIconColor;
  size?: FeaturedIconSize;
  theme?: FeaturedIconTheme;
  shape?: 'circle' | 'square';
  className?: string;
  style?: React.CSSProperties;
}

const SIZES = {
  sm: { box: 32, icon: 16, r: 'var(--radius-md)' },
  md: { box: 40, icon: 20, r: 'var(--radius-lg)' },
  lg: { box: 48, icon: 24, r: 'var(--radius-lg)' },
  xl: { box: 56, icon: 28, r: 'var(--radius-xl)' },
};

const COLORS: Record<FeaturedIconColor, [string, string, string]> = {
  brand:   ['var(--brand-50)',   'var(--brand-100)',   'var(--brand-600)'],
  gray:    ['var(--gray-50)',    'var(--gray-100)',    'var(--gray-600)'],
  error:   ['var(--error-50)',   'var(--error-100)',   'var(--error-600)'],
  warning: ['var(--warning-50)', 'var(--warning-100)', 'var(--warning-600)'],
  success: ['var(--success-50)', 'var(--success-100)', 'var(--success-600)'],
};

function LucideIcon({ name, size }: { name: string; size: number }) {
  const pascalName = name
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[pascalName];
  return Icon ? <Icon size={size} /> : null;
}

export function FeaturedIcon({
  icon,
  color = 'brand',
  size = 'md',
  theme = 'light',
  shape = 'circle',
  className,
  style,
}: FeaturedIconProps) {
  const sz = SIZES[size];
  const [bg50, bg100, fg] = COLORS[color];
  const radius = shape === 'circle' ? '9999px' : sz.r;

  const base: React.CSSProperties = {
    width: sz.box,
    height: sz.box,
    borderRadius: radius,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: fg,
    flexShrink: 0,
    ...style,
  };

  if (theme === 'outline') {
    base.background = 'var(--bg-primary)';
    base.boxShadow = `0 0 0 1px ${bg100}, 0 0 0 6px ${bg50}`;
  } else if (theme === 'modern') {
    base.background = 'var(--bg-primary)';
    base.color = 'var(--fg-secondary)';
    base.border = '1px solid var(--border-primary)';
    base.boxShadow = 'var(--shadow-xs)';
  } else {
    base.background = bg100;
  }

  return (
    <span className={className} style={base}>
      {typeof icon === 'string' ? <LucideIcon name={icon} size={sz.icon} /> : icon}
    </span>
  );
}
