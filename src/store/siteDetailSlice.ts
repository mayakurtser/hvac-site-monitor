import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Site } from '@/types/site';
import { fetchSiteById } from '@/mock/services/siteService';

interface SiteDetailState {
  site: Site | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SiteDetailState = {
  site: null,
  isLoading: false,
  error: null,
};

export const fetchSiteDetail = createAsyncThunk('siteDetail/fetch', async (id: string) => {
  return fetchSiteById(id);
});

const siteDetailSlice = createSlice({
  name: 'siteDetail',
  initialState,
  reducers: {
    reset(state) {
      state.site = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchSiteDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSiteDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.site = action.payload ?? null;
      })
      .addCase(fetchSiteDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'load_failed';
      }),
});

export const { reset } = siteDetailSlice.actions;
export default siteDetailSlice.reducer;
