import type { Site } from '@/types';
import { MOCK_SITES } from '../data/sites';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const RESULT_LIMIT = 12;

export async function searchAll(query: string): Promise<Site[]> {
  await delay(300);

  const term = query.trim().toLowerCase();
  if (!term) return [];

  return MOCK_SITES.filter(
    (s) =>
      s.name.toLowerCase().includes(term) ||
      s.customer.toLowerCase().includes(term) ||
      s.city.toLowerCase().includes(term),
  ).slice(0, RESULT_LIMIT);
}
