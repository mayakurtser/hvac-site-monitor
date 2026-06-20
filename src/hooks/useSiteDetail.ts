import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSiteDetail, reset } from '@/store/siteDetailSlice';

export function useSiteDetail(id: string) {
  const dispatch = useAppDispatch();
  const { site, isLoading, error } = useAppSelector((s) => s.siteDetail);

  useEffect(() => {
    dispatch(fetchSiteDetail(id));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);

  return { site, isLoading, error };
}
