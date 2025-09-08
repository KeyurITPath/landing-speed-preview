import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '@/api';
import cookie from 'js-cookie';

export const getAllCountries = createAsyncThunk(
  'countries/getAllCountries',
  async (data: any, { rejectWithValue, signal }) => {
    try {
      const response = await api.countries.getAllCountries({
        ...data,
        signal,
        headers: {
          ...data?.headers,
          'req-from':
            data?.headers?.['req-from'] || cookie.get('country_code') || '',
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const initialState = {
  countries: {
    isLoading: false,
    data: [],
  },
};

export const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllCountries.pending, state => {
        state.countries.isLoading = true;
      })
      .addCase(getAllCountries.fulfilled, (state, action) => {
        state.countries.isLoading = false;
        const {
          payload: {
            data: { result },
          },
        } = action;
        state.countries.data = result;
      })
      .addCase(getAllCountries.rejected, (state, action) => {
        // Check if the request was cancelled
        if (action.meta.aborted) {
          return;
        }
        state.countries.isLoading = false;
      });
  },
});

export default countriesSlice.reducer;
