import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi } from 'vitest';
import { i18n } from '@/i18n';
import sitesReducer from '@/store/sitesSlice';
import { RefreshButton } from '../RefreshButton';

function renderWithProviders(ui: React.ReactNode) {
  const store = configureStore({ reducer: { sites: sitesReducer } });
  return render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </Provider>,
  );
}

describe('RefreshButton', () => {
  it('invokes the provided onRefresh instead of refetching sites', async () => {
    const onRefresh = vi.fn();
    renderWithProviders(<RefreshButton onRefresh={onRefresh} isLoading={false} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('reflects the passed isLoading independent of the sites slice', () => {
    renderWithProviders(<RefreshButton onRefresh={vi.fn()} isLoading />);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
