import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api';

export const fetchUser = createAsyncThunk('user/fetchUser', async (data: any, { rejectWithValue, signal }) => {
    try {
        const response = await api.user.get({ ...data, signal });
        return response?.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const initialState = {
    loading: false,
    data: {},
    failed: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.failed = false;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                const clone = { ...action.payload?.data };
                if (clone?.subscription_purchase_histories?.length) {
                    clone.subscription_purchase_histories = clone.subscription_purchase_histories.map(
                        (item: any) => {
                            return {
                                ...item,
                                subscription_plan: {
                                    ...item.plan_data,
                                    trial_days: item.trial_days || item.plan_data?.trial_days || 0
                                }
                            };
                        }
                    );
                }
                state.data = { ...clone };
                state.failed = false;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                // Check if the request was cancelled
                if (action.meta.aborted) {
                    return;
                }
                state.failed = true;
                state.loading = false;
            });
    }
});

export default userSlice.reducer;
