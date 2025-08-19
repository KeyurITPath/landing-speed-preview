import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '@/api';

export const getWidgetScriptData = createAsyncThunk(
  'profile/getWidgetScriptData',
  async (data: any, { rejectWithValue, signal }) => {
    try {
      const response = await api.tolstoyComments.fetchTolstoyScript({
        ...data,
        signal,
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const initialState = {
  isLoading: false,
  data: {},
};

export const widgetScriptSlice = createSlice({
  name: 'widgetScript',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getWidgetScriptData.pending, state => {
        state.isLoading = true;
      })
      .addCase(getWidgetScriptData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getWidgetScriptData.rejected, (state, action) => {
        // Check if the request was cancelled
        if (action.meta.aborted) {
          return;
        }
        state.isLoading = false;
        state.data = initialState.data;
      });
  },
});

export default widgetScriptSlice.reducer;
