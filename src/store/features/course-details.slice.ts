import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api';

export const getUserCourseProgress = createAsyncThunk(
    'courseDetails/getUserCourseProgress',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.courseDetails.getUserCourseProgress(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getAllRecommendedCourses = createAsyncThunk(
    'courseDetails/getAllRecommendedCourses',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.courseDetails.getAllRecommendedCourses(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getAllPopularCoursesDataByCategories = createAsyncThunk(
    'courseDetails/getAllPopularCoursesDataByCategories',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.courseDetails.getAllPopularCoursesDataByCategories(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const initialState = {
    popularCoursesDataByCategories: {
        data: [],
        loading: false,
        pagination: { search: '', limit: 8, page: 1, course_categories: [] },
        total_data: 1,
        current_page: 1
    },
    getUserCourseProgress: {
        data: {},
        loading: false
    },
    getUserCourseProgressApiDataForCopy: {
        data: {},
        loading: false
    },
    recommendedCourses: {
        data: {},
        loading: false
    }
};

const courseDetailsSlice = createSlice({
    name: 'courseDetails',
    initialState,
    reducers: {
        handlePagination: (state, action) => {
            state.popularCoursesDataByCategories.pagination = action.payload;
        },
        resetPagination: (state) => {
            state.popularCoursesDataByCategories = initialState.popularCoursesDataByCategories;
        },
        updateWatchCourseModuleLesson: (state, action) => {
            state.getUserCourseProgress.data = action.payload;
        },
        updateCourseModuleLessonWatchTime: (state, action) => {
            state.getUserCourseProgress.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPopularCoursesDataByCategories.pending, (state) => {
                state.popularCoursesDataByCategories.loading = true;
            })
            .addCase(getAllPopularCoursesDataByCategories.fulfilled, (state, action) => {
                state.popularCoursesDataByCategories.loading = false;
                const {
                    payload: {
                        data: { result, pagination }
                    }
                } = action;
                state.popularCoursesDataByCategories.data = result;
                if (pagination) {
                    state.popularCoursesDataByCategories.total_data = pagination.totalItems;
                    state.popularCoursesDataByCategories.current_page = pagination.currentPage;
                }
            })
            .addCase(getAllPopularCoursesDataByCategories.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.popularCoursesDataByCategories = initialState.popularCoursesDataByCategories;
            });

        builder
            .addCase(getUserCourseProgress.pending, (state) => {
                state.getUserCourseProgress.loading = true;
            })
            .addCase(getUserCourseProgress.fulfilled, (state, action) => {
                state.getUserCourseProgress.loading = false;
                state.getUserCourseProgress.data = action?.payload?.data || {};
                state.getUserCourseProgressApiDataForCopy.data = action?.payload?.data || {};
            })
            .addCase(getUserCourseProgress.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.getUserCourseProgress = initialState.getUserCourseProgress;
            });

        builder
            .addCase(getAllRecommendedCourses.pending, (state) => {
                state.recommendedCourses.loading = true;
            })
            .addCase(getAllRecommendedCourses.fulfilled, (state, action) => {
                state.recommendedCourses.loading = false;
                state.recommendedCourses.data = action?.payload?.data || {};
            })
            .addCase(getAllRecommendedCourses.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.recommendedCourses = initialState.recommendedCourses;
            });
    }
});
export const {
    handlePagination,
    resetPagination,
    updateWatchCourseModuleLesson,
    updateCourseModuleLessonWatchTime
} = courseDetailsSlice.actions;

export default courseDetailsSlice.reducer;
