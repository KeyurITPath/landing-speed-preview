import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from '@/api';
import { DOMAIN, RAPID_API_KEY } from '@utils/constants';
import { getDomainName } from '@utils/helper';

export const fetchDomainDetails = createAsyncThunk(
    'defaults/fetchDomainDetails',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.home.fetchDomainDetails(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchDomainLogo = createAsyncThunk(
    'defaults/fetchDomainLogo',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.home.getDomainDetails(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getAllLanguages = createAsyncThunk(
    'defaults/getAllLanguages',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.common.getAllLanguages(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getIpAddress = createAsyncThunk(
    'defaults/getIpAddress',
    async (data, { rejectWithValue }) => {
        try {
            const options = {
                method: 'GET',
                url: 'https://telize-v1.p.rapidapi.com/location',
                headers: {
                    'x-rapidapi-key': RAPID_API_KEY,
                    'x-rapidapi-host': 'telize-v1.p.rapidapi.com'
                }

            };
            const { data } = await axios.request(options);
            const { country_code } = data || {};
            return country_code || 'US'; // Default to 'US' if country_code is not found
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchAllAnalyticsCredentials = createAsyncThunk(
    'course/fetchAllAnalyticsCredentials',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.home.getAllAnalyticsCredentials(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchAllFbAnalyticsCredentials = createAsyncThunk(
    'course/fetchAllFbAnalyticsCredentials',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.home.getAllFbAnalyticsCredentials(data);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const initialState = {
    course: {
        analyticsMetaCredentials: [],
        isFbAnalyticsCredentialsExists: false,
        isTiktokAnalyticsCredentialsExists: false,
        isTiktokAnalyticsCredentialsAPICalled: false,
        isFbAnalyticsCredentialsAPICalled: false
    },
    language: {
        id: 1
    },
    currency: {},
    domainDetails: {
        data: {
            domain_detail: {
                logo_width: 120,
                logo_height: 25
            }
        },
        loading: false
    },
    languages: {
        isLoading: false,
        data: []
    },
    country: {
        isLoading: false,
        country_code: "in"
    },
    domain_logo: {
        data: null
    }
};

const defaultsSlice = createSlice({
    name: 'defaults',
    initialState,
    reducers: {
        setCourse: (state, action) => {
            state.course = { ...state.course, ...action.payload };
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
        setCurrency: (state, action) => {
            state.currency = action.payload;
        },
        setCountry: (state, action) => {
            state.country = { ...state.country, ...action.payload };
        },
        resetCourse: (state) => {
            state.course = initialState.course;
        }
    },
    extraReducers: (builder) => {
        //fetchDomainDetails
        builder
            .addCase(fetchDomainDetails.pending, (state) => {
                state.domainDetails.loading = true;
                state.domainDetails.data = {
                    ...initialState.domainDetails.data,
                    domain_detail: {
                        ...initialState.domainDetails.data.domain_detail,
                        brand_name: getDomainName(DOMAIN),
                        logo_width: 120,
                        logo_height: 25
                    }
                };
            })
            .addCase(fetchDomainDetails.fulfilled, (state, action) => {
                state.domainDetails.loading = false;
                if (action.payload?.data?.domain_detail?.id) {
                    state.domainDetails.data = action.payload?.data;
                } else {
                    state.domainDetails = {
                        ...initialState.domainDetails,
                        data: {
                            ...initialState.domainDetails.data,
                            domain_detail: {
                                ...initialState.domainDetails.data.domain_detail,
                                brand_name: getDomainName(DOMAIN),
                                logo_width: 120,
                                logo_height: 25
                            }
                        }
                    };
                }
            })
            .addCase(fetchDomainDetails.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.loading = false;
                state.domainDetails = initialState.domainDetails;
            });

        //fetchDomainLogo
        builder
            .addCase(fetchDomainLogo.pending, (state) => {
                state.domain_logo.data = null;
            })
            .addCase(fetchDomainLogo.fulfilled, (state, action) => {
                state.domain_logo.data = action.payload?.data || null;
            })
            .addCase(fetchDomainLogo.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.domain_logo.data = null;
            });

        //getAllLanguages
        builder
            .addCase(getAllLanguages.pending, (state) => {
                state.languages.isLoading = true;
            })
            .addCase(getAllLanguages.fulfilled, (state, action) => {
                state.languages.isLoading = false;
                const {
                    payload: {
                        data: { result }
                    }
                } = action;
                state.languages.data = result;
            })
            .addCase(getAllLanguages.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.languages.isLoading = false;
            });

        // getIpAddress
        builder
            .addCase(getIpAddress.pending, (state) => {
                state.country.isLoading = true;
            })
            .addCase(getIpAddress.fulfilled, (state, action) => {
                state.country.isLoading = false;
                state.country.country_code = action.payload;
            })
            .addCase(getIpAddress.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    state.country.country_code = 'US';
                    return;
                }
                state.country.isLoading = false;
                state.country.country_code = 'US'; // Default to US if error occurs
            });

        // Analytics Credentials
        builder
            .addCase(fetchAllAnalyticsCredentials.fulfilled, (state, action) => {
                state.course.isTiktokAnalyticsCredentialsAPICalled = true;
                state.course.isTiktokAnalyticsCredentialsExists =
                    (!!action.payload?.data?.tiktok_pixel_id &&
                        !!action.payload?.data?.tiktok_access_token) ||
                    false;
            })
            .addCase(fetchAllAnalyticsCredentials.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
            });

        // Analytics Meta Credentials
        builder
            .addCase(fetchAllFbAnalyticsCredentials.fulfilled, (state, action) => {
                state.course.analyticsMetaCredentials = action.payload?.data || [];
                let isFbAnalyticsCredentialsExists_ = state.course.isFbAnalyticsCredentialsExists;
                if (action.payload?.data?.length) {
                    for (let i = 0; i < action.payload?.data?.length; i++) {
                        if (
                            action.payload?.data[i]?.tiktok_pixel_id &&
                            action.payload?.data[i]?.tiktok_access_token
                        ) {
                            isFbAnalyticsCredentialsExists_ = true;
                            break;
                        }
                    }
                }
                state.course.isFbAnalyticsCredentialsExists = isFbAnalyticsCredentialsExists_;
                state.course.isFbAnalyticsCredentialsAPICalled = true;
            })
            .addCase(fetchAllFbAnalyticsCredentials.rejected, (state, action) => {
                if (axios.isCancel(action.payload)) {
                    return;
                }
                state.analyticsMetaCredentials = [];
            });
    }
});
export const { setCourse, setLanguage, setCurrency, setCountry, resetCourse } =
    defaultsSlice.actions;

export default defaultsSlice.reducer;
