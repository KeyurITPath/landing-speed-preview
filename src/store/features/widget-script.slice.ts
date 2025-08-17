import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from '@/api';

export const getWidgetScriptData = createAsyncThunk(
    'profile/getWidgetScriptData',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.tolstoyComments.fetchTolstoyScript(data);
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const initialState = {
    isLoading: false,
    data: {}
};

export const widgetScriptSlice = createSlice({
    name: 'widgetScript',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getWidgetScriptData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getWidgetScriptData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(getWidgetScriptData.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.isLoading = false;
                state.data = initialState.data;
            });
    }
});

export default widgetScriptSlice.reducer;
