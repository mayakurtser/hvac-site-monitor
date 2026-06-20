import { render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import { i18n } from '@/i18n';
import sitesReducer from '@/store/sitesSlice';
import siteDetailReducer from '@/store/siteDetailSlice';
import { SiteDetailPage } from '../SiteDetailPage';

function renderDetail(pathname: string, state?: unknown) {
  const store = configureStore({ reducer: { sites: sitesReducer, siteDetail: siteDetailReducer } });
  render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[{ pathname, state }]}>
          <Routes>
            <Route path="/sites/:id" element={<SiteDetailPage />} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </Provider>,
  );
}

describe('SiteDetailPage breadcrumb', () => {
  it('points back to Sites by default', async () => {
    renderDetail('/sites/lakeside-mall');

    await screen.findByRole('heading', { level: 1, name: 'Lakeside Mall' });
    const link = within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByRole('link');
    expect(link).toHaveTextContent('Sites');
    expect(link).toHaveAttribute('href', '/');
  });

  it('points back to the search results when opened from search', async () => {
    renderDetail('/sites/lakeside-mall', {
      from: { label: 'Search results', href: '/search?q=lakeside' },
    });

    await screen.findByRole('heading', { level: 1, name: 'Lakeside Mall' });
    const link = within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByRole('link');
    expect(link).toHaveTextContent('Search results');
    expect(link).toHaveAttribute('href', '/search?q=lakeside');
  });
});
