import React from 'react';
import { Sidebar } from '../Sidebar';
import { MobileBar } from '../MobileBar';
import { AppHeader } from '../AppHeader';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href: string } | null;
  actions?: React.ReactNode;
}

export function AppShell({ children, title, subtitle, breadcrumb, actions }: AppShellProps) {
  return (
    <div className={styles.root}>
      <Sidebar />

      <div className={styles.main}>
        <MobileBar />
        <AppHeader title={title} subtitle={subtitle} breadcrumb={breadcrumb} actions={actions} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
