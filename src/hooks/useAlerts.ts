import { useCallback, useEffect, useState } from 'react';
import type { AlertsQuery, AlertsResult } from '@/types';
import { fetchAlerts } from '@/mock/services/alertService';

const EMPTY: AlertsResult = {
  rows: [],
  total: 0,
  summary: { critical: 0, warning: 0, info: 0 },
};

export function useAlerts({ page, pageSize, sort, order, search, severity }: AlertsQuery) {
  const [result, setResult] = useState<AlertsResult>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchAlerts({ page, pageSize, sort, order, search, severity }).then((res) => {
      if (!active) return;
      setResult(res);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [page, pageSize, sort, order, search, severity, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return { rows: result.rows, total: result.total, summary: result.summary, isLoading, refetch };
}
