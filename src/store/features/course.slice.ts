import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api';

export const fetchCourse = createAsyncThunk(
  'course/fetchCourse',
  async (data: any, { rejectWithValue, signal }) => {
    try {
      const response = await api.home.course({ ...data, signal });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllUpSales = createAsyncThunk(
  'course/fetchAllUpSales',
  async (data: any, { rejectWithValue, signal }) => {
    try {
      const response = await api.home.getAllUpSales({ ...data, signal });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const initialState = {
  loading: true,
  data: {},
  getAccessState: false,
  defaultCoursePrice: {},
  upSaleCourses: [],
  failed: false,
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    getAccessOpen: state => {
      state.getAccessState = true;
    },
    getAccessClose: state => {
      state.getAccessState = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCourse.pending, state => {
        state.loading = true;
        state.failed = false;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload?.data;

        const isDiscountedPrice = data?.discountPrices?.length !== 0;

        let APIResponseData = data;

        if (isDiscountedPrice) {
          const course_prices = data?.course?.course_prices?.map(
            ({ ...rest }) => {
              const { amount, stripe_price_id, currency } =
                data?.discountPrices?.[0] || {};

              return { ...rest, stripe_price_id, price: amount, currency };
            }
          );

          APIResponseData = {
            ...data,
            course: { ...data?.course, course_prices },
          };
        } else {
          APIResponseData = data;
        }

        const APIResponseLanguageId =
          data?.landing_page_translations[0]?.language_id;

        const APIResponseCoursePriceData =
          APIResponseData?.course?.course_prices?.filter(
            ({ language_id }: any) => language_id === APIResponseLanguageId
          );

        APIResponseData = {
          ...APIResponseData,
          course: {
            ...APIResponseData?.course,
            course_prices: APIResponseCoursePriceData,
          },
        };

        state.data = APIResponseData;
        state.defaultCoursePrice = APIResponseData?.course?.course_prices?.find(
          ({ language_id }: any) => language_id === APIResponseLanguageId
        );
        state.failed = false;
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.loading = false;
        state.failed = true;
      });

    // Up Sale Courses
    builder
      .addCase(fetchAllUpSales.fulfilled, (state, action) => {
        state.upSaleCourses = action.payload?.data || [];
      })
      .addCase(fetchAllUpSales.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.upSaleCourses = [];
      });
  },
});
export const { getAccessOpen, getAccessClose } = courseSlice.actions;

export default courseSlice.reducer;
