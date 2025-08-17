import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api';

export const fetchCourse = createAsyncThunk(
    'course/fetchCourse',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.home.course(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchAllUpSales = createAsyncThunk(
    'course/fetchAllUpSales',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.home.getAllUpSales(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);



// export const fetchAllFbAnalyticsCredentials = createAsyncThunk(
//     'course/fetchAllFbAnalyticsCredentials',
//     async (data, { rejectWithValue }) => {
//         try {
//             const response = await api.home.getAllFbAnalyticsCredentials(data);
//             return response?.data;
//         } catch (error) {
//             return rejectWithValue(error);
//         }
//     }
// );

export const initialState = {
    loading: true,
    data: {},
    getAccessState: false,
    defaultCoursePrice: {},
    upSaleCourses: [],
    failed: false
    // analyticsCredentials: {},
    // analyticsMetaCredentials: [],
    // isPixelData: false
};

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        getAccessOpen: (state) => {
            state.getAccessState = true;
        },
        getAccessClose: (state) => {
            state.getAccessState = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourse.pending, (state) => {
                state.loading = true;
                state.failed = false;
            })
            .addCase(fetchCourse.fulfilled, (state, action) => {
                state.loading = false;

                const data = action.payload?.data;

                const isDiscountedPrice = data?.discountPrices?.length !== 0;

                let APIResponseData = data;

                if (isDiscountedPrice) {
                    const course_prices = data?.course?.course_prices?.map(({ ...rest }) => {
                        const { amount, stripe_price_id, currency } =
                            data?.discountPrices?.[0] || {};

                        return { ...rest, stripe_price_id, price: amount, currency };
                    });

                    APIResponseData = { ...data, course: { ...data?.course, course_prices } };
                } else {
                    APIResponseData = data;
                }

                const APIResponseLanguageId = data?.landing_page_translations[0]?.language_id;

                const APIResponseCoursePriceData = APIResponseData?.course?.course_prices?.filter(
                    ({ language_id }) => language_id === APIResponseLanguageId
                );

                APIResponseData = {
                    ...APIResponseData,
                    course: {
                        ...APIResponseData?.course,
                        course_prices: APIResponseCoursePriceData
                    }
                };

                state.data = APIResponseData;
                state.defaultCoursePrice = APIResponseData?.course?.course_prices?.find(
                    ({ language_id }) => language_id === APIResponseLanguageId
                );
                state.failed = false;
            })
            .addCase(fetchCourse.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
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
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.upSaleCourses = [];
            });

        // // Analytics Meta Credentials
        // builder
        //     .addCase(fetchAllFbAnalyticsCredentials.fulfilled, (state, action) => {
        //         state.analyticsMetaCredentials = action.payload?.data || {};
        //         state.isPixelData =
        //             Array.isArray(action.payload?.data) &&
        //             action.payload.data.length > 0 &&
        //             action.payload.data.every(
        //                 (item) => item.meta_pixel_id && item.meta_access_token
        //             );
        //     })
        //     .addCase(fetchAllFbAnalyticsCredentials.rejected, (state, action) => {
        //         if (axios.isCancel(action.payload)) {
        //             return;
        //         }
        //         state.analyticsMetaCredentials = [];
        //     });

        // // Analytics Credentials
        // builder
        //     .addCase(fetchAllAnalyticsCredentials.fulfilled, (state, action) => {
        //         state.analyticsCredentials = action.payload?.data || {};
        //         state.isPixelData =
        //             (!!action.payload?.data?.tiktok_pixel_id &&
        //                 !!action.payload?.data?.tiktok_access_token) ||
        //             false;
        //     })
        //     .addCase(fetchAllAnalyticsCredentials.rejected, (state, action) => {
        //         if (axios.isCancel(action.payload)) {
        //             return;
        //         }
        //         state.analyticsCredentials = {};
        //     });
    }
});
export const { getAccessOpen, getAccessClose } = courseSlice.actions;

export default courseSlice.reducer;
