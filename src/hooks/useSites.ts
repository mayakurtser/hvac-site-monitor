import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSites } from '@/store/sitesSlice';
import { PAGE_SIZE } from '@/constants';

export function useSites() {
  const dispatch = useAppDispatch();
  const { rows, total, summary, isLoading, error, searchQuery, statusFilter, sort, order, page } =
    useAppSelector((s) => s.sites);

  useEffect(() => {
    dispatch(
      fetchSites({ page, pageSize: PAGE_SIZE, sort, order, search: searchQuery, status: statusFilter }),
    );
  }, [dispatch, page, sort, order, searchQuery, statusFilter]);

  return { rows, total, summary, isLoading, error };
}
