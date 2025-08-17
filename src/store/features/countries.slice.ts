import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '@/api';
import axios from 'axios';

export const getAllCountries = createAsyncThunk(
    'countries/getAllCountries',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.countries.getAllCountries(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const initialState = {
    countries: {
        isLoading: false,
        data: []
    }
};

export const countriesSlice = createSlice({
    name: 'countries',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCountries.pending, (state) => {
                state.countries.isLoading = true;
            })
            .addCase(getAllCountries.fulfilled, (state, action) => {
                state.countries.isLoading = false;
                const {
                    payload: {
                        data: { result }
                    }
                } = action;
                state.countries.data = result;
            })
            .addCase(getAllCountries.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.countries.isLoading = false;
            });
    }
});

export default countriesSlice.reducer;
