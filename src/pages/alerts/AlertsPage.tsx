import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { SortingState, OnChangeFn } from '@tanstack/react-table';
import { functionalUpdate } from '@tanstack/react-table';
import { AppShell, RefreshButton } from '@/components/layout';
import { MetricCard, Select, Toolbar, SearchInput } from '@/design-system';
import { DataTable, Pager } from '@/components/common';
import { useAlerts } from '@/hooks/useAlerts';
import { useDebounce } from '@/hooks/useDebounce';
import { useAlertColumns } from './alertColumns';
import { loadAlertFilters, saveAlertFilters } from './alertFilters';
import { ALERT_SEVERITIES, type AlertSeverity } from '@/types/site';
import { PAGE_SIZE } from '@/constants';
import styles from './AlertsPage.module.css';

export function AlertsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [initialFilters] = useState(loadAlertFilters);
  const [searchInput, setSearchInput] = useState(initialFilters?.search ?? '');
  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>(
    initialFilters?.severity ?? 'all',
  );
  const [page, setPage] = useState(initialFilters?.page ?? 1);
  const [sorting, setSorting] = useState<SortingState>(
    initialFilters?.sort
      ? [{ id: initialFilters.sort, desc: initialFilters.order === 'desc' }]
      : [{ id: 'severity', desc: false }],
  );

  const debouncedSearch = useDebounce(searchInput, 300);
  const alertColumns = useAlertColumns();

  const sortCol = sorting[0];
  const { rows, total, summary, isLoading, refetch } = useAlerts({
    page,
    pageSize: PAGE_SIZE,
    sort: sortCol ? sortCol.id : '',
    order: sortCol?.desc ? 'desc' : 'asc',
    search: debouncedSearch,
    severity: severityFilter,
  });

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting((prev) => functionalUpdate(updater, prev));
    setPage(1);
  };

  const severityOptions = useMemo(
    () => [
      { value: 'all', label: t('alerts.allSeverities') },
      ...ALERT_SEVERITIES.map((s) => ({ value: s, label: t(`severity.${s}`) })),
    ],
    [t],
  );

  const prevQuery = useRef({ search: debouncedSearch, severity: severityFilter });
  useEffect(() => {
    if (prevQuery.current.search === debouncedSearch && prevQuery.current.severity === severityFilter) {
      return;
    }
    prevQuery.current = { search: debouncedSearch, severity: severityFilter };
    setPage(1);
  }, [debouncedSearch, severityFilter]);

  useEffect(() => {
    const col = sorting[0];
    saveAlertFilters({
      search: debouncedSearch,
      severity: severityFilter,
      sort: col ? col.id : '',
      order: col?.desc ? 'desc' : 'asc',
      page,
    });
  }, [debouncedSearch, severityFilter, sorting, page]);

  const totalUnfiltered = summary.critical + summary.warning + summary.info;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AppShell
      title={t('alerts.title')}
      subtitle={t('alerts.subtitle')}
      actions={<RefreshButton onRefresh={refetch} isLoading={isLoading} />}
    >
      <div className={styles.page}>
        <div className={styles.statGrid}>
          <MetricCard
            icon="alert-triangle"
            color="error"
            label={t('severity.critical')}
            value={summary.critical}
            caption={t('alerts.stat.criticalFoot')}
          />
          <MetricCard
            icon="alert-circle"
            color="warning"
            label={t('severity.warning')}
            value={summary.warning}
            caption={t('alerts.stat.warningFoot')}
          />
          <MetricCard
            icon="info"
            color="brand"
            label={t('severity.info')}
            value={summary.info}
            caption={t('alerts.stat.infoFoot')}
          />
        </div>

        <DataTable
          columns={alertColumns}
          data={rows}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          onRowClick={(row) => navigate(`/sites/${row.siteId}`)}
          isLoading={isLoading}
          emptyTitle={t('alerts.emptyTitle')}
          emptyDescription={t('common.tryAdjusting')}
          toolbar={
            <Toolbar>
              <SearchInput
                grow
                value={searchInput}
                onChange={setSearchInput}
                placeholder={t('alerts.searchPlaceholder')}
                ariaLabel={t('alerts.searchAria')}
                clearAriaLabel={t('common.clearSearch')}
              />
              <div className={styles.selectWrap}>
                <Select
                  options={severityOptions}
                  size="sm"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as 'all' | AlertSeverity)}
                  aria-label={t('alerts.filterSeverityAria')}
                />
              </div>
              <span className={styles.resultCount}>
                {t('alerts.resultCount', { filtered: total, total: totalUnfiltered })}
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
                onPageChange={setPage}
              />
            )
          }
        />
      </div>
    </AppShell>
  );
}
