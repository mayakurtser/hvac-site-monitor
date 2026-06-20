import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { SiteDetailPage } from './pages/site-detail/SiteDetailPage';
import { AlertsPage } from './pages/alerts/AlertsPage';
import { SearchPage } from './pages/search/SearchPage';
import styles from './App.module.css';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sites" replace />} />
      <Route path="/sites" element={<DashboardPage />} />
      <Route path="/sites/:id" element={<SiteDetailPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  const { t } = useTranslation();
  return <div className={styles.notFound}>{t('errors.pageNotFound')}</div>;
}
