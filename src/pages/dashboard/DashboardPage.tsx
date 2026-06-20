import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { SortingState, OnChangeFn } from '@tanstack/react-table';
import { functionalUpdate } from '@tanstack/react-table';
import { AppShell } from '@/components/layout';
import { MetricCard, Card, Select, Toolbar, SearchInput } from '@/design-system';
import { DataTable, Pager, StatusBar } from '@/components/common';
import { useSites } from '@/hooks/useSites';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery, setStatusFilter, setSort, setPage } from '@/store/sitesSlice';
import { useSiteColumns } from './columns';
import { SITE_STATUSES, type Site, type SiteStatus } from '@/types/site';
import { PAGE_SIZE } from '@/constants';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { rows, total, summary, isLoading } = useSites();
  const { searchQuery, statusFilter, sort, order, page } = useAppSelector((s) => s.sites);
  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedInput = useDebounce(inputValue, 300);
  const siteColumns = useSiteColumns();

  const sorting: SortingState = sort ? [{ id: sort, desc: order === 'desc' }] : [];

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const col = functionalUpdate(updater, sorting)[0];
    dispatch(
      setSort(
        col ? { sort: col.id, order: col.desc ? 'desc' : 'asc' } : { sort: '', order: 'asc' },
      ),
    );
  };

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('dashboard.allStatuses') },
      ...SITE_STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) })),
    ],
    [t],
  );

  useEffect(() => {
    if (debouncedInput !== searchQuery) {
      dispatch(setSearchQuery(debouncedInput));
    }
  }, [debouncedInput, searchQuery, dispatch]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function handleRowClick(site: Site) {
    navigate(`/sites/${site.id}`);
  }

  return (
    <AppShell
      title={t('dashboard.title')}
      subtitle={t('dashboard.subtitle', { count: summary.total })}
    >
      <div className={styles.page}>
        <div className={styles.statGrid}>
          <MetricCard
            icon="globe"
            color="brand"
            label={t('dashboard.stat.totalSites')}
            value={summary.total}
            caption={t('dashboard.stat.totalSitesCaption', { count: summary.customers })}
          />
          <MetricCard
            icon="check-circle"
            color="success"
            label={t('dashboard.stat.online')}
            value={summary.online}
            caption={t('dashboard.stat.onlineCaption', { percent: summary.healthPercent })}
            captionTone="success"
          />
          <MetricCard
            icon="alert-triangle"
            color="warning"
            label={t('dashboard.stat.needAttention')}
            value={summary.attention}
            caption={t('dashboard.stat.needAttentionCaption')}
          />
          <MetricCard
            icon="bell"
            color="error"
            label={t('dashboard.stat.activeAlerts')}
            value={summary.alerts}
            caption={t('dashboard.stat.activeAlertsCaption', { count: summary.criticalAlerts })}
            captionTone="error"
          />
        </div>

        {summary.total > 0 && (
          <Card padding={24}>
            <div className={styles.sectionLabel}>{t('dashboard.fleetStatus')}</div>
            <StatusBar counts={summary.byStatus} />
          </Card>
        )}

        <DataTable
          columns={siteColumns}
          data={rows}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          onRowClick={handleRowClick}
          isLoading={isLoading}
          emptyTitle={t('dashboard.emptyTitle')}
          emptyDescription={t('common.tryAdjusting')}
          toolbar={
            <Toolbar>
              <SearchInput
                grow
                value={inputValue}
                onChange={setInputValue}
                placeholder={t('dashboard.searchPlaceholder')}
                ariaLabel={t('dashboard.searchAria')}
                clearAriaLabel={t('common.clearSearch')}
              />
              <div className={styles.selectWrap}>
                <Select
                  options={statusOptions}
                  size="sm"
                  value={statusFilter}
                  onChange={(e) => dispatch(setStatusFilter(e.target.value as SiteStatus | 'all'))}
                  aria-label={t('dashboard.filterStatusAria')}
                />
              </div>
              <span className={styles.resultCount}>
                {t('dashboard.siteCount', { count: total })}
              </span>
            </Toolbar>
          }
          footer={
            pageCount > 1 && (
              <Pager
                page={page}
                pageCount={pageCount}
                pageSize={PAGE_SIZE}
                total={total}
                onPageChange={(p) => dispatch(setPage(p))}
              />
            )
          }
        />
      </div>
    </AppShell>
  );
}
