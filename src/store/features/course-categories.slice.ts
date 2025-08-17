import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '@/api';

export const getAllCourseCategories = createAsyncThunk(
    'courseCategories/getAllCourseCategories',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.courseCategories.getAllCourseCategories(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const initialState = {
    courseCategories: {
        data: [],
        loading: false
    }
};

export const courseCategoriesSlice = createSlice({
    name: 'courseCategories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCourseCategories.pending, (state) => {
                state.courseCategories.loading = true;
            })
            .addCase(getAllCourseCategories.fulfilled, (state, action) => {
                state.courseCategories.loading = false;
                const {
                    payload: {
                        data: { result }
                    }
                } = action;
                state.courseCategories.data = result;
            })
            .addCase(getAllCourseCategories.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.courseCategories.loading = false;
                state.courseCategories = initialState.courseCategories;
            });
    }
});

export default courseCategoriesSlice.reducer;
