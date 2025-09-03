'use client';
import { Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useCallback, useMemo } from 'react';
import { shouldOfferTrial } from '@/utils/helper';
import CourseCard from '@/components/course-card';
import useToggleState from '@/hooks/use-toggle-state';
import TrialPopup from '@/components/trial-popup';
import { useSearchParams, useRouter } from 'next/navigation';
import { ICONS } from '../../../assets/icons';

const SearchContainer = ({
  isBecomeAMemberWithVerified,
  isLoggedIn,
  user,
  courseResponse,
}: any) => {
  const t = useTranslations();

  const [trialPopupState, trialPopupOpen, trialPopupClose] = useToggleState({});
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const popularCoursesOnBrandData = courseResponse || [];

  const shouldOfferTrials = useMemo(() => shouldOfferTrial(user), [user]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

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
        <Stack spacing={1}>
          <Stack
            component={'div'}
            onClick={handleBack}
            sx={{
              cursor: 'pointer',
              marginTop: {xs: '8px!important', md: 0}
            }}
            alignItems='center'
            direction='row'
            gap={1}
          >
            <ICONS.ARROW_LEFT />
            <Typography>{t('go_back')}</Typography>
          </Stack>
          <Typography
            fontSize={{ xs: 28, sm: 32 }}
            sx={{ fontWeight: 500, color: '#0E0E0E' }}
          >
            {t('search_results')}: {searchParams.get('query')}
          </Typography>
        </Stack>
        <CourseCard
          {...{
            POPULAR_BRAND_COURSES_DATA: popularCoursesOnBrandData,
            isPopularBrandCoursesDataLoading: false,
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
