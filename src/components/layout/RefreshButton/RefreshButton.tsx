import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/design-system';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSites } from '@/store/sitesSlice';
import { cn } from '@/utils/cn';
import { PAGE_SIZE } from '@/constants';
import styles from './RefreshButton.module.css';

interface RefreshButtonProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function RefreshButton({ onRefresh, isLoading }: RefreshButtonProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const sites = useAppSelector((s) => s.sites);

  const handleRefresh =
    onRefresh ??
    (() =>
      dispatch(
        fetchSites({
          page: sites.page,
          pageSize: PAGE_SIZE,
          sort: sites.sort,
          order: sites.order,
          search: sites.searchQuery,
          status: sites.statusFilter,
        }),
      ));

  const loading = isLoading ?? sites.isLoading;

  return (
    <Button hierarchy="secondaryGray" onClick={handleRefresh} disabled={loading}>
      <RefreshCw size={16} className={cn(loading && styles.spinning)} />
      {t('appShell.refresh')}
    </Button>
  );
}
