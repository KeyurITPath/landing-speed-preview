'use client';
import {
  Box,
  Container,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CustomInput from '@/shared/inputs/text-field';
import { ICONS } from '@/assets/icons';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchSearchCourseData } from '@/store/features/home.slice';
import { useSelector } from 'react-redux';
import { DOMAIN, SERVER_URL } from '@/utils/constants';
import { useDebounce } from '@/hooks/use-debouce';
import { formatCurrency, shouldOfferTrial, videoURL } from '@/utils/helper';
import CourseCard from '@/components/course-card';
import useToggleState from '@/hooks/use-toggle-state';
import TrialPopup from '@/components/trial-popup';

const SearchContainer = ({
  isBecomeAMemberWithVerified,
  isLoggedIn,
  user,
  language_id,
  country_code,
}: any) => {
  const t = useTranslations();

  const [searchTerm, setSearchTerm] = useState('');
  const [fetchSearchCourse] = useDispatchWithAbort(fetchSearchCourseData);
  const { loading, data } = useSelector(({ home }: any) => home?.search);
  const debouncedQuery = useDebounce(searchTerm, 500);
  const [trialPopupState, trialPopupOpen, trialPopupClose] = useToggleState({});

  const handleSearchChange = useCallback((e: any) => {
    const { value } = e.target;
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  useEffect(() => {
    if (language_id && country_code && fetchSearchCourse) {
      if (debouncedQuery) {
        fetchSearchCourse({
          params: {
            page: 1,
            limit: 8,
            language_id,
            domain: DOMAIN,
            ...(user?.id && { user_id: user?.id }),
            search: debouncedQuery,
          },
          headers: {
            'req-from': country_code,
          },
        });
      } else {
        fetchSearchCourse({
          params: {
            page: 1,
            limit: 8,
            language_id,
            domain: DOMAIN,
            ...(user?.id && { user_id: user?.id }),
          },
          headers: {
            'req-from': country_code,
          },
        });
      }
    }
  }, [country_code, language_id, fetchSearchCourse, debouncedQuery, user?.id]);

  const handleStartFree = useCallback(
    (id: any, title: any) => {
      trialPopupOpen({
        open: true,
        course_id: id,
        course_title: title,
      });
    },
    [trialPopupOpen]
  );

  const popularCoursesOnBrandData = useMemo(() => {
    if (!data?.length) return [];

    return data.map((course: any) => {
      // Destructure top-level fields
      const {
        id,
        discount = 0,
        course_translations,
        landing_pages,
        course_prices,
        course_categories,
        user,
      } = course;

      // Extract translation, landing, and price info once
      const courseTranslation = course_translations?.[0] || {};
      const {
        title = '',
        course_image,
        language_id: courseLangId,
      } = courseTranslation;

      const landingPage = landing_pages?.[0] || {};
      const landingTranslation =
        landingPage.landing_page_translations?.[0] || {};
      const { author_image, rating, final_url = '' } = landingTranslation;

      const domainRedirection =
        landingPage?.landing_name?.domain_detail?.domain?.name || '';

      const defaultPrice = course_prices?.[0] || {};
      const price = defaultPrice.price || 0;
      const currency = defaultPrice?.currency?.name || 'USD';

      // Only calculate original price if discount is applied
      const calculatedDiscount = discount ? 100 - discount : 100;
      const originalPriceValue =
        discount > 0 ? (price / calculatedDiscount) * 100 : price;

      // Build category string in a single pass (faster than filter → map → join)
      let categoryNames = '';
      if (course_categories?.length) {
        const catList = [];
        for (let i = 0; i < course_categories.length; i++) {
          const cat = course_categories[i];
          if (cat?.language_id === courseLangId && cat?.category?.name) {
            catList.push(cat.category.name);
          }
        }
        categoryNames = catList.join(' , ');
      }

      return {
        id,
        title,
        category: categoryNames,
        image: videoURL(course_image),
        instructor: {
          name: user?.name || '',
          avatar: author_image ? SERVER_URL + author_image : '',
        },
        rating,
        originalPrice: formatCurrency(originalPriceValue, currency),
        price: formatCurrency(price, currency),
        redirectionUrl: `${domainRedirection}/${final_url}`,
      };
    });
  }, [data]);

  const shouldOfferTrials = useMemo(() => shouldOfferTrial(user), [user]);

  return (
    <Container maxWidth='lg'>
      <Stack
        spacing={{ xs: 2, sm: 4 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          py: { xs: 1, sm: 4 },
          my: { xs: 0 },
        }}
      >
        <Stack spacing={2}>
          <Typography
            fontSize={{ xs: 28, sm: 32 }}
            sx={{ fontWeight: 500, color: '#0E0E0E' }}
          >
            {t('search_courses')}
          </Typography>
          <Typography fontSize={{ xs: 12, sm: 16 }} sx={{ color: '#303030' }}>
            {t('search_description')}
          </Typography>
        </Stack>
        <CustomInput
          placeholder={t('search')}
          size='small'
          value={searchTerm}
          handleChange={handleSearchChange}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment
                  position='end'
                  sx={{ color: '#808080', fontSize: 20 }}
                >
                  {searchTerm ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={clearSearch}
                    >
                      <ICONS.CLOSE sx={{ fontSize: 20 }} />
                    </Box>
                  ) : (
                    <ICONS.SEARCH />
                  )}
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: { xs: '100%', sm: 400 },
            '.MuiInputBase-root': {
              bgcolor: '#F5F5F5',
              borderRadius: '33px',
              border: 'none',
            },
            '.MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            input: {
              pl: 2,
              pr: 0,
              py: 0.8,
            },
          }}
        />
        <CourseCard
          {...{
            POPULAR_BRAND_COURSES_DATA: popularCoursesOnBrandData,
            isPopularBrandCoursesDataLoading: loading,
            isBecomeAMemberWithVerified,
            handleStartFree,
            isLoggedIn,
          }}
        />
      </Stack>
      {(isBecomeAMemberWithVerified || shouldOfferTrials) && (
        <TrialPopup
          {...{
            dashboardData: {
              trialPopupClose,
              trialPopupState,
            },
          }}
        />
      )}
    </Container>
  );
};

export default SearchContainer;
