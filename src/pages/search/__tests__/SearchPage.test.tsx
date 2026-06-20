import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Routes, Route, useParams } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import { i18n } from '@/i18n';
import sitesReducer from '@/store/sitesSlice';
import siteDetailReducer from '@/store/siteDetailSlice';
import { SearchPage } from '../SearchPage';

function SiteProbe() {
  const { id } = useParams();
  return <div data-testid="site-id">{id}</div>;
}

function renderSearch(entries: string[]) {
  const store = configureStore({ reducer: { sites: sitesReducer, siteDetail: siteDetailReducer } });
  render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={entries}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/sites/:id" element={<SiteProbe />} />
            <Route path="/alerts" element={<div data-testid="alerts-page" />} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </Provider>,
  );
}

describe('SearchPage', () => {
  it('prompts for a query when none is given', () => {
    renderSearch(['/search']);

    expect(screen.getByText('Search the fleet')).toBeInTheDocument();
  });

  it('offers a breadcrumb back to the sites list', () => {
    renderSearch(['/search']);

    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(breadcrumb).getByRole('link', { name: 'Sites' })).toHaveAttribute('href', '/');
  });

  it('returns to the previous screen via the back button', async () => {
    renderSearch(['/alerts', '/search?q=lakeside']);

    await userEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(screen.getByTestId('alerts-page')).toBeInTheDocument();
  });

  it('lists matching site results for a query', async () => {
    renderSearch(['/search?q=lakeside']);

    expect(await screen.findByText('Milwaukee, WI')).toBeInTheDocument();
  });

  it('navigates to the site detail when a result row is clicked', async () => {
    renderSearch(['/search?q=lakeside']);

    await userEvent.click(await screen.findByText('Milwaukee, WI'));

    expect(screen.getByTestId('site-id')).toHaveTextContent('lakeside-mall');
  });

  it('shows an empty state when nothing matches', async () => {
    renderSearch(['/search?q=zzzznomatch']);

    expect(await screen.findByText('No results found')).toBeInTheDocument();
  });
});
