import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api';
import { DOMAIN, RAPID_API_KEY } from '@utils/constants';
import { getDomainName } from '@utils/helper';
import cookies from 'js-cookie';

export const fetchDomainDetails = createAsyncThunk(
  'defaults/fetchDomainDetails',
  async (data: any, { rejectWithValue, signal }) => {
    try {
      const response = await api.home.fetchDomainDetails({
        ...data,
        signal,
        headers: {
          ...data?.headers,
          'req-from':
            data?.headers?.['req-from'] || cookies.get('country_code') || '',
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchDomainLogo = createAsyncThunk(
  'defaults/fetchDomainLogo',
  async (data: any, { rejectWithValue, signal }) => {
    try {
      const response = await api.home.getDomainDetails({
        ...data,
        signal,
        headers: {
          ...data?.headers,
          'req-from':
            data?.headers?.['req-from'] || cookies.get('country_code') || '',
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllLanguages = createAsyncThunk(
  'defaults/getAllLanguages',
  async (data: any, { rejectWithValue, signal }) => {
    try {
      const response = await api.common.getAllLanguages({
        ...data,
        signal,
        headers: {
          ...data?.headers,
          'req-from':
            data?.headers?.['req-from'] || cookies.get('country_code') || '',
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getIpAddress = createAsyncThunk(
  'defaults/getIpAddress',
  async (data: any, { rejectWithValue, signal }) => {
    try {
      const response = await fetch(
        'https://telize-v1.p.rapidapi.com/location',
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key':
              RAPID_API_KEY ||
              '8f734bc7b2msh1a0a77977f46f49p106ea9jsnd970dd72aa4b',
            'x-rapidapi-host': 'telize-v1.p.rapidapi.com',
          },
          signal,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('data-02', data);
      const { country_code } = data || {};
      return country_code || 'US'; // Default to 'US' if country_code is not found
    } catch (error) {
      console.log('error01', error);
      return rejectWithValue(error);
    }
  }
);

export const fetchAllAnalyticsCredentials = createAsyncThunk(
  'course/fetchAllAnalyticsCredentials',
  async (data: any, { rejectWithValue, signal }) => {
    try {
      const response = await api.home.getAllAnalyticsCredentials({
        ...data,
        signal,
        headers: {
          ...data?.headers,
          'req-from':
            data?.headers?.['req-from'] || cookies.get('country_code') || '',
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllFbAnalyticsCredentials = createAsyncThunk(
  'course/fetchAllFbAnalyticsCredentials',
  async (data: any, { rejectWithValue, signal }) => {
    try {
      const response = await api.home.getAllFbAnalyticsCredentials({
        ...data,
        signal,
        headers: {
          ...data?.headers,
          'req-from':
            data?.headers?.['req-from'] || cookies.get('country_code') || '',
        },
      });
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
    isFbAnalyticsCredentialsAPICalled: false,
  },
  language: {
    id: 1,
  },
  currency: {},
  domainDetails: {
    data: {
      domain_detail: {
        logo_width: 120,
        logo_height: 25,
        brand_name: '',
      },
    },
    loading: false,
  },
  languages: {
    isLoading: false,
    data: [],
  },
  country: {
    isLoading: false,
    country_code: 'in',
  },
  domain_logo: {
    data: null,
  },
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
    resetCourse: state => {
      state.course = initialState.course;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDomainDetails.pending, state => {
        state.domainDetails.loading = true;
        state.domainDetails.data = {
          ...initialState.domainDetails.data,
          domain_detail: {
            ...initialState.domainDetails.data.domain_detail,
            brand_name: getDomainName(DOMAIN),
            logo_width: 120,
            logo_height: 25,
          },
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
                logo_height: 25,
              },
            },
          };
        }
      })
      .addCase(fetchDomainDetails.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.domainDetails.loading = false;
        state.domainDetails = initialState.domainDetails;
      });

    //fetchDomainLogo
    builder
      .addCase(fetchDomainLogo.pending, state => {
        state.domain_logo.data = null;
      })
      .addCase(fetchDomainLogo.fulfilled, (state, action) => {
        state.domain_logo.data = action.payload?.data || null;
      })
      .addCase(fetchDomainLogo.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.domain_logo.data = null;
      });

    //getAllLanguages
    builder
      .addCase(getAllLanguages.pending, state => {
        state.languages.isLoading = true;
      })
      .addCase(getAllLanguages.fulfilled, (state, action) => {
        state.languages.isLoading = false;
        const {
          payload: {
            data: { result },
          },
        } = action;
        state.languages.data = result;
      })
      .addCase(getAllLanguages.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.languages.isLoading = false;
      });

    // getIpAddress
    builder
      .addCase(getIpAddress.pending, state => {
        state.country.isLoading = true;
      })
      .addCase(getIpAddress.fulfilled, (state, action) => {
        state.country.isLoading = false;
        state.country.country_code = action.payload;
      })
      .addCase(getIpAddress.rejected, (state, action) => {
        if (action.meta.aborted) {
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
        if (action.meta.aborted) {
          return;
        }
      });

    // Analytics Meta Credentials
    builder
      .addCase(fetchAllFbAnalyticsCredentials.fulfilled, (state, action) => {
        cookies.set(
          'analyticsMetaCredentials',
          JSON.stringify(action.payload?.data || [])
        );
        state.course.analyticsMetaCredentials = action.payload?.data || [];
        let isFbAnalyticsCredentialsExists_ =
          state.course.isFbAnalyticsCredentialsExists;
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
        state.course.isFbAnalyticsCredentialsExists =
          isFbAnalyticsCredentialsExists_;
        state.course.isFbAnalyticsCredentialsAPICalled = true;
      })
      .addCase(fetchAllFbAnalyticsCredentials.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
      });
  },
});
export const { setCourse, setLanguage, setCurrency, setCountry, resetCourse } =
  defaultsSlice.actions;

export default defaultsSlice.reducer;
