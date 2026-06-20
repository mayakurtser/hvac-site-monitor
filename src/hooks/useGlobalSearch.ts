import { useEffect, useState } from 'react';
import type { Site } from '@/types';
import { searchAll } from '@/mock/services/searchService';

export function useGlobalSearch(query: string) {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSites([]);
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);
    searchAll(query).then((res) => {
      if (!active) return;
      setSites(res);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [query]);

  return { sites, isLoading };
}
