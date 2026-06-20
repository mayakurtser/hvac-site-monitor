import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { i18n } from '@/i18n';
import { Sidebar } from '../Sidebar';

function LocationProbe() {
  const { pathname, search } = useLocation();
  return <div data-testid="location">{pathname + search}</div>;
}

function renderSidebar(initialPath: string) {
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <Sidebar />
                <LocationProbe />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </I18nextProvider>,
  );
}

describe('Sidebar search', () => {
  it('navigates to the search results page on submit', async () => {
    renderSidebar('/alerts');

    await userEvent.type(screen.getByRole('textbox', { name: /search/i }), 'london{Enter}');

    expect(screen.getByTestId('location')).toHaveTextContent('/search?q=london');
  });

  it('fires the search when tabbing out of the field', async () => {
    renderSidebar('/alerts');

    await userEvent.type(screen.getByRole('textbox', { name: /search/i }), 'london');
    await userEvent.tab();

    expect(screen.getByTestId('location')).toHaveTextContent('/search?q=london');
  });

  it('clears the search box when leaving the results page', async () => {
    renderSidebar('/search?q=lakeside');
    const input = screen.getByRole('textbox', { name: /search/i });
    expect(input).toHaveValue('lakeside');

    await userEvent.click(screen.getByRole('link', { name: 'Alerts' }));

    expect(input).toHaveValue('');
  });

  it('does not navigate when the query is only whitespace', async () => {
    renderSidebar('/alerts');

    await userEvent.type(screen.getByRole('textbox', { name: /search/i }), '   {Enter}');

    expect(screen.getByTestId('location')).toHaveTextContent('/alerts');
  });

  it('seeds the input from the active query param', () => {
    renderSidebar('/search?q=lakeside');

    expect(screen.getByRole('textbox', { name: /search/i })).toHaveValue('lakeside');
  });
});

describe('Sidebar navigation', () => {
  it('marks Sites active on the sites routes', () => {
    renderSidebar('/sites/atrium-tower');

    expect(screen.getByRole('link', { name: 'Sites' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Alerts' })).not.toHaveAttribute('aria-current');
  });

  it('marks Alerts active on the alerts route', () => {
    renderSidebar('/alerts');

    expect(screen.getByRole('link', { name: 'Alerts' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Sites' })).not.toHaveAttribute('aria-current');
  });
});
