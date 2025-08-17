import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api';
import axios from 'axios';

export const fetchDashboardCourses = createAsyncThunk(
    'dashboard/fetchDashboardCourses',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.dashboard.fetchDashboardCourses(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getAllPopularCoursesOnBrand = createAsyncThunk(
    'dashboard/getAllPopularCoursesOnBrand',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.dashboard.getAllPopularCoursesOnBrand(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getAllCourseOfTheWeek = createAsyncThunk(
    'dashboard/getAllCourseOfTheWeek',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.dashboard.getAllCourseOfTheWeek(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchGiftClaimReward = createAsyncThunk(
    'dashboard/fetchGiftClaimReward',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.dashboard.fetchGiftClaimReward(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUserInteractedDates = createAsyncThunk(
    'dashboard/fetchUserInteractedDates',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.dashboard.fetchUserInteractedDates(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getAllContinueWatchHistoryCoursesData = createAsyncThunk(
    'dashboard/getAllContinueWatchHistoryCoursesData',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.dashboard.getAllContinueWatchHistoryCoursesData(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const initialState = {
    courses: {
        data: [],
        loading: false,
        pagination: { search: '', limit: 8, page: 1, course_categories: [] },
        total_data: 1,
        current_page: 1
    },
    popularCoursesOnBrand: {
        data: [],
        loading: false,
        pagination: { search: '', limit: 8, page: 1, course_categories: [] },
        total_data: 1,
        current_page: 1
    },
    courseOfTheWeek: {
        data: {},
        loading: false
    },
    giftClaimReward: {
        data: {},
        loading: false
    },
    userInteractedDates: {
        data: [],
        total_login_days: 0,
        loading: false
    },
    continueWatchingCourse: {
        data: [],
        loading: false,
        pagination: { search: '', limit: 8, page: 1, course_categories: [] },
        total_data: 1,
        current_page: 1
    }
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        handlePagination: (state, action) => {
            state.courses.pagination = action.payload;
        },
        handlePaginationForPopularCoursesOnBrand: (state, action) => {
            state.popularCoursesOnBrand.pagination = action.payload;
        },
        resetPagination: (state) => {
            state.courses = initialState.courses;
            state.popularCoursesOnBrand = initialState.popularCoursesOnBrand;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardCourses.pending, (state) => {
                state.courses.loading = true;
            })

            .addCase(fetchDashboardCourses.fulfilled, (state, action) => {
                state.courses.loading = false;
                const {
                    payload: {
                        data: { result, pagination }
                    }
                } = action;
                state.courses.data = result;
                if (pagination) {
                    state.courses.total_data = pagination.totalItems;
                    state.courses.current_page = pagination.currentPage;
                }
            })

            .addCase(fetchDashboardCourses.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.courses = initialState.courses;
            });

        builder
            .addCase(getAllPopularCoursesOnBrand.pending, (state) => {
                state.popularCoursesOnBrand.loading = true;
            })

            .addCase(getAllPopularCoursesOnBrand.fulfilled, (state, action) => {
                state.popularCoursesOnBrand.loading = false;
                const {
                    payload: {
                        data: { result, pagination }
                    }
                } = action;
                state.popularCoursesOnBrand.data = result;
                if (pagination) {
                    state.popularCoursesOnBrand.total_data = pagination.totalItems;
                    state.popularCoursesOnBrand.current_page = pagination.currentPage;
                }
            })

            .addCase(getAllPopularCoursesOnBrand.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.popularCoursesOnBrand = initialState.popularCoursesOnBrand;
            });

        builder
            .addCase(getAllCourseOfTheWeek.pending, (state) => {
                state.courseOfTheWeek.loading = true;
            })
            .addCase(getAllCourseOfTheWeek.fulfilled, (state, action) => {
                state.courseOfTheWeek.loading = false;

                const {
                    payload: {
                        data: { result }
                    }
                } = action;
                state.courseOfTheWeek.data = result?.[0] || {};
            })
            .addCase(getAllCourseOfTheWeek.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.courseOfTheWeek.loading = false;
                state.courseOfTheWeek = initialState.courseOfTheWeek;
            });

        builder
            .addCase(fetchGiftClaimReward.pending, (state) => {
                state.giftClaimReward.loading = true;
            })
            .addCase(fetchGiftClaimReward.fulfilled, (state, action) => {
                state.giftClaimReward.loading = false;
                state.giftClaimReward.data = action.payload?.data || {};
            })
            .addCase(fetchGiftClaimReward.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.giftClaimReward.loading = false;
                state.giftClaimReward = initialState.giftClaimReward;
            });
        builder
            .addCase(fetchUserInteractedDates.pending, (state) => {
                state.userInteractedDates.loading = true;
            })
            .addCase(fetchUserInteractedDates.fulfilled, (state, action) => {
                state.userInteractedDates.loading = false;
                const {
                    payload: {
                        data: { result, total_login_days }
                    }
                } = action;
                state.userInteractedDates.data = result;
                state.userInteractedDates.total_login_days = total_login_days;
            })
            .addCase(fetchUserInteractedDates.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.userInteractedDates.loading = false;
                state.userInteractedDates = initialState.userInteractedDates;
            });
        builder
            .addCase(getAllContinueWatchHistoryCoursesData.pending, (state) => {
                state.continueWatchingCourse.loading = true;
            })
            .addCase(getAllContinueWatchHistoryCoursesData.fulfilled, (state, action) => {
                state.continueWatchingCourse.loading = false;
                const {
                    payload: {
                        data: { result, pagination }
                    }
                } = action;
                state.continueWatchingCourse.data = result;
                if (pagination) {
                    state.continueWatchingCourse.total_data = pagination.totalItems;
                    state.continueWatchingCourse.current_page = pagination.currentPage;
                }
            })
            .addCase(getAllContinueWatchHistoryCoursesData.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.continueWatchingCourse = initialState.continueWatchingCourse;
            });
    }
});
export const { resetPagination, handlePagination, handlePaginationForPopularCoursesOnBrand } =
    dashboardSlice.actions;

export default dashboardSlice.reducer;
