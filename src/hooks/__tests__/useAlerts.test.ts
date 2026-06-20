import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AlertsQuery, AlertsResult } from '@/types';
import { fetchAlerts } from '@/mock/services/alertService';
import { useAlerts } from '../useAlerts';

vi.mock('@/mock/services/alertService');

const RESULT: AlertsResult = {
  rows: [],
  total: 0,
  summary: { critical: 0, warning: 0, info: 0 },
};

const QUERY: AlertsQuery = {
  page: 1,
  pageSize: 10,
  sort: 'severity',
  order: 'asc',
  search: '',
  severity: 'all',
};

describe('useAlerts', () => {
  beforeEach(() => {
    vi.mocked(fetchAlerts).mockReset();
    vi.mocked(fetchAlerts).mockResolvedValue(RESULT);
  });

  it('refetch re-runs the alerts query without any input change', async () => {
    const { result } = renderHook(() => useAlerts(QUERY));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetchAlerts).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => expect(fetchAlerts).toHaveBeenCalledTimes(2));
  });
});
