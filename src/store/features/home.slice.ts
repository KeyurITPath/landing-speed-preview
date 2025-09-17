import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api';
import cookie from 'js-cookie';

export const fetchHomeCourses = createAsyncThunk(
  'home/fetchHomeCourses',
  async (data: any = {}, { rejectWithValue, signal }) => {
    try {
      const response = await api.home.fetchHomeCourses({
        ...data,
        signal,
        headers: {
          ...data?.headers,
          'req-from':
            data?.headers?.['req-from'] || cookie.get('country_code') || '',
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllPopularCoursesOnBrand = createAsyncThunk(
  'courseCategories/getAllPopularCoursesOnBrand',
  async (data: any = {}, { rejectWithValue, signal }) => {
    try {
      const response = await api.home.getAllPopularCoursesOnBrand({
        ...data,
        signal,
        headers: {
          ...data?.headers,
          'req-from':
            data?.headers?.['req-from'] || cookie.get('country_code') || '',
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchSearchCourseData = createAsyncThunk(
  'home/fetchSearchCourseData',
  async (data: any = {}, { rejectWithValue, signal }) => {
    try {
      const response = await api.home.fetchHomeCourses({
        ...data,
        signal,
        headers: {
          ...data?.headers,
          'req-from':
            data?.headers?.['req-from'] || cookie.get('country_code') || '',
        },
      });
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
    current_page: 1,
  },
  popularCoursesOnBrand: {
    data: [],
    loading: false,
    pagination: { search: '', limit: 8, page: 1, course_categories: [] },
    total_data: 1,
    current_page: 1,
  },
  search: {
    data: [],
    loading: true,
    pagination: { search: '', limit: 8, page: 1, course_categories: [] },
    total_data: 1,
    current_page: 1,
  },
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    handlePagination: (state, action) => {
      state.courses.pagination = action.payload;
    },
    handlePaginationForPopularCoursesOnBrand: (state, action) => {
      state.popularCoursesOnBrand.pagination = action.payload;
    },
    resetPagination: state => {
      state.courses = initialState.courses;
      state.popularCoursesOnBrand = initialState.popularCoursesOnBrand;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchHomeCourses.pending, state => {
        state.courses.loading = true;
      })

      .addCase(fetchHomeCourses.fulfilled, (state, action) => {
        state.courses.loading = false;
        const {
          payload: {
            data: { result, pagination },
          },
        } = action;
        state.courses.data = result;
        if (pagination) {
          state.courses.total_data = pagination.totalItems;
          state.courses.current_page = pagination.currentPage;
        }
      })

      .addCase(fetchHomeCourses.rejected, (state, action) => {
        // Check if the request was cancelled
        if (action.meta.aborted) {
          return;
        }
        state.courses = initialState.courses;
      });

    builder
      .addCase(fetchSearchCourseData.pending, state => {
        state.search.loading = true;
      })

      .addCase(fetchSearchCourseData.fulfilled, (state, action) => {
        state.search.loading = false;
        const {
          payload: {
            data: { result, pagination },
          },
        } = action;
        state.search.data = result;
        if (pagination) {
          state.search.total_data = pagination.totalItems;
          state.search.current_page = pagination.currentPage;
        }
      })

      .addCase(fetchSearchCourseData.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.search = initialState.search;
      });

    builder
      .addCase(getAllPopularCoursesOnBrand.pending, state => {
        state.popularCoursesOnBrand.loading = true;
      })

      .addCase(getAllPopularCoursesOnBrand.fulfilled, (state, action) => {
        state.popularCoursesOnBrand.loading = false;
        const {
          payload: {
            data: { result, pagination },
          },
        } = action;
        state.popularCoursesOnBrand.data = result;
        if (pagination) {
          state.popularCoursesOnBrand.total_data = pagination.totalItems;
          state.popularCoursesOnBrand.current_page = pagination.currentPage;
        }
      })

      .addCase(getAllPopularCoursesOnBrand.rejected, (state, action) => {
        // Check if the request was cancelled
        if (action.meta.aborted) {
          return;
        }
        state.popularCoursesOnBrand = initialState.popularCoursesOnBrand;
      });
  },
});
export const {
  resetPagination,
  handlePagination,
  handlePaginationForPopularCoursesOnBrand,
} = homeSlice.actions;

export default homeSlice.reducer;
