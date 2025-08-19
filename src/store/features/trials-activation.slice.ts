import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '@/api';

export const fetchTrialActivation = createAsyncThunk(
    'trialsActivation/fetchTrialActivation',
    async (
        data: { [x: string]: any; params?: any; } = {},
        { rejectWithValue, signal }
    ) => {
        try {
            const response = await api.trialsActivation.fetchTrialActivation({ ...data, signal }) as { data?: { data?: any } };
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
    reducers: {},
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
                // Check if the request was cancelled
                if (action.meta.aborted) {
                    return;
                }
                state.trialsActivation.loading = false;
                state.trialsActivation.data = initialState.trialsActivation.data;
            });
    }
});

export default trialsActivationSlice.reducer;
