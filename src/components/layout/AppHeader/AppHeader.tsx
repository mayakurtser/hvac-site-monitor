import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RefreshButton } from '../RefreshButton';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href: string } | null;
  actions?: React.ReactNode;
}

export function AppHeader({ title, subtitle, breadcrumb, actions }: AppHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        {breadcrumb != null && (
          <nav className={styles.breadcrumb} aria-label={t('appShell.breadcrumb')}>
            <Link to={breadcrumb.href} className={styles.breadcrumbLink}>
              {breadcrumb.label}
            </Link>
            <span className={styles.breadcrumbSep} aria-hidden="true">
              ›
            </span>
            <span className={styles.breadcrumbCurrent} aria-current="page">
              {title}
            </span>
          </nav>
        )}
        <h1 className={styles.title}>{title}</h1>
        {!!subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      <div className={styles.actions}>{actions ?? <RefreshButton />}</div>
    </header>
  );
}
