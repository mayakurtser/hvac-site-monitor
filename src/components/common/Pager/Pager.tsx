import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pager.module.css';
import { cn } from '@/utils/cn';

interface PagerProps {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pager({ page, pageCount, pageSize, total, onPageChange }: PagerProps) {
  const { t } = useTranslation();
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages = buildPageNumbers(page, pageCount);

  return (
    <div className={styles.pager}>
      <span className={styles.label}>
        {total === 0 ? t('pager.noResults') : t('pager.showing', { from, to, total })}
      </span>
      <div className={styles.controls}>
        <button
          className={styles.btn}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label={t('pager.previousAria')}
        >
          <ChevronLeft size={16} />
          <span>{t('pager.previous')}</span>
        </button>
        <div className={styles.pages}>
          {pages.map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className={styles.ellipsis}>
                …
              </span>
            ) : (
              <button
                key={p}
                className={cn(styles.pageBtn, p === page && styles.pageBtnActive)}
                onClick={() => onPageChange(p as number)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            ),
          )}
        </div>
        <button
          className={styles.btn}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label={t('pager.nextAria')}
        >
          <span>{t('pager.next')}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}
