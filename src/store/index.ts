import { configureStore } from '@reduxjs/toolkit';
import sitesReducer from './sitesSlice';
import siteDetailReducer from './siteDetailSlice';
import { saveFilters, type PersistedFilters } from './sitesPersistence';

export const store = configureStore({
  reducer: {
    sites: sitesReducer,
    siteDetail: siteDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

function selectFilters(state: RootState): PersistedFilters {
  const { searchQuery, statusFilter, sort, order, page } = state.sites;
  return { searchQuery, statusFilter, sort, order, page };
}

let lastFilters = selectFilters(store.getState());
store.subscribe(() => {
  const next = selectFilters(store.getState());
  if (
    next.searchQuery !== lastFilters.searchQuery ||
    next.statusFilter !== lastFilters.statusFilter ||
    next.sort !== lastFilters.sort ||
    next.order !== lastFilters.order ||
    next.page !== lastFilters.page
  ) {
    lastFilters = next;
    saveFilters(next);
  }
});
