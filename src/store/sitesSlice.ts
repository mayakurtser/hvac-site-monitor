import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Site, SiteStatus, SitesQuery, FleetSummary, SortOrder } from '@/types';
import { fetchSites as fetchSitesService } from '@/mock/services/siteService';
import { loadFilters } from './sitesPersistence';

interface SitesState {
  rows: Site[];
  total: number;
  summary: FleetSummary;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: SiteStatus | 'all';
  sort: string;
  order: SortOrder;
  page: number;
}

const EMPTY_SUMMARY: FleetSummary = {
  total: 0,
  customers: 0,
  online: 0,
  healthPercent: 0,
  attention: 0,
  alerts: 0,
  criticalAlerts: 0,
  byStatus: { online: 0, warning: 0, critical: 0, maintenance: 0, offline: 0 },
};

const initialState: SitesState = {
  rows: [],
  total: 0,
  summary: EMPTY_SUMMARY,
  isLoading: true,
  error: null,
  searchQuery: '',
  statusFilter: 'all',
  sort: 'status',
  order: 'asc',
  page: 1,
  ...loadFilters(),
};

export const fetchSites = createAsyncThunk('sites/fetchAll', async (query: SitesQuery) => {
  return fetchSitesService(query);
});

const sitesSlice = createSlice({
  name: 'sites',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setStatusFilter(state, action: PayloadAction<SiteStatus | 'all'>) {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<{ sort: string; order: SortOrder }>) {
      state.sort = action.payload.sort;
      state.order = action.payload.order;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchSites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rows = action.payload.rows;
        state.total = action.payload.total;
        state.summary = action.payload.summary;
      })
      .addCase(fetchSites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'load_failed';
      }),
});

export const { setSearchQuery, setStatusFilter, setSort, setPage } = sitesSlice.actions;
export default sitesSlice.reducer;
