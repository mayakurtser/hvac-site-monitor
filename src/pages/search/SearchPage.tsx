import { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { AppShell } from '@/components/layout';
import { DataTable } from '@/components/common';
import { EmptyState, Button } from '@/design-system';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { useSiteColumns } from '@/pages/dashboard/columns';
import styles from './SearchPage.module.css';

function useStaticColumns<T>(columns: ColumnDef<T>[]): ColumnDef<T>[] {
  return useMemo(() => columns.map((col) => ({ ...col, enableSorting: false })), [columns]);
}

export function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const query = params.get('q') ?? '';
  const hasQuery = query.trim().length > 0;
  const { sites, isLoading } = useGlobalSearch(query);

  const siteColumns = useStaticColumns(useSiteColumns());
  const origin = { label: t('search.title'), href: hasQuery ? `/search?q=${encodeURIComponent(query)}` : '/search' };

  function renderResults() {
    if (!hasQuery) {
      return <EmptyState title={t('search.noQueryTitle')} description={t('search.noQueryDescription')} />;
    }
    if (!isLoading && sites.length === 0) {
      return <EmptyState title={t('search.emptyTitle')} description={t('search.emptyDescription', { query })} />;
    }
    return (
      <DataTable
        columns={siteColumns}
        data={sites}
        isLoading={isLoading}
        onRowClick={(site) => navigate(`/sites/${site.id}`, { state: { from: origin } })}
      />
    );
  }

  return (
    <AppShell
      title={t('search.title')}
      subtitle={hasQuery ? t('search.subtitle', { count: sites.length, query }) : t('search.prompt')}
      breadcrumb={{ label: t('nav.sites'), href: '/' }}
      actions={
        <Button hierarchy="secondaryGray" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          {t('search.back')}
        </Button>
      }
    >
      <div className={styles.page}>{renderResults()}</div>
    </AppShell>
  );
}
