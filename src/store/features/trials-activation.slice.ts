import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '@/api';
import axios from 'axios';

export const fetchTrialActivation = createAsyncThunk(
    'trialsActivation/fetchTrialActivation',
    async (
        data: { [x: string]: any; params: any; },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.trialsActivation.fetchTrialActivation(data) as { data?: { data?: any } };
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const initialState = {
    trialsActivation: {
        data: [],
        loading: false
    }
};

const trialsActivationSlice = createSlice({
    name: 'trialsActivation',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrialActivation.pending, (state) => {
                state.trialsActivation.loading = true;
            })
            .addCase(fetchTrialActivation.fulfilled, (state, action) => {
                state.trialsActivation.loading = false;
                const {
                    payload: { result }
                } = action;
                state.trialsActivation.data = result;
            })
            .addCase(fetchTrialActivation.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.trialsActivation.loading = false;
                state.trialsActivation.data = initialState.trialsActivation;
            });
    }
});

export default trialsActivationSlice.reducer;
