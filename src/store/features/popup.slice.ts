import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api';
import axios from 'axios';

export const fetchSalesPopups = createAsyncThunk(
    'popup/fetchSalesPopups',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.popup.get(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchFreeTrialPopups = createAsyncThunk(
    'popup/fetchFreeTrialPopups',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.popup.monthlySubscription(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchCancelPopups = createAsyncThunk(
    'popup/fetchCancelPopups',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.popup.get(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchSubscriptionWithDiscount = createAsyncThunk(
    'popup/fetchSubscriptionWithDiscount',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.plan.getDiscountPlan(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchTrialPopups = createAsyncThunk(
    'popup/fetchTrialPopups',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.popup.get(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchTrialBannerPopups = createAsyncThunk(
    'popup/fetchTrialBannerPopups',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.popup.get(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchCancelDelayPopups = createAsyncThunk(
    'popup/fetchCancelDelayPopups',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.popup.cancelDelay(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchManageBilling = createAsyncThunk(
    'popup/fetchManageBilling',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.popup.manageBilling(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'popup/fetchCategories',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.popup.getCategories(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const initialState = {
    salesPopups: {
        loading: false,
        data: {}
    },
    cancelPopups: {
        loading: false,
        data: []
    },
    trialPopups: {
        loading: false,
        data: {}
    },
    trialBannerPopups: {
        loading: false,
        data: {}
    },
    categories: {
        loading: false,
        data: []
    },
    cancelDelayPopups: {
        loading: false,
        data: []
    },
    manageBilling: {
        loading: false,
        data: {}
    },
    monthlySubscription: {
        loading: false,
        data: {}
    },
    subscriptionWithDiscount: {
        loading: false,
        data: {}
    }
};

const popupSlice = createSlice({
    name: 'popup',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSalesPopups.pending, (state) => {
                state.salesPopups.loading = true;
            })
            .addCase(fetchSalesPopups.fulfilled, (state, action) => {
                state.salesPopups.loading = false;
                state.salesPopups.data = action.payload?.data || {};
            })
            .addCase(fetchSalesPopups.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.salesPopups.loading = false;
            });

        builder
            .addCase(fetchCancelPopups.pending, (state) => {
                state.cancelPopups.loading = true;
            })
            .addCase(fetchCancelPopups.fulfilled, (state, action) => {
                state.cancelPopups.loading = false;
                state.cancelPopups.data = action.payload?.data || {};
            })
            .addCase(fetchCancelPopups.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.cancelPopups.loading = false;
            });

        // monthlySubscription
        builder
            .addCase(fetchFreeTrialPopups.pending, (state) => {
                state.monthlySubscription.loading = true;
            })
            .addCase(fetchFreeTrialPopups.fulfilled, (state, action) => {
                state.monthlySubscription.loading = false;
                state.monthlySubscription.data = action.payload?.data || {};
            })
            .addCase(fetchFreeTrialPopups.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.monthlySubscription.loading = false;
            });

        builder
            .addCase(fetchTrialPopups.pending, (state) => {
                state.trialPopups.loading = true;
            })
            .addCase(fetchTrialPopups.fulfilled, (state, action) => {
                state.trialPopups.loading = false;
                state.trialPopups.data = action.payload?.data || {};
            })
            .addCase(fetchTrialPopups.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.trialPopups.loading = false;
            });

        builder
            .addCase(fetchTrialBannerPopups.pending, (state) => {
                state.trialBannerPopups.loading = true;
            })
            .addCase(fetchTrialBannerPopups.fulfilled, (state, action) => {
                state.trialBannerPopups.loading = false;
                state.trialBannerPopups.data = action.payload?.data || {};
            })
            .addCase(fetchTrialBannerPopups.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.trialBannerPopups.loading = false;
            });

        builder
            .addCase(fetchCategories.pending, (state) => {
                state.categories.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories.loading = false;
                state.categories.data = action.payload?.data?.result || {};
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.categories.loading = false;
            });

        builder
            .addCase(fetchCancelDelayPopups.pending, (state) => {
                state.cancelDelayPopups.loading = true;
            })
            .addCase(fetchCancelDelayPopups.fulfilled, (state, action) => {
                state.cancelDelayPopups.loading = false;
                state.cancelDelayPopups.data = action.payload?.data || [];
            })
            .addCase(fetchCancelDelayPopups.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.cancelDelayPopups.loading = false;
            });

        builder
            .addCase(fetchManageBilling.pending, (state) => {
                state.manageBilling.loading = true;
            })
            .addCase(fetchManageBilling.fulfilled, (state, action) => {
                state.manageBilling.loading = false;
                state.manageBilling.data = action.payload?.data || {};
            })
            .addCase(fetchManageBilling.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.manageBilling.loading = false;
            });

        builder
            .addCase(fetchSubscriptionWithDiscount.pending, (state) => {
                state.subscriptionWithDiscount.loading = true;
            })
            .addCase(fetchSubscriptionWithDiscount.fulfilled, (state, action) => {
                state.subscriptionWithDiscount.loading = false;
                state.subscriptionWithDiscount.data = action.payload?.data || {};
            })
            .addCase(fetchSubscriptionWithDiscount.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.subscriptionWithDiscount.loading = false;
            });
    }
});
// export const { } = popupSlice.actions;

export default popupSlice.reducer;
