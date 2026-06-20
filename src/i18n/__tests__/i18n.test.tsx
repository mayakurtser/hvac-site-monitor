import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect } from 'vitest';
import { i18n } from '@/i18n';
import { StatusBadge } from '@/components/common';

describe('i18n', () => {
  it('resolves a translated label through the useTranslation hook', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <StatusBadge status="online" />
      </I18nextProvider>,
    );
    expect(screen.getByText('Online')).toBeDefined();
  });

  it('applies plural rules based on count', () => {
    expect(i18n.t('dashboard.siteCount', { count: 1 })).toBe('1 site');
    expect(i18n.t('dashboard.siteCount', { count: 5 })).toBe('5 sites');
  });

  it('interpolates named values', () => {
    expect(i18n.t('pager.showing', { from: 1, to: 10, total: 42 })).toBe(
      'Showing 1–10 of 42',
    );
  });

  it('falls back to the key when a translation is missing', () => {
    expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
  });
});
